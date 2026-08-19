# Ravencoin Fundraising Thermometer

A static, single-page fundraising gauge — the kind you colour in with a marker, except this one
fills itself in from the blockchain. Point it at a Ravencoin address, give it a goal, and share
the link.

## Using it

Everything the page needs is in the query string:

```
index.html?rvn=100000&addr=RKMRzcPXs79Wqxv7nNZw6VnzmqyCdLSnBM&reason=Security%20audit%20of%20code
```

| Parameter | Required | What it does |
|---|---|---|
| `rvn`    | no  | The top of the gauge. Accepts `100000`, `100,000`, `100k`, `1.5M`. Defaults to 100,000. Also accepted as `goal`. |
| `addr`   | yes | The receiving address, shown prominently and read for the running total. Also accepted as `address`. |
| `reason` | no  | The headline — what the money is for. Quotes around the value are stripped, so `reason="Security audit"` works. |
| `mode`   | no  | `received` (default) gauges everything the address has ever been sent, so the gauge never falls back when funds are spent. `mode=balance` gauges the address's current balance instead. |
| `rpc`    | no  | A Ravencoin JSON-RPC endpoint to use instead of the public one. Must be `http://` or `https://`. |

Open `index.html` with no parameters and you get a small builder that assembles the link for you.

## Where the numbers come from

The page calls Ravencoin Core's address index over JSON-RPC — `getaddressbalance` for the
confirmed total and `getaddressmempool` for anything still waiting in the mempool. The default
endpoint is `https://rvn-rpc-mainnet.ting.finance/rpc`, the same public endpoint the
[KawTrace explorer](https://cerberuscx.github.io/KawTrace/) uses, so the totals here match what
KawTrace shows for the same address. Totals refresh every 60 seconds while the tab is visible;
if the endpoint is unreachable the page keeps showing the last known figure and says so.

Two notes on trust: a public endpoint can see which address is being queried, and anyone who
edits the `rpc=` parameter in a link can point the page at an endpoint that reports whatever it
likes. The address on the page is always exactly the one in `addr=` — verify totals on an
explorer before treating them as final, and run your own node with `rpc=` if that matters to you.

## Authorization on ravencoin.foundation

When the page is served from `ravencoin.foundation` (or any subdomain of it), it will only run a
fundraiser whose address **and** goal appear in the `foundation_authorized` file next to
`index.html`. One campaign per line:

```
# Fundraisers authorized to run on ravencoin.foundation.
# One per line: <ravencoin address>, <RVN amount>
RAdLwGApGxJwSb9UujiGvoCahoqJA9kn4z, 14390
```

Blank lines and `#` comments are ignored, the amount accepts the same shorthand as `rvn=`
(`100k`, `100,000`), and the address must match exactly. Anything else — an unlisted address, a
listed address with a different goal, or an authorization file that cannot be read — shows a page
explaining that the fundraiser must be authorized and asking the organiser to DM
[@rvn_foundation](https://x.com/rvn_foundation) on X. The check fails closed on purpose: if the
list is missing, no fundraiser runs.

On every other host — your own domain, GitHub Pages, a local file — there is no list and no check.

## Hosting

`index.html` is the whole application. The styles, the code and the QR encoder are inlined into
it, so there is nothing else to copy, no build step and no dependencies. Save that one file
anywhere that serves static files — GitHub Pages, S3, a plain web server — and it works:

```
index.html                 everything
foundation_authorized      (only consulted on ravencoin.foundation)
```

The QR encoder is a small self-contained implementation (byte mode, error-correction level M)
that renders the `ravencoin:` payment URI as an SVG, so nothing is fetched from a third-party QR
service. Opening the file directly from disk works too, though the copy button is more reliable
when the page is served over http(s).

Everything lives in one file so that saving the page is enough to take a copy. The `<style>` and
the two `<script>` blocks are contiguous and clearly delimited if you need to edit them.
