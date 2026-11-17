# Azure Learn

The content of the Azure course at <https://learn-with-will.github.io/azure/>: 113 short lessons ("bites") in 12 topics, each teaching one idea in 3–5 minutes, plus a bank of 130 quiz questions. It covers cloud fundamentals (shared responsibility, service models, Capex vs Opex, subscriptions), global infrastructure & governance (regions, availability zones, ARM control plane, tagging), compute & virtual machines (deploying Linux/Windows VMs, Bastion, Spot instances, auto-shutdown), App Service & serverless (scaling, deployment slots, custom domains, Azure Functions), storage & blob (blob tiers, lifecycle management, SAS tokens, Azure Files), databases (Azure SQL service tiers, DTU vs vCore, Point-In-Time Restore, Cosmos DB partitioning & global distribution), networking (VNets, subnets, NSGs, peering, Bastion, ExpressRoute), identity & security (Microsoft Entra ID, RBAC, MFA, Key Vault, Managed Identities), containers (ACI, Container Apps, AKS cluster architecture), monitoring & observability (Azure Monitor, Log Analytics, KQL queries, alerts, Application Insights), IaC & DevOps (Bicep templates, parameters, modules, What-If idempotency, GitHub Actions CI/CD with OIDC), and governance & reliability (cost management, reservations, Azure Policy, resource locks, Defender for Cloud, Sentinel SIEM, SLAs, Well-Architected Framework, CAF).

This repository holds **content only**. The site itself (lesson reader, quizzes, progress, optional sign-in) is the shared [course shell](https://github.com/learn-with-will/course-shell), which every course uses.

```text
course.json              name, brand colours, home page copy, code languages
content/topics.json      the 12 topics
content/lessons/*.md     one bite per file
content/legacy.json      old long-lesson URLs → the bites that replaced them
quiz/questions.json      the question bank
```

## Working on the course

Clone the shell next to this folder, then run its commands with this folder as the argument:

```bash
git clone https://github.com/learn-with-will/course-shell.git ../course-shell
cd ../course-shell
npm ci
npm run dev -- ../azure                 # live preview at http://localhost:4200
npm run validate -- ../azure --strict   # the check the deploy runs
```

Node 22.18 or later is required.

## Adding a lesson

1. Create `content/lessons/<slug>.md` with front-matter (`slug`, `title`, `topic`, `kind`, `summary`, `tags`, `related`) and the standard sections.
2. Add questions for it to `quiz/questions.json` with `"topic"` and `"lesson"`.
3. Run `npm run validate -- ../azure --strict` from the shell folder.

The rules (length limits, which visual fits which kind of information, the diagram syntax) are in the shell's [CONTENT_GUIDE.md](https://github.com/learn-with-will/course-shell/blob/main/CONTENT_GUIDE.md).

## Accuracy

Facts and commands are synthesized from official Microsoft Azure documentation, Azure Architecture Center, Microsoft Certified Azure Solutions Architect standards, and real-world enterprise production operations.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which calls the shell's reusable workflow: it validates this course in strict mode, builds it with the latest shell and publishes it to GitHub Pages. To pick up a shell change without a content change, run the workflow by hand from the Actions tab.
