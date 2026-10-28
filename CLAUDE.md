# Notes for Claude

- Paralax FX is a commercial shop at fx.paralaxverse.com. It is a separate project from Paralax Verse (the non-commercial fan site) and must stay that way: no Star Citizen names, logos or CIG Fankit assets anywhere in the shop.
- Plain static site, no npm, no build step. Cloudflare serves the repo root (see wrangler.jsonc).
- Pages: index.html (shop), licence.html, refunds.html, privacy.html, 404.html. Shared styles in css/site.css, script in js/site.js.
- Checkout links live at the top of js/site.js (CHECKOUT). Empty = "Launching soon".
- The owner designs and is learning to code: keep code commented in plain English and explain changes simply.
- Demo videos in media/ are placeholders made from Star Citizen footage. Replace them with purpose-shot demos before launch.
