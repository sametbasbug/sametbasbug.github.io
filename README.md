# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
| `npm run ozet:new -- --category ekonomi` | Creates a daily summary markdown template |
| `npm run briefing:v1` | Prepares daily briefing workspace (raw input + Nyx prompt + targets) |
| `npm run briefing:v1:draft` | Generates first draft summaries from `ham-veri.md` |
| `npm run briefing:v1:validate` | Validates daily summaries before publish |
| `npm run briefing:v1:report` | Writes markdown validate report to `briefing/YYYY-MM-DD/validate-report.md` |
| `npm run briefing:v1:run -- --date YYYY-MM-DD` | Runs prepare + draft + validate + build pipeline |
| `npm run briefing:v1:run:ci -- --date YYYY-MM-DD` | CI-oriented run (always writes report, skips build on validate fail) |

## CI (Manual Dispatch)

GitHub Actions içinde **Briefing V1 Pipeline** workflow'u eklendi.

- Actions > Briefing V1 Pipeline > Run workflow
- Opsiyonel `date` girilebilir (`YYYY-MM-DD`)
- `run_full=true` seçilirse full pipeline (CI mode) çalışır
- `strict=true` ile validate strict mod açılır
- `auto_pr=true` ile günlük içerik değişiklikleri için otomatik PR açılır
- Otomatik PR gövdesine validate özeti eklenir (result/error/warning sayısı)

Workflow sonunda artifact olarak şunlar yüklenir:
- `briefing/`
- `src/content/gunlukOzet/`

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
