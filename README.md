# Azure Learning Portal

A **frontend-only** Microsoft Azure course: read Markdown lessons, take quizzes, and track
your progress — all in the browser. No sign-up, no backend.

## What this is

The portal shell is built with React 19, Vite, TypeScript, React Router, Tailwind CSS v4,
`marked`, and PrismJS. It renders a **24-lesson curriculum** that takes you from "what is the
cloud?" through Azure's core services — compute, storage, networking, and identity — and on
to hands-on work: deploying virtual machines, web apps, and serverless functions, storing
data in Blob storage, Azure SQL, and Cosmos DB, then operating at scale with monitoring,
containers, infrastructure as code (Bicep), CI/CD, cost governance, security, and the Azure
Well-Architected Framework. Every lesson is written in plain, welcoming English and verified
against primary sources (see **Sources** below).

Progress, bookmarks, and quiz scores live in `localStorage` under `azure-learning-*` keys, so
nothing leaves your machine.

## Run it locally

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build
```

## How the content works

The app is **data-driven** — adding a lesson needs no code changes:

1. Write the lesson Markdown in `public/content/<level>/<slug>.md` with YAML front-matter
   (including a `summary`).
2. Add a quiz at `public/quizzes/lesson-NN.json`.
3. Regenerate `public/content/course-manifest.json` from the front-matter (the manifest is
   generated, so it can't drift).

> **Code fences** must declare one of the highlighted languages: `bash` (the Azure CLI),
> `json` (ARM templates and config), `yaml` (Actions/Pipelines), `bicep`, `sql`, or `text`
> (console output and resource trees); see `src/core/prism.ts`.

## Curriculum

**Beginner — cloud & Azure fundamentals:** what is cloud computing? · what is Azure & getting
started · global infrastructure · resource management & ARM · core compute · core storage ·
core networking · identity & access with Microsoft Entra ID.

**Intermediate — hands-on core services:** deploy a virtual machine · host web apps with App
Service · serverless with Azure Functions · store data with Blob storage · relational data
with Azure SQL · NoSQL with Cosmos DB · networking hands-on · secrets & configuration with Key
Vault.

**Advanced — scale, automate, operate:** monitoring & observability · containers on Azure ·
infrastructure as code with Bicep · CI/CD to Azure · cost management & governance · security in
Azure · reliability & scaling · Well-Architected & capstone.

## Accuracy: no hallucination

Every service description, default, limit, and name is verified against primary sources. The
per-lesson authoring contract lives in `prompts/azure-authoring-prompt.md`, and the
phase-by-phase overview in `prompts/azure-study-pathway.md`.

**Sources:**

- **Azure documentation** — <https://learn.microsoft.com/azure/> — the primary anchor for how
  Azure services work.
- **Microsoft Entra** — <https://learn.microsoft.com/entra/> — identity (Microsoft Entra ID,
  formerly Azure Active Directory).
- **Azure CLI reference** — <https://learn.microsoft.com/cli/azure/> — for exact `az` commands.
- **AZ-900 study guide** —
  <https://learn.microsoft.com/credentials/certifications/resources/study-guides/az-900> — the
  fundamentals backbone.
- **Azure Well-Architected Framework** — <https://learn.microsoft.com/azure/well-architected/> —
  design pillars and best practices.

## Deploying

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds with
`BASE_PATH=/<repo>/` and publishes `dist/` to GitHub Pages.

---

React 19 · Vite · TypeScript · React Router · Tailwind CSS v4 · marked · PrismJS ·
localStorage.
