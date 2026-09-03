# AI Red Team

A static site: a defensive, educational catalog of LLM and agent security risks and mitigations, mapped to the OWASP Top 10 for LLM Applications — for engineers building with LLMs who need to know what can go wrong, and how to defend against it.

Live at: **https://clarkngo.github.io/ai-redteam/**

## What's in it

- [`index.html`](index.html) — landing page: frames the core problem (LLM applications can't structurally separate instructions from data), an animated diagram of the merged instruction/data channel, the threat catalog, an animated defense-in-depth pipeline diagram, and the defensive patterns section.
- [`threats.json`](threats.json) — the data manifest: six threat entries (each mapped to the OWASP Top 10 for LLM Applications, with severity, a conceptual attack vector, a generalized example, and a mitigation checklist) plus five cross-cutting defensive patterns.
- [`app.js`](app.js) — renders the threat and pattern cards and the two animated SVG flow diagrams from the JSON manifest; drives the light/dark theme toggle.
- [`favicon.svg`](favicon.svg) — shield favicon.
- [`robots.txt`](robots.txt) / [`sitemap.xml`](sitemap.xml) — basic SEO.

No build step, no dependencies, no backend — it's plain HTML/CSS/JS.

## Deploying it

### GitHub Pages

This repo already ships a GitHub Actions workflow ([`.github/workflows/static.yml`](.github/workflows/static.yml)) that deploys the whole repo root on every push to `main`. In **Settings → Pages**, set **Source** to `GitHub Actions` and it's live.

Setting this up fresh in a new repo instead:

1. **Settings → Pages**
2. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
3. Set **Branch** to `main` and the folder to `/ (root)`.
4. Save. The site publishes at `https://<your-username>.github.io/<repo>/`.

Either way, every path in the site is relative, so it works unmodified from a repo subpath.

### Running it locally

Any static file server works:

```bash
python3 -m http.server 8123
```

Then open `http://localhost:8123`.

## Content principles

This is a **defensive** catalog, not an attack manual. Every threat entry ships with a concrete mitigation — there are no working exploit payloads, jailbreak scripts, or step-by-step attack recipes here, by design. Jailbreak techniques in particular are documented at the category level only, never as working prompts.

## License

Dual-licensed:

- **Code** (`app.js`, the HTML/CSS markup and structure in `index.html`, `favicon.svg`) — [MIT](LICENSE).
- **Catalog content** (the threat and defensive-pattern text in `threats.json`) — [CC BY 4.0](LICENSE-CONTENT). Use, adapt, and redistribute freely — in an internal security training, a blog post, a conference talk — with attribution.
