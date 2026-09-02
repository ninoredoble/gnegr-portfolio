# Free Custom Domain Guide: `ninoredoble.is-a.dev`

This guide explains how to claim your **100% free custom domain** `ninoredoble.is-a.dev` and route it to your GitHub Pages repository.

---

## How `is-a.dev` Works
`is-a.dev` is a free, open-source subdomain service created specifically for developers. It gives you a custom `.is-a.dev` subdomain with automatic SSL/HTTPS, Cloudflare DDoS protection, and zero renewal fees.

---

## Step-by-Step Setup (Takes ~3 Minutes)

### 1. Fork the Repository
Go to [github.com/is-a-dev/register](https://github.com/is-a-dev/register) and click **Fork**.

### 2. Add Your Record File
In your forked repository, navigate to the `domains/` folder and create a new file named:
```text
domains/ninoredoble.json
```

### 3. Paste Your Configuration
Put the following JSON into `domains/ninoredoble.json`:

```json
{
  "owner": {
    "username": "ninoredoble",
    "email": "redoble.gninoemmanuel@gmail.com"
  },
  "record": {
    "CNAME": "ninoredoble.github.io"
  }
}
```

### 4. Open a Pull Request
1. Commit the changes in your fork.
2. Click **Open Pull Request** to `is-a-dev/register` (the automated bot will validate the JSON syntax immediately).
3. Once merged (usually within a few hours to a day), `ninoredoble.is-a.dev` will be active worldwide.

### 5. Verify in GitHub Pages Settings
1. Go to your GitHub repository: `https://github.com/ninoredoble/ninoredoble.github.io`
2. Go to **Settings** > **Pages**.
3. Under **Custom Domain**, confirm `ninoredoble.is-a.dev` is listed (the `CNAME` file in the repo configures this automatically).
4. Check **Enforce HTTPS**.

---

## Alternative Free Custom Domains Available:
- **`js.org`**: Free if you host open-source JavaScript packages or tools.
- **Apex domain**: If you buy a domain in the future (`ninoredoble.com`), simply point its CNAME / A records to `ninoredoble.github.io`.
