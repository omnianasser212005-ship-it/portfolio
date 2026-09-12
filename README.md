# Portfolio Website 🚀

Personal Portfolio built with **React 19**, **Vite 8**, and **Tailwind CSS v4**, configured for deployment on **GitHub Pages**.

---

## 📁 Project Structure

```text
Portfolio app/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages deployment workflow
├── public/                     # Public static assets
│   ├── 404.html
│   └── profile.jpg
├── src/                        # Main application source code
│   ├── App.tsx                 # Primary App component
│   ├── main.tsx                # React entrypoint
│   ├── index.css               # Global Tailwind CSS entry
│   ├── profile.jpg             # Profile image asset
│   └── vite-env.d.ts
├── index.html                  # HTML Shell
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite configuration
```

---

## 💻 Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run dev server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🌐 GitHub Pages Deployment

### Step 1: Push code to GitHub

```bash
git add .
git commit -m "Configure project for GitHub Pages"
git branch -M main
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Open your repository on **GitHub**.
2. Go to **Settings** > **Pages**.
3. Under **Build and deployment**:
   - Set **Source** to **GitHub Actions**.
4. GitHub Actions will build and deploy the portfolio to `https://<username>.github.io/portfolio/`.
