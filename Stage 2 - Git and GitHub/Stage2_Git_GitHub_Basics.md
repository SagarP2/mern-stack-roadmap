# 📘 Stage 2: Git & GitHub Basics

---

## 1. Git Basics (init, add, commit)

**Git** = version control system (tracks changes in code).  
It helps developers collaborate, undo mistakes, and keep a history of changes.

### Common Commands:
```bash
git init        # Initialize Git in a project
git status      # Show changes
git add file.js # Stage a file for commit
git add .       # Stage all changes
git commit -m "Initial commit"  # Save snapshot with a message
```

👉 **Workflow**:  
1. Make changes  
2. `git add` → stage changes  
3. `git commit` → save snapshot  

---

## 2. Branching & Merging

Branches let you work on features separately without breaking main code.

### Creating and Switching Branches
```bash
git branch feature-login    # Create a new branch
git checkout feature-login  # Switch to branch
git checkout -b feature-ui  # Create + switch in one command
```

### Merging
```bash
git checkout main
git merge feature-login
```

👉 **Use Case**: Each new feature/bug fix should be done in its own branch → merged later.

---

## 3. GitHub Pull Requests

A **Pull Request (PR)** is how you share changes on GitHub and request review before merging.

Steps:
1. Push branch to GitHub:
   ```bash
   git push origin feature-login
   ```
2. Go to GitHub → Click “New Pull Request”.
3. Compare `feature-login` → `main`.
4. Add description → Request review.
5. Once approved → Merge into main.

👉 **Teamwork Best Practice**: Always make PRs instead of pushing directly to `main`.

---

## 4. `.gitignore` Usage

`.gitignore` tells Git which files/folders to ignore (not track).

Example `.gitignore`:
```
node_modules/
.env
*.log
dist/
```

👉 This prevents unnecessary or sensitive files from being uploaded to GitHub.  

---

# 📝 Learning Notes – Git & GitHub Basics

### 1. Why Git?
- Keeps **history of changes**.  
- Lets multiple developers work together.  
- Enables rollback if something breaks.  

### 2. Why Branching?
- Main code stays **stable**.  
- New features can be developed in isolation.  
- Easy to test before merging.  

### 3. Why Pull Requests?
- Code review → fewer bugs.  
- Team discussion before merging.  
- Safer than pushing directly.  

### 4. Why .gitignore?
- Protect sensitive files (API keys, configs).  
- Keep repo clean (no `node_modules`, build files).  
- Smaller, faster repo.  

✅ **Stage 2 Goal**:  
- Learn Git commands (`init`, `add`, `commit`).  
- Work with branches & merges.  
- Understand Pull Requests workflow.  
- Use `.gitignore` to keep repos clean.  
