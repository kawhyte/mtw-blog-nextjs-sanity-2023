# PLAN: Monthly Sanity Backup (GitHub Action) + Bing Webmaster Setup

## 1. The Goal

This site's Sanity content (hotel reviews, food reviews, travel guides, arena reviews) lives only in Sanity's live dataset — the `backups/` folder in this repo holds one-off manual exports from migration work, not a recurring safety net. This plan adds a scheduled GitHub Action that exports the `production` dataset monthly and uploads it as a downloadable Actions artifact, plus gets the site registered with Bing Webmaster Tools so it shows up in Bing/Copilot search alongside Google. Done = a green monthly (or manually triggered) GitHub Action run producing a `backup.tar.gz` artifact, and the site verified + sitemap submitted in Bing Webmaster Tools.

## 2. Exact Files to Touch

- CREATE `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/.github/workflows/sanity-backup.yml` — monthly export workflow.

No app code changes. Bing setup is manual (Kenny, via Bing's site + Google Search Console import).

## 3. Step-by-Step Implementation Order

1. CREATE `.github/workflows/sanity-backup.yml`:
   ```yaml
   name: Monthly Sanity backup
   on:
     schedule:
       - cron: "0 6 1 * *"   # 06:00 UTC on the 1st of each month
     workflow_dispatch: {}
   jobs:
     export:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/setup-node@v4
           with: { node-version: 22 }
         - name: Export dataset
           run: npx -y sanity@latest dataset export production backup.tar.gz -p "$SANITY_PROJECT_ID"
           env:
             SANITY_PROJECT_ID: ${{ secrets.SANITY_PROJECT_ID }}
             SANITY_AUTH_TOKEN: ${{ secrets.SANITY_API_READ_TOKEN }}
         - uses: actions/upload-artifact@v4
           with:
             name: sanity-backup-${{ github.run_id }}
             path: backup.tar.gz
             retention-days: 90
   ```
   Uses `-p` (not the removed `--project`/`--token` flags) and `SANITY_AUTH_TOKEN` for auth — the current Sanity CLI's actual interface (confirmed by trial-and-error on the Pixel Prince Store repo's identical workflow; the CLI dropped `--project`/`--token` at some point without much fanfare).

2. **Kenny's manual setup (~15 min, no code):**
   - **Sanity read-only token:** sanity.io/manage → project `k5e2zsor` → API → Tokens → **Add API token** → name it e.g. "Github Read Only backup" → permission **Viewer** (read-only, do NOT reuse any Editor/write token) → Save → copy the token immediately (shown once).
   - **GitHub repo secrets:** github.com/kawhyte/mtw-blog-nextjs-sanity-2023 → Settings → Secrets and variables → Actions → New repository secret:
     - `SANITY_PROJECT_ID` = `k5e2zsor`
     - `SANITY_API_READ_TOKEN` = the token just generated (paste directly into GitHub's field — never share a live API token in chat/screenshots to anyone, including an AI assistant; treat any token that leaks into a screenshot as compromised and revoke it immediately)
   - **Test it:** Actions tab → "Monthly Sanity backup" → **Run workflow** → should go green in under a minute and produce a downloadable `backup.tar.gz` artifact under that run.
   - **Bing Webmaster Tools:** bing.com/webmasters → sign in → **Import from Google Search Console** (this repo's site should already be verified in GSC — reuse that instead of a separate DNS/meta-tag verification) → select the meetthewhytes.com property → Bing pulls in verification + sitemap automatically.
   - If GSC import isn't available for some reason: manually add site in Bing Webmaster Tools → verify via DNS TXT record (same pattern as Google's) at your domain registrar → then Sitemaps → submit `sitemap.xml`.

## 4. Edge Cases

- **The backup workflow needs no repo checkout** — `npx sanity dataset export` is standalone; keep the job minimal so it can't break with app dependency churn.
- **Artifact retention 90 days** with monthly runs → ~3 rolling backups. Do not commit tarballs to the repo (the existing `backups/` folder's one-off JSON exports are a separate, pre-existing pattern — this workflow doesn't touch or replace them).
- **Node version matters:** `sanity@latest` requires Node ≥22.12. GitHub's runners also force Node 24 regardless of the `node-version` pin as of late 2025, but pin to 22 anyway so the npm engine check inside the step doesn't warn/fail on older cached toolchains.
- **Token scope:** the read-only token must be Viewer-only. An Editor/write token in a backup-only workflow is an unnecessary privilege escalation if the secret ever leaks.
- **If a Sanity token appears in a screenshot, chat log, or any shared channel, treat it as compromised** — revoke and regenerate immediately, this was actually hit during the equivalent Pixel Prince Store setup.

## 5. Acceptance Criteria

### Feature works
- [ ] GitHub → Actions → run "Monthly Sanity backup" via `workflow_dispatch` → green run with downloadable `backup.tar.gz`
- [ ] `tar -tzf backup.tar.gz` lists an `.ndjson` data file (real content, not empty)
- [ ] Bing Webmaster Tools shows meetthewhytes.com as verified
- [ ] Bing Webmaster Tools → Sitemaps shows the sitemap submitted (Success or Pending, not Invalid)

### Nothing broke (regression check)
- [ ] No app code changed — `npm run build` unaffected
