# Git Setup Guide - Manual Step-by-Step

If you prefer to do it yourself in your terminal, follow this guide exactly.

## Quick Start (5 minutes)

```bash
# 1. Create folder
mkdir london-ae-wait-times
cd london-ae-wait-times

# 2. Initialize git
git init

# 3. Add all files
git add .

# 4. Initial commit
git commit -m "Initial commit: A&E wait times MVP"

# 5. Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/london-ae-wait-times.git
git branch -M main
git push -u origin main

# Done!
```

---

## Detailed Step-by-Step

### Step 1: Create & Navigate to Project Directory

```bash
mkdir london-ae-wait-times
cd london-ae-wait-times
```

Verify you're in the right place:
```bash
pwd  # Should show: /path/to/london-ae-wait-times
```

### Step 2: Copy All Files

Download all these files to your project directory:
- ae-scraper.js
- server.js
- AEWaitTimes.jsx
- package.json
- README.md
- QUICK_START.md
- TESTING.md
- ROADMAP.md
- ARCHITECTURE.md
- CHECKLIST.md
- COMMANDS.md
- SUMMARY.md
- vercel.json
- Dockerfile
- docker-compose.yml
- All other .md files

File structure should look like:
```
london-ae-wait-times/
├── ae-scraper.js
├── server.js
├── AEWaitTimes.jsx
├── package.json
├── README.md
├── QUICK_START.md
├── TESTING.md
├── ROADMAP.md
├── ARCHITECTURE.md
├── CHECKLIST.md
├── COMMANDS.md
├── SUMMARY.md
├── INDEX.md
├── vercel.json
├── Dockerfile
└── docker-compose.yml
```

### Step 3: Create .gitignore File

```bash
cat > .gitignore << EOF
node_modules/
.env
.env.local
.env.*.local
dist/
build/
.DS_Store
*.log
npm-debug.log*
.vercel/
.railway/
.vscode/
.idea/
.next/
out/
.cache/
package-lock.json
EOF
```

Verify it was created:
```bash
cat .gitignore
```

### Step 4: Initialize Git Repository

```bash
git init
```

You should see:
```
Initialized empty Git repository in /path/to/london-ae-wait-times/.git/
```

### Step 5: Configure Git (First Time Only)

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

Or globally (for all projects):
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Verify:
```bash
git config user.name
git config user.email
```

### Step 6: Check What Files Git Sees

```bash
git status
```

You should see all files listed as "Untracked files"

### Step 7: Stage All Files

```bash
git add .
```

Verify:
```bash
git status
```

All files should now show as "Changes to be committed"

### Step 8: Make Initial Commit

```bash
git commit -m "Initial commit: A&E wait times MVP"
```

You should see:
```
[main (root-commit) abc1234] Initial commit: A&E wait times MVP
 15 files changed, 3650 insertions(+)
```

### Step 9: Create GitHub Repository

**Option A: Using GitHub Web Interface**

1. Go to github.com
2. Click "+" in top right → "New repository"
3. Name: `london-ae-wait-times`
4. Description: "Real-time A&E waiting times for London"
5. Public
6. **Don't** initialize with README (you have one)
7. Click "Create repository"
8. Copy the HTTPS URL (looks like: `https://github.com/YOUR_USERNAME/london-ae-wait-times.git`)

**Option B: Using GitHub CLI** (faster)

```bash
gh repo create london-ae-wait-times --public --description "Real-time A&E waiting times for London"
```

### Step 10: Connect Local Git to GitHub

Using the URL from Step 9:

```bash
git remote add origin https://github.com/YOUR_USERNAME/london-ae-wait-times.git
```

Verify:
```bash
git remote -v
```

Should show:
```
origin  https://github.com/YOUR_USERNAME/london-ae-wait-times.git (fetch)
origin  https://github.com/YOUR_USERNAME/london-ae-wait-times.git (push)
```

### Step 11: Rename Branch to Main (if needed)

```bash
git branch -M main
```

### Step 12: Push to GitHub

```bash
git push -u origin main
```

You'll be prompted for your GitHub credentials:
- Username: your GitHub username
- Password: Your GitHub personal access token (not your password!)

**How to create a personal access token:**
1. GitHub Settings → Developer settings → Personal access tokens
2. Click "Generate new token"
3. Check: `repo`, `workflow`
4. Generate & copy token
5. Use as password when prompted

### Step 13: Verify on GitHub

Go to github.com/YOUR_USERNAME/london-ae-wait-times

You should see:
- All your files listed
- Commit history showing your initial commit
- README.md displaying on the page

---

## Making Changes & Pushing

After you make changes locally:

```bash
# 1. See what changed
git status

# 2. Stage changes
git add .

# 3. Commit
git commit -m "Description of what changed"

# 4. Push to GitHub
git push origin main
```

---

## Useful Git Commands

### Check Status
```bash
git status
```

### See Commit History
```bash
git log --oneline
```

### See Changes
```bash
git diff
```

### Undo Last Commit (before pushing)
```bash
git reset --soft HEAD~1
```

### View Remote URL
```bash
git remote -v
```

### Change Remote URL
```bash
git remote set-url origin https://new-url.git
```

### Create a Branch (for features)
```bash
git checkout -b feature/add-database
git push origin feature/add-database
```

---

## Deploy After Git Setup

Once you have a GitHub repo:

### Deploy Frontend to Vercel

```bash
npm i -g vercel
vercel login
vercel link  # Connect to your repo
vercel --prod
```

### Deploy Backend to Railway

```bash
npm i -g @railway/cli
railway login
railway link
railway up
```

---

## Troubleshooting

### "I need to start over"
```bash
rm -rf .git
git init
# Start from Step 5
```

### "I forgot to create .gitignore"
```bash
# Create it now
cat > .gitignore << EOF
node_modules/
.env
dist/
build/
EOF

# Then add it
git add .gitignore
git commit -m "Add .gitignore"
git push origin main
```

### "Git keeps asking for password"
Use GitHub personal access token instead of password:
1. GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` + `workflow` scope
3. Use token as password

Or use SSH:
```bash
git remote set-url origin git@github.com:YOUR_USERNAME/london-ae-wait-times.git
```

### "I made a mistake in commit message"
```bash
git commit --amend -m "New message"
git push --force origin main
```

### "Files aren't showing on GitHub"
```bash
# Check if they're actually in git
git ls-files

# If not, they might be in .gitignore
# Make sure they're not ignored
```

---

## Success Checklist

- [ ] `mkdir london-ae-wait-times`
- [ ] All code files copied to folder
- [ ] `.gitignore` created
- [ ] `git init` run
- [ ] `git config` set
- [ ] `git add .` run
- [ ] `git commit` run
- [ ] GitHub repo created
- [ ] `git remote add origin` run
- [ ] `git push origin main` run
- [ ] Files showing on github.com

---

## Next Steps

Once everything is on GitHub:

1. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

2. **Deploy to Railway:**
   ```bash
   railway up
   ```

3. **Share live URLs:**
   - Frontend: https://your-project.vercel.app
   - Backend: https://your-api.railway.app

4. **Update README with live URLs**

---

## Commands Quick Reference

```bash
# Setup (one time)
git init
git config user.name "Your Name"
git config user.email "email@example.com"
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOU/london-ae-wait-times.git
git push -u origin main

# Regular workflow
git status                 # See changes
git add .                  # Stage changes
git commit -m "message"   # Commit
git push origin main       # Push to GitHub

# Helpful
git log --oneline         # See history
git diff                  # See changes before staging
git branch -a             # See all branches
```

---

**That's it!** Your code is now on GitHub, version controlled, and ready to deploy.

Questions? Check `QUICK_START.md` or `TESTING.md`

Next command to run:
```bash
npm install && npm run dev
```

Then:
```bash
vercel --prod
railway up
```

You're live!
