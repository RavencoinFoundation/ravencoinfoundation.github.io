/*
 * Fundraising thermometer for a Ravencoin address.
 *
 * Everything the page needs comes from the query string:
 *   ?rvn=100000&addr=R...&reason=Security%20audit%20of%20code
 * Optional:
 *   &mode=balance   gauge the address's current balance instead of everything it has ever received
 *   &rpc=https://…  point at your own Ravencoin RPC proxy instead of the public one
 *
 * Balances come from Ravencoin Core's address index over JSON-RPC — the same
 * endpoint and calls the KawTrace explorer uses (getaddressbalance).
 */
(function () {
    'use strict';

    const DEFAULT_RPC = 'https://rvn-rpc-mainnet.ting.finance/rpc';
    const EXPLORER = 'https://cerberuscx.github.io/KawTrace/#/address/';
    const DEFAULT_GOAL = 100000;
    const REFRESH_MS = 60000;
    const SATOSHI = 1e8;
    const ADDRESS_PATTERN = /^[Rr][1-9A-HJ-NP-Za-km-z]{25,40}$/;

    // On the Foundation's own domain a campaign has to be on the authorized list
    // before the page will run it. Everywhere else the page is unrestricted.
    const GATED_HOST = /(^|\.)ravencoin\.foundation$/i;
    const AUTHORIZED_LIST = 'foundation_authorized';

    // Vertical scale of the thermometer, in the SVG's own coordinates.
    const SCALE_TOP = 76;
    const SCALE_BOTTOM = 440;
    const TUBE_LEFT = 96;
    // Above the dome: filling to here floods the rounded tip once the goal is passed.
    const DOME_TOP = 26;

    const $ = id => document.getElementById(id);

    /* ---------- Query string ---------- */

    function readParams() {
        const raw = new URLSearchParams(window.location.search);
        const values = {};
        raw.forEach((value, key) => {
            const name = key.trim().toLowerCase();
            if (!(name in values)) values[name] = value;
        });
        return values;
    }

    /** Strips quotes people leave in hand-written URLs: reason="Security audit". */
    function unquote(value) {
        const text = String(value == null ? '' : value).trim();
        if (text.length > 1 && /^["'].*["']$/.test(text)) return text.slice(1, -1).trim();
        return text;
    }

    /** Accepts 100000, 100,000, 100k, 1.5M, "250 000 RVN". */
    function parseAmount(value) {
        const text = unquote(value).replace(/rvn/gi, '').replace(/[\s,_]/g, '');
        const match = /^([0-9]*\.?[0-9]+)([kmb])?$/i.exec(text);
        if (!match) return null;
        const multipliers = { k: 1e3, m: 1e6, b: 1e9 };
        const amount = parseFloat(match[1]) * (match[2] ? multipliers[match[2].toLowerCase()] : 1);
        return Number.isFinite(amount) && amount > 0 ? amount : null;
    }

    /* ---------- Formatting ---------- */

    function formatRvn(amount) {
        const decimals = amount >= 1000 ? 0 : amount >= 1 ? 2 : 4;
        return amount.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: decimals
        });
    }

    /** Short scale labels: 14.4K, 1.2M. */
    function formatCompact(amount) {
        try {
            return amount.toLocaleString(undefined, { notation: 'compact', maximumFractionDigits: 1 });
        } catch (error) {
            if (amount >= 1e6) return (amount / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
            if (amount >= 1e3) return (amount / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
            return String(Math.round(amount));
        }
    }

    function formatAge(milliseconds) {
        const seconds = Math.round(milliseconds / 1000);
        if (seconds < 45) return 'just now';
        const minutes = Math.round(seconds / 60);
        if (minutes < 60) return minutes + (minutes === 1 ? ' minute ago' : ' minutes ago');
        const hours = Math.round(minutes / 60);
        return hours + (hours === 1 ? ' hour ago' : ' hours ago');
    }

    /* ---------- Blockchain data ---------- */

    function rpc(endpoint, method, params) {
        return fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jsonrpc: '1.0', id: 'rvn-thermometer', method, params })
        }).then(response => {
            // A rejected call comes back as HTTP 500 with the node's reason in the body,
            // so read the body before trusting the status code.
            return response.json().catch(() => null).then(payload => {
                const failure = payload && payload.error;
                const reason = failure && (failure.message || (failure.error && failure.error.message));
                if (reason) throw new Error(reason);
                if (!response.ok) throw new Error('Explorer returned HTTP ' + response.status);
                if (!payload) throw new Error('Explorer returned an unreadable response');
                return payload.result;
            });
        });
    }

    async function fetchTotals(endpoint, address) {
        const [totals, mempool] = await Promise.all([
            rpc(endpoint, 'getaddressbalance', [{ addresses: [address] }]),
            rpc(endpoint, 'getaddressmempool', [{ addresses: [address] }]).catch(() => [])
        ]);

        const pending = (Array.isArray(mempool) ? mempool : [])
            .map(entry => Number(entry && entry.satoshis) || 0)
            .filter(satoshis => satoshis > 0)
            .reduce((sum, satoshis) => sum + satoshis, 0);

        return {
            balance: (Number(totals.balance) || 0) / SATOSHI,
            received: (Number(totals.received) || 0) / SATOSHI,
            pending: pending / SATOSHI
        };
    }

    /* ---------- Thermometer drawing ---------- */

    const SVG_NS = 'http://www.w3.org/2000/svg';

    function levelToY(fraction) {
        const clamped = Math.max(0, Math.min(1, fraction));
        return SCALE_BOTTOM - clamped * (SCALE_BOTTOM - SCALE_TOP);
    }

    function drawTicks(goal) {
        const ticks = $('ticks');
        // One style of label for the whole scale, so 14.4K never sits above 7,195.
        const abbreviate = goal >= 10000;
        while (ticks.firstChild) ticks.removeChild(ticks.firstChild);

        const marks = [
            { fraction: 0, major: true },
            { fraction: 0.125, major: false },
            { fraction: 0.25, major: true },
            { fraction: 0.375, major: false },
            { fraction: 0.5, major: true },
            { fraction: 0.625, major: false },
            { fraction: 0.75, major: true },
            { fraction: 0.875, major: false },
            { fraction: 1, major: true }
        ];

        marks.forEach(mark => {
            const y = levelToY(mark.fraction);
            const line = document.createElementNS(SVG_NS, 'line');
            line.setAttribute('x1', String(mark.major ? TUBE_LEFT - 22 : TUBE_LEFT - 12));
            line.setAttribute('x2', String(TUBE_LEFT - 2));
            line.setAttribute('y1', String(y));
            line.setAttribute('y2', String(y));
            if (mark.major) line.setAttribute('class', 'major');
            ticks.appendChild(line);

            if (!mark.major) return;
            const label = document.createElementNS(SVG_NS, 'text');
            label.setAttribute('x', String(TUBE_LEFT - 30));
            label.setAttribute('y', String(y + 6));
            label.setAttribute('class', 'major');
            label.textContent = abbreviate
                ? formatCompact(goal * mark.fraction)
                : Math.round(goal * mark.fraction).toLocaleString();
            ticks.appendChild(label);
        });
    }

    function paintLevel(fraction, percent, exceeded) {
        const level = levelToY(fraction);
        const top = exceeded ? DOME_TOP : level;
        const fill = $('fill');
        fill.setAttribute('y', String(top));
        fill.setAttribute('height', String(Math.max(0, SCALE_BOTTOM + 40 - top)));

        $('pointer').setAttribute('transform', 'translate(0,' + level.toFixed(1) + ')');
        $('pointer-label').textContent = Math.min(100, Math.round(percent)) + '%';
        $('pointer-plus').textContent = exceeded ? '+' : '';
        $('bar-fill').style.width = Math.max(0, Math.min(100, percent)) + '%';
        $('bar').setAttribute('aria-valuenow', String(Math.round(percent)));
        document.querySelector('.gauge').classList.toggle('reached', percent >= 100);
    }

    /* ---------- Animation ---------- */

    let animationHandle = null;
    let shownAmount = 0;

    function animateTo(amount, goal) {
        const start = shownAmount;
        const change = amount - start;
        const duration = Math.abs(change) < 1e-8 ? 0 : 900;
        const startedAt = performance.now();
        const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (animationHandle) cancelAnimationFrame(animationHandle);

        const paint = value => {
            shownAmount = value;
            const percent = goal > 0 ? (value / goal) * 100 : 0;
            $('raised').textContent = formatRvn(value);
            paintLevel(goal > 0 ? value / goal : 0, percent, goal > 0 && value > goal);
        };

        if (duration === 0 || reduceMotion || document.hidden) {
            paint(amount);
            return;
        }

        const step = now => {
            const progress = Math.min(1, (now - startedAt) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            paint(start + change * eased);
            if (progress < 1) animationHandle = requestAnimationFrame(step);
        };
        animationHandle = requestAnimationFrame(step);
    }

    /* ---------- Clipboard ---------- */

    function copyWithSelection(text) {
        return new Promise((resolve, reject) => {
            const field = document.createElement('textarea');
            field.value = text;
            field.setAttribute('readonly', '');
            field.style.position = 'fixed';
            field.style.top = '0';
            field.style.opacity = '0';
            document.body.appendChild(field);
            field.select();
            field.setSelectionRange(0, text.length);
            let ok = false;
            try { ok = document.execCommand && document.execCommand('copy'); } catch (error) { ok = false; }
            document.body.removeChild(field);
            ok ? resolve() : reject(new Error('Copy failed'));
        });
    }

    function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text).catch(() => copyWithSelection(text));
        }
        return copyWithSelection(text);
    }

    /** Last resort: highlight the text so the reader can copy it by hand. */
    function selectElement(element) {
        const selection = window.getSelection();
        if (!selection) return;
        const range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    function flashButton(button, message) {
        const original = button.dataset.label || button.textContent;
        button.dataset.label = original;
        button.textContent = message;
        clearTimeout(Number(button.dataset.timer));
        button.dataset.timer = String(setTimeout(() => { button.textContent = original; }, 1800));
    }

    /* ---------- Authorization list (ravencoin.foundation only) ---------- */

    /** Reads `foundation_authorized`: one "<address>, <amount>" per line, # starts a comment. */
    function loadAuthorizedList() {
        return fetch(new URL(AUTHORIZED_LIST, window.location.href).href, { cache: 'no-cache' })
            .then(response => {
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return response.text();
            })
            .then(text => {
                // A server that answers a missing file with an HTML error page must not
                // be mistaken for an empty, valid list.
                if (/^\s*</.test(text)) throw new Error('Authorization list is not readable');
                return text.split(/\r?\n/)
                    .map(line => line.trim())
                    .filter(line => line && line.charAt(0) !== '#')
                    .map(line => {
                        const comma = line.indexOf(',');
                        if (comma < 0) return null;
                        return {
                            address: line.slice(0, comma).trim(),
                            amount: parseAmount(line.slice(comma + 1))
                        };
                    })
                    .filter(entry => entry && entry.address && entry.amount !== null);
            });
    }

    function isAuthorized(entries, address, goal) {
        return entries.some(entry => entry.address === address && Math.abs(entry.amount - goal) < 1e-8);
    }

    function startGate(config, listUnreadable) {
        document.title = 'Authorization required · Ravencoin Foundation';
        $('gate').hidden = false;
        $('gate-address').textContent = config.address;
        $('gate-goal').textContent = formatRvn(config.goal) + ' RVN';
        if (listUnreadable) {
            $('gate-message').textContent = 'Fundraisers hosted on ravencoin.foundation have to be approved before ' +
                'they can collect, and the authorized list could not be read just now — so nothing is being shown.';
        }
    }

    /* ---------- Campaign page ---------- */

    function startCampaign(config) {
        document.title = config.reason + ' · Ravencoin Fundraiser';
        $('campaign').hidden = false;

        $('reason').textContent = config.reason;
        $('tagline').textContent = config.mode === 'balance'
            ? 'Every RVN held at the address below fills the gauge.'
            : 'Every RVN sent to the address below fills the gauge.';
        $('goal').textContent = formatRvn(config.goal);
        $('address').textContent = config.address;
        $('explorer').href = EXPLORER + encodeURIComponent(config.address);

        drawTicks(config.goal);
        paintLevel(0, 0);

        try {
            $('qr').innerHTML = window.QR.toSvg('ravencoin:' + config.address);
        } catch (error) {
            $('qr').remove();
        }

        $('copy').addEventListener('click', () => {
            copyText(config.address)
                .then(() => flashButton($('copy'), 'Copied ✓'))
                .catch(() => {
                    selectElement($('address'));
                    flashButton($('copy'), 'Select and copy');
                });
        });

        let lastUpdate = null;

        function showStatus(message, isError) {
            $('status').textContent = message;
            $('status').parentElement.classList.toggle('error', Boolean(isError));
        }

        function showAge() {
            if (lastUpdate) showStatus('Updated ' + formatAge(Date.now() - lastUpdate), false);
        }

        async function update() {
            const button = $('refresh');
            button.disabled = true;
            try {
                const totals = await fetchTotals(config.rpc, config.address);
                const raised = config.mode === 'balance' ? totals.balance : totals.received;

                animateTo(raised, config.goal);

                const remaining = config.goal - raised;
                $('remaining').textContent = remaining > 0
                    ? ' · ' + formatRvn(remaining) + ' to go'
                    : '';
                $('cheer').hidden = remaining > 0;

                if (totals.pending > 0) {
                    $('pending').textContent = '+' + formatRvn(totals.pending) + ' RVN waiting to confirm';
                    $('pending').hidden = false;
                } else {
                    $('pending').hidden = true;
                }

                $('gauge-caption').textContent = 'Fundraising thermometer: ' + formatRvn(raised) +
                    ' of ' + formatRvn(config.goal) + ' RVN raised, ' +
                    Math.round(config.goal > 0 ? (raised / config.goal) * 100 : 0) + ' percent.';

                lastUpdate = Date.now();
                showAge();
            } catch (error) {
                const badAddress = /invalid address/i.test(error && error.message);
                showStatus(badAddress
                    ? 'That is not a valid Ravencoin mainnet address'
                    : lastUpdate
                        ? 'Network hiccup — showing the last known total'
                        : 'Could not reach the Ravencoin network', true);
            } finally {
                button.disabled = false;
            }
        }

        $('refresh').addEventListener('click', update);
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && lastUpdate && Date.now() - lastUpdate > REFRESH_MS) update();
        });
        setInterval(() => { if (!document.hidden) update(); }, REFRESH_MS);
        setInterval(showAge, 30000);

        update();
    }

    /* ---------- Setup page ---------- */

    function startSetup(prefill) {
        document.title = 'Build a fundraising thermometer · Ravencoin';
        $('setup').hidden = false;

        const reason = $('f-reason');
        const goal = $('f-goal');
        const address = $('f-addr');

        reason.value = prefill.reason || '';
        goal.value = prefill.goal || '';
        address.value = prefill.address || '';

        function buildLink() {
            const base = window.location.origin === 'null'
                ? window.location.href.split('?')[0]
                : window.location.origin + window.location.pathname;
            const query = new URLSearchParams();
            query.set('rvn', (parseAmount(goal.value) || DEFAULT_GOAL).toString());
            query.set('addr', address.value.trim());
            if (reason.value.trim()) query.set('reason', reason.value.trim());
            const link = base + '?' + query.toString();
            const usable = ADDRESS_PATTERN.test(address.value.trim());
            $('f-link').textContent = link;
            $('f-hint').hidden = usable;
            $('f-open').href = usable ? link : '#';
            $('f-open').setAttribute('aria-disabled', usable ? 'false' : 'true');
            return link;
        }

        [reason, goal, address].forEach(field => field.addEventListener('input', buildLink));
        $('setup-form').addEventListener('submit', event => {
            event.preventDefault();
            if (ADDRESS_PATTERN.test(address.value.trim())) window.location.href = buildLink();
            else address.focus();
        });
        $('f-copy').addEventListener('click', () => {
            copyText(buildLink())
                .then(() => flashButton($('f-copy'), 'Copied ✓'))
                .catch(() => {
                    selectElement($('f-link'));
                    flashButton($('f-copy'), 'Select and copy');
                });
        });

        buildLink();
    }

    /* ---------- Boot ---------- */

    const params = readParams();
    const address = unquote(params.addr || params.address || '');
    const reason = unquote(params.reason || params.why || '') || 'Community fundraiser';
    const goal = parseAmount(params.rvn || params.goal || '') || DEFAULT_GOAL;
    const endpoint = /^https?:\/\//i.test(unquote(params.rpc || '')) ? unquote(params.rpc) : DEFAULT_RPC;
    const mode = unquote(params.mode || '').toLowerCase() === 'balance' ? 'balance' : 'received';

    const config = { address, reason, goal, mode, rpc: endpoint };

    if (!ADDRESS_PATTERN.test(address)) {
        startSetup({ reason: params.reason ? reason : '', goal: params.rvn ? String(goal) : '', address });
    } else if (!GATED_HOST.test(window.location.hostname)) {
        startCampaign(config);
    } else {
        loadAuthorizedList().then(entries => {
            if (isAuthorized(entries, address, goal)) startCampaign(config);
            else startGate(config, false);
        }).catch(() => startGate(config, true));
    }
}());
