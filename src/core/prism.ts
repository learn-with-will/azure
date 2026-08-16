// Prism core + the languages the Azure lessons use. `bash` is the primary
// language — the Azure CLI (`az ...`) and shell commands. `json` covers ARM
// templates, `az` command output, and configuration/API bodies. `yaml` covers
// GitHub Actions and Azure Pipelines workflows. `bicep` is Azure's
// infrastructure-as-code DSL. `sql` covers Azure SQL Database queries. Plain
// `text` fences (console output, resource trees, portal click-paths) are left
// unhighlighted.
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-bicep';
import 'prismjs/components/prism-sql';
import 'prismjs/themes/prism-tomorrow.css';

export default Prism;
