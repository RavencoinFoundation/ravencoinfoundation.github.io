# Ravencoin Foundation website

The website for [ravencoin.foundation](https://ravencoin.foundation). Its main job is to be the
reliable index of every Ravencoin resource on the web, and to publish what the Ravencoin Foundation
is doing.

**Ravencoin is not a company.** It is technology, source code, and the network that emerges when
people run it. The Foundation is a non-profit that supports that open-source project.

## How it is built

Plain static HTML, CSS, and one JavaScript file. **No Gatsby, no React, no build step, no server-side
code.** Clone it, open it in a browser through any static file server, and what you see is what
gets deployed.

```
index.html                 Home — hero, mission, and the full resource directory
links/                     Resources — the directory on its own page
proposals/                 Development proposals & bounties
proposal_desc/             Long-form proposal descriptions
stablecoin_proposals/      Archived stablecoin proposals
documents/                 Board minutes, security audits, submitted proposals
accounting/                Foundation accounting
meetup/                    Ravencoin Meetup at Sea
contact/                   People directory
getupdates/ · blog/        Email updates and the blog
whitepaper/ · downloads/ · community/ · privacy/
404.html

assets/css/site.css        All styling
assets/js/site.js          Header, footer, theme, search, and all data rendering
assets/img/                Logos and photos

data/links.json            Every resource link on the site
data/people.json           The contact directory
data/manifests/            Offline fallback lists for the document folders

BoardMeetingMinutes/       PDFs — listed automatically on /documents/
CodeSecurityAudit/         PDFs — listed automatically on /documents/
ProposalArchive/           Submitted proposals — listed automatically on /documents/
tools/build-manifests.sh   Refreshes data/manifests/
```

> **Careful with names.** GitHub Pages serves from a case-sensitive filesystem; macOS is not. A
> page folder and a document folder whose names differ only in case (`proposals/` vs `Proposals/`)
> will silently merge on a Mac and behave differently once deployed. That is why the submitted
> proposals live in `ProposalArchive/`.

Old URLs still work: `/board-meeting-minutes` and `/code-security-audit` redirect to the matching
section of `/documents/`, and every other Gatsby-era path (`/downloads`, `/community`, `/meetup`,
`/whitepaper`, `/getupdates`, `/privacy`, `/blog`, `/accounting`, `/proposals`, `/proposal_desc`,
`/stablecoin_proposals`) is unchanged.

## Everyday maintenance

You should not need to touch HTML for any of this.

### Add, remove, or re-categorize a link

Edit [`data/links.json`](data/links.json). Each category is a key with an array of links:

```json
"Explorers": [
  { "text": "Cryptoscope", "link": "https://rvn.cryptoscope.io/" }
]
```

- **New link** — add an object to the right array. It appears everywhere the directory is shown.
- **New category** — add a new key with an array, and optionally add an entry to `_categories`
  to give it an icon and a one-line description. Categories display in the order they appear in
  the file, starting with `Download`.
- Available icon names: `download`, `wallet`, `assets`, `people`, `buy`, `trade`, `swap`, `mining`,
  `globe`, `book`, `code`, `search`, `megaphone`, `doc`, `shield`, `mail`, `ship`.

### Find and mark dead links

```bash
./tools/check-links.py            # report only
./tools/check-links.py --write    # also update data/links.json
```

Anything that fails gets `"status": "unreachable"` in `data/links.json`, and the site renders it
dimmed with a red dot and a tooltip. The link stays clickable — a site that is down today may be
back next month — and the entry brightens again automatically the next time the checker succeeds.
A `_checked` date at the bottom of the file drives the note shown under the directory.

Sites that answer `403` or `429` to scripted requests count as working, since they load fine in a
real browser. Pages that return `200` but are parked, for sale, or a shutdown notice count as
broken, because the resource a visitor came for is not there.

### Add someone to the contact page

Edit [`data/people.json`](data/people.json) and add an object to `people`. Only `name` is required:

```json
{
  "name": "Full Name",
  "alias": "handle",
  "group": "Contributors",
  "role": "What they do",
  "strengths": ["C++", "Community"],
  "bio": "One or two sentences.",
  "photo": "/assets/img/people/filename.jpg",
  "links": {
    "x": "https://x.com/handle",
    "linkedin": "https://www.linkedin.com/in/handle",
    "github": "https://github.com/handle",
    "email": "name@example.com"
  }
}
```

The file's `_template` key is a copy-paste starting point showing every supported field. Any social
key is accepted — `x`, `facebook`, `linkedin`, `github`, `email`, `website`, `telegram`, `discord`,
`medium`, `youtube`, `instagram`, `reddit`, `mastodon`, `bluesky`, `keybase`, and anything else you
add gets a labelled button. Groups come from the `groups` array; anyone without a recognized group
lands in the last one. Photos are optional — without one, the person gets initials on a gradient.

**Only publish contact details the person has agreed to publish.**

### Add board meeting minutes (or an audit, or a proposal)

Drop the PDF into the folder. That is the whole procedure.

```
BoardMeetingMinutes/Board Meeting 2026-08-14.pdf
```

`/documents/` lists the folder through the GitHub contents API, so the file shows up as soon as it
is pushed — no rebuild. Name files with a `YYYY-MM-DD` date and they sort newest-first and group
under the right year heading automatically.

Then refresh the offline fallback lists (used if GitHub's API is rate-limited):

```bash
./tools/build-manifests.sh
```

### Change the menu or footer

The `NAV` and `FOOTER_COLUMNS` arrays at the top of
[`assets/js/site.js`](assets/js/site.js).

## Working on it locally

`fetch()` will not read JSON off `file://`, so serve the folder:

```bash
python3 -m http.server 8080
```

Then open <http://localhost:8080>. Root-relative paths (`/assets/...`) mean the site must be served
from the root of a domain, which is how GitHub Pages serves it.

## Deployment

Pushing to `main` runs [`.github/workflows/pages.yml`](.github/workflows/pages.yml), which uploads
the repository as-is to GitHub Pages.

> **One-time setting:** in **Settings → Pages**, set **Source** to **GitHub Actions**. The old
> Gatsby workflow published to a `gh-pages` branch; this one does not, so the source has to be
> switched once. The `CNAME` file keeps the `ravencoin.foundation` domain.

`.nojekyll` is present so that `.well-known/` (Brave Rewards verification) is published.

## Accessibility and privacy

The site loads no third-party fonts, scripts, analytics, or trackers. Embedded content (Google
Sheets, the blog, the newsletter form) is loaded in iframes only on the pages that need it, and is
always accompanied by a direct link to the source. Colours meet WCAG AA contrast in both light and
dark themes; the theme follows the operating system and can be overridden with the toggle in the
header.
