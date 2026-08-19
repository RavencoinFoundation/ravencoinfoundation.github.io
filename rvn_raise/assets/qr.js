/*
 * Minimal QR Code encoder (byte mode, error-correction level M, versions 1-10).
 * No dependencies, no network. Returns a boolean module matrix.
 *
 * Usage: QR.encode("ravencoin:RKMR...")  ->  { size, modules }
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.QR = api;
}(typeof window !== 'undefined' ? window : globalThis, function () {
    'use strict';

    // Per-version structure for error-correction level M.
    // [total codewords, ec codewords per block, blocks in group 1, data cw in group 1, blocks in group 2, data cw in group 2]
    const VERSIONS = {
        1:  [26,  10, 1, 16, 0, 0],
        2:  [44,  16, 1, 28, 0, 0],
        3:  [70,  26, 1, 44, 0, 0],
        4:  [100, 18, 2, 32, 0, 0],
        5:  [134, 24, 2, 43, 0, 0],
        6:  [172, 16, 4, 27, 0, 0],
        7:  [196, 18, 4, 31, 0, 0],
        8:  [242, 22, 2, 38, 2, 39],
        9:  [292, 22, 3, 36, 2, 37],
        10: [346, 26, 4, 43, 1, 44]
    };

    const ALIGNMENT = {
        1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30],
        6: [6, 34], 7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50]
    };

    /* ---------- GF(256) arithmetic for Reed-Solomon ---------- */

    const EXP = new Uint8Array(512);
    const LOG = new Uint8Array(256);
    (function initTables() {
        let x = 1;
        for (let i = 0; i < 255; i++) {
            EXP[i] = x;
            LOG[x] = i;
            x <<= 1;
            if (x & 0x100) x ^= 0x11d;
        }
        for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
    }());

    function gfMul(a, b) {
        if (a === 0 || b === 0) return 0;
        return EXP[LOG[a] + LOG[b]];
    }

    function rsGenerator(degree) {
        let poly = [1];
        for (let i = 0; i < degree; i++) {
            const next = new Array(poly.length + 1).fill(0);
            for (let j = 0; j < poly.length; j++) {
                next[j] ^= poly[j];
                next[j + 1] ^= gfMul(poly[j], EXP[i]);
            }
            poly = next;
        }
        return poly;
    }

    function rsEncode(data, ecCount) {
        const generator = rsGenerator(ecCount);
        const remainder = new Array(ecCount).fill(0);
        for (const byte of data) {
            const factor = byte ^ remainder[0];
            remainder.shift();
            remainder.push(0);
            if (factor !== 0) {
                for (let i = 0; i < ecCount; i++) {
                    remainder[i] ^= gfMul(generator[i + 1], factor);
                }
            }
        }
        return remainder;
    }

    /* ---------- BCH codes for format and version information ---------- */

    function formatBits(maskPattern) {
        // Level M is encoded as 00.
        let value = (0b00 << 3) | maskPattern;
        let remainder = value << 10;
        for (let i = 14; i >= 10; i--) {
            if (remainder & (1 << i)) remainder ^= 0b10100110111 << (i - 10);
        }
        return ((value << 10) | remainder) ^ 0b101010000010010;
    }

    function versionBits(version) {
        let remainder = version << 12;
        for (let i = 17; i >= 12; i--) {
            if (remainder & (1 << i)) remainder ^= 0b1111100100101 << (i - 12);
        }
        return (version << 12) | remainder;
    }

    /* ---------- Encoding ---------- */

    function utf8Bytes(text) {
        if (typeof TextEncoder !== 'undefined') return Array.from(new TextEncoder().encode(text));
        return Array.from(unescape(encodeURIComponent(text)), c => c.charCodeAt(0));
    }

    function dataCapacity(version) {
        const [total, ecPerBlock, blocks1, data1, blocks2, data2] = VERSIONS[version];
        return blocks1 * data1 + blocks2 * data2;
    }

    function pickVersion(byteLength) {
        for (let version = 1; version <= 10; version++) {
            const countBits = version < 10 ? 8 : 16;
            const needed = Math.ceil((4 + countBits + byteLength * 8) / 8);
            if (needed <= dataCapacity(version)) return version;
        }
        throw new Error('Content is too long for this QR encoder');
    }

    function buildCodewords(bytes, version) {
        const capacity = dataCapacity(version);
        const countBits = version < 10 ? 8 : 16;
        const bits = [];
        const push = (value, length) => {
            for (let i = length - 1; i >= 0; i--) bits.push((value >> i) & 1);
        };

        push(0b0100, 4);
        push(bytes.length, countBits);
        for (const byte of bytes) push(byte, 8);

        const capacityBits = capacity * 8;
        for (let i = 0; i < 4 && bits.length < capacityBits; i++) bits.push(0);
        while (bits.length % 8 !== 0) bits.push(0);

        const codewords = [];
        for (let i = 0; i < bits.length; i += 8) {
            let byte = 0;
            for (let j = 0; j < 8; j++) byte = (byte << 1) | bits[i + j];
            codewords.push(byte);
        }
        const padding = [0xec, 0x11];
        for (let i = 0; codewords.length < capacity; i++) codewords.push(padding[i % 2]);
        return codewords;
    }

    function interleave(codewords, version) {
        const [total, ecPerBlock, blocks1, data1, blocks2, data2] = VERSIONS[version];
        const dataBlocks = [];
        const ecBlocks = [];
        let offset = 0;

        for (let i = 0; i < blocks1; i++) {
            const block = codewords.slice(offset, offset + data1);
            offset += data1;
            dataBlocks.push(block);
            ecBlocks.push(rsEncode(block, ecPerBlock));
        }
        for (let i = 0; i < blocks2; i++) {
            const block = codewords.slice(offset, offset + data2);
            offset += data2;
            dataBlocks.push(block);
            ecBlocks.push(rsEncode(block, ecPerBlock));
        }

        const result = [];
        const maxData = Math.max(data1, data2);
        for (let i = 0; i < maxData; i++) {
            for (const block of dataBlocks) if (i < block.length) result.push(block[i]);
        }
        for (let i = 0; i < ecPerBlock; i++) {
            for (const block of ecBlocks) result.push(block[i]);
        }
        return result;
    }

    /* ---------- Matrix construction ---------- */

    function createMatrix(version) {
        const size = version * 4 + 17;
        const modules = [];
        const reserved = [];
        for (let row = 0; row < size; row++) {
            modules.push(new Array(size).fill(false));
            reserved.push(new Array(size).fill(false));
        }

        const setFinder = (top, left) => {
            for (let row = -1; row <= 7; row++) {
                for (let col = -1; col <= 7; col++) {
                    const r = top + row;
                    const c = left + col;
                    if (r < 0 || r >= size || c < 0 || c >= size) continue;
                    const inRing = (row >= 0 && row <= 6 && (col === 0 || col === 6)) ||
                        (col >= 0 && col <= 6 && (row === 0 || row === 6));
                    const inCore = row >= 2 && row <= 4 && col >= 2 && col <= 4;
                    modules[r][c] = inRing || inCore;
                    reserved[r][c] = true;
                }
            }
        };

        setFinder(0, 0);
        setFinder(0, size - 7);
        setFinder(size - 7, 0);

        // Timing patterns
        for (let i = 8; i < size - 8; i++) {
            modules[6][i] = i % 2 === 0;
            modules[i][6] = i % 2 === 0;
            reserved[6][i] = true;
            reserved[i][6] = true;
        }

        // Alignment patterns
        const centers = ALIGNMENT[version];
        for (const rowCenter of centers) {
            for (const colCenter of centers) {
                const nearFinder =
                    (rowCenter <= 8 && colCenter <= 8) ||
                    (rowCenter <= 8 && colCenter >= size - 9) ||
                    (rowCenter >= size - 9 && colCenter <= 8);
                if (nearFinder) continue;
                for (let row = -2; row <= 2; row++) {
                    for (let col = -2; col <= 2; col++) {
                        const r = rowCenter + row;
                        const c = colCenter + col;
                        modules[r][c] = Math.max(Math.abs(row), Math.abs(col)) !== 1;
                        reserved[r][c] = true;
                    }
                }
            }
        }

        // Dark module
        modules[size - 8][8] = true;
        reserved[size - 8][8] = true;

        // Reserve format information areas
        for (let i = 0; i < 9; i++) {
            if (!reserved[8][i]) { reserved[8][i] = true; modules[8][i] = false; }
            if (!reserved[i][8]) { reserved[i][8] = true; modules[i][8] = false; }
        }
        for (let i = 0; i < 8; i++) {
            reserved[8][size - 1 - i] = true;
            reserved[size - 1 - i][8] = true;
        }

        // Reserve version information areas
        if (version >= 7) {
            for (let row = 0; row < 6; row++) {
                for (let col = 0; col < 3; col++) {
                    reserved[row][size - 11 + col] = true;
                    reserved[size - 11 + col][row] = true;
                }
            }
        }

        return { size, modules, reserved };
    }

    function placeData(matrix, codewords) {
        const { size, modules, reserved } = matrix;
        const bits = [];
        for (const codeword of codewords) {
            for (let i = 7; i >= 0; i--) bits.push((codeword >> i) & 1);
        }

        let index = 0;
        let upward = true;
        for (let right = size - 1; right >= 1; right -= 2) {
            if (right === 6) right = 5;
            for (let step = 0; step < size; step++) {
                const row = upward ? size - 1 - step : step;
                for (let offset = 0; offset < 2; offset++) {
                    const col = right - offset;
                    if (reserved[row][col]) continue;
                    modules[row][col] = index < bits.length ? bits[index] === 1 : false;
                    index++;
                }
            }
            upward = !upward;
        }
    }

    function maskFunction(pattern) {
        switch (pattern) {
            case 0: return (r, c) => (r + c) % 2 === 0;
            case 1: return (r) => r % 2 === 0;
            case 2: return (r, c) => c % 3 === 0;
            case 3: return (r, c) => (r + c) % 3 === 0;
            case 4: return (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0;
            case 5: return (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0;
            case 6: return (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0;
            default: return (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0;
        }
    }

    function penalty(modules, size) {
        let score = 0;

        // Rule 1: runs of five or more same-colour modules in a row or column.
        for (let i = 0; i < size; i++) {
            for (const horizontal of [true, false]) {
                let runColour = null;
                let runLength = 0;
                for (let j = 0; j < size; j++) {
                    const value = horizontal ? modules[i][j] : modules[j][i];
                    if (value === runColour) {
                        runLength++;
                    } else {
                        if (runLength >= 5) score += runLength - 2;
                        runColour = value;
                        runLength = 1;
                    }
                }
                if (runLength >= 5) score += runLength - 2;
            }
        }

        // Rule 2: 2x2 blocks of the same colour.
        for (let row = 0; row < size - 1; row++) {
            for (let col = 0; col < size - 1; col++) {
                const value = modules[row][col];
                if (value === modules[row][col + 1] && value === modules[row + 1][col] && value === modules[row + 1][col + 1]) {
                    score += 3;
                }
            }
        }

        // Rule 3: finder-like patterns.
        const patternA = [true, false, true, true, true, false, true, false, false, false, false];
        const patternB = [false, false, false, false, true, false, true, true, true, false, true];
        const matches = (get, start) => {
            for (const pattern of [patternA, patternB]) {
                let ok = true;
                for (let i = 0; i < 11; i++) {
                    if (get(start + i) !== pattern[i]) { ok = false; break; }
                }
                if (ok) return true;
            }
            return false;
        };
        for (let i = 0; i < size; i++) {
            for (let j = 0; j <= size - 11; j++) {
                if (matches(k => modules[i][k], j)) score += 40;
                if (matches(k => modules[k][i], j)) score += 40;
            }
        }

        // Rule 4: overall balance of dark modules.
        let dark = 0;
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) if (modules[row][col]) dark++;
        }
        const percent = (dark * 100) / (size * size);
        score += Math.floor(Math.abs(percent - 50) / 5) * 10;

        return score;
    }

    function applyFormat(modules, size, maskPattern) {
        const bits = formatBits(maskPattern);
        for (let i = 0; i < 15; i++) {
            const bit = ((bits >> i) & 1) === 1;
            // Copy beside the top-left finder
            if (i < 6) modules[i][8] = bit;
            else if (i === 6) modules[7][8] = bit;
            else if (i === 7) modules[8][8] = bit;
            else if (i === 8) modules[8][7] = bit;
            else modules[8][14 - i] = bit;
            // Duplicate copy split between the other two finders
            if (i < 8) modules[8][size - 1 - i] = bit;
            else modules[size - 15 + i][8] = bit;
        }
        modules[size - 8][8] = true; // dark module
    }

    function applyVersion(modules, size, version) {
        if (version < 7) return;
        const bits = versionBits(version);
        for (let i = 0; i < 18; i++) {
            const bit = ((bits >> i) & 1) === 1;
            const row = Math.floor(i / 3);
            const col = i % 3;
            modules[row][size - 11 + col] = bit;
            modules[size - 11 + col][row] = bit;
        }
    }

    function encode(text) {
        const bytes = utf8Bytes(String(text));
        const version = pickVersion(bytes.length);
        const codewords = interleave(buildCodewords(bytes, version), version);
        const matrix = createMatrix(version);
        placeData(matrix, codewords);

        const { size, modules, reserved } = matrix;
        let best = null;
        for (let pattern = 0; pattern < 8; pattern++) {
            const candidate = modules.map(row => row.slice());
            const shouldMask = maskFunction(pattern);
            for (let row = 0; row < size; row++) {
                for (let col = 0; col < size; col++) {
                    if (!reserved[row][col] && shouldMask(row, col)) candidate[row][col] = !candidate[row][col];
                }
            }
            applyFormat(candidate, size, pattern);
            applyVersion(candidate, size, version);
            const score = penalty(candidate, size);
            if (!best || score < best.score) best = { score, modules: candidate };
        }

        return { size, version, modules: best.modules };
    }

    /** Renders a QR matrix as a compact SVG path string. */
    function toSvg(text, { quietZone = 2, className = '' } = {}) {
        const { size, modules } = encode(text);
        const dimension = size + quietZone * 2;
        let path = '';
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if (modules[row][col]) path += `M${col + quietZone} ${row + quietZone}h1v1h-1z`;
            }
        }
        return `<svg class="${className}" viewBox="0 0 ${dimension} ${dimension}" role="img" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">` +
            `<rect width="${dimension}" height="${dimension}" fill="var(--qr-bg, #fff)"/>` +
            `<path d="${path}" fill="var(--qr-fg, #12261f)"/></svg>`;
    }

    return { encode, toSvg };
}));
