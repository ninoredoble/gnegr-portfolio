---
name: portfolio-publisher
description: Workflow skill to validate, update, and publish project case studies, assets, and metadata for the ninoredoble portfolio.
---

# Portfolio Publisher Skill

Use this skill whenever you want to add a new project, edit case studies, or update portfolio metadata.

## Workflows

### 1. Adding a New Project Case Study
1. Place project screenshot or media in `/img/projects/` or `/vid/`.
2. Format project details:
   - `id`: unique-slug
   - `title`: Project Title
   - `tagline`: 1-line crisp overview (no buzzwords)
   - `category`: Web Application | Creative & Motion | AI & Systems | UI/UX
   - `year`: YYYY
   - `techStack`: Array of technologies
   - `summary`: Concrete explanation of architecture and problem solved
   - `liveUrl`: URL or demo path
   - `sourceUrl`: GitHub URL
3. Update the `PORTFOLIO_DATA` in `js/main.js`.

### 2. Linting and Link Validation
Verify all hyperlinks are active:
- Confirm no dead links (`#`, `javascript:void(0)`).
- Ensure external links have `target="_blank" rel="noopener noreferrer"`.
- Test smooth scroll and mobile navigation drawers.

### 3. Deploying to GitHub Pages & is-a.dev
- Ensure `CNAME` contains `ninoredoble.is-a.dev`.
- Commit changes: `git add . && git commit -m "feat: update portfolio" && git push origin main`.
- GitHub Pages automatically builds and redeploys in ~30 seconds.
