# GitHub Branch Protection Setup

Para configurar a proteção de branches no GitHub, siga os passos:

## 1. Acessar Configurações do Repositório
- Vá para o repositório no GitHub
- Clique em **Settings** → **Branches**

## 2. Configurar Proteção para Branch `main`
Clique em **Add rule** e configure:

### Branch name pattern: `main`
- ✅ **Require a pull request before merging**
  - ✅ Require approvals: `1`
  - ✅ Dismiss stale PR approvals when new commits are pushed
  - ✅ Require review from code owners (se houver CODEOWNERS)
- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - Status checks: `lint-and-typecheck`, `build`, `security-check`
- ✅ **Require conversation resolution before merging**
- ✅ **Restrict pushes that create files**
- ✅ **Restrict force pushes**
- ✅ **Do not allow bypassing the above settings**

## 3. Configurar Proteção para Branch `dev`
Clique em **Add rule** e configure:

### Branch name pattern: `dev`
- ✅ **Require a pull request before merging**
  - ✅ Require approvals: `1`
- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - Status checks: `lint-and-typecheck`, `build`, `security-check`
- ✅ **Restrict pushes that create files**
- ✅ **Restrict force pushes**

## 4. Configurações Adicionais Recomendadas

### Repository Settings → General
- ✅ **Automatically delete head branches** (após merge de PR)

### Repository Settings → Actions → General
- ✅ **Allow GitHub Actions to create and approve pull requests**

## Fluxo de Trabalho Implementado

```
feature-branch → [PR] → dev → [PR] → main
     ↑                    ↑           ↑
  desenvolvimento     integração   produção
```

- **feature-branch**: Desenvolvimento de features
- **dev**: Branch de desenvolvimento (só recebe PRs)
- **main**: Branch de produção (só recebe PRs da dev)

## Comandos Úteis

```bash
# Criar feature branch
git checkout dev
git pull origin dev
git checkout -b feature/nome-da-feature

# Após desenvolvimento
git push origin feature/nome-da-feature
# Abrir PR para dev no GitHub

# Após aprovação e merge na dev
# Abrir PR de dev para main no GitHub
```