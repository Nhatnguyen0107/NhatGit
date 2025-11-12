# Git Setup Guide

## 📋 Files được ignore (KHÔNG đẩy lên Git)

### ⚠️ **CRITICAL - Không bao giờ push:**
- `.env` - Chứa DB password, JWT secrets
- `node_modules/` - Dependencies (quá lớn)
- `*.log` - Log files
- `uploads/` - User uploads (nặng)

### 🔒 **Security:**
- `*.pem`, `*.key`, `*.cert` - SSL certificates
- `secrets/` - Secret keys
- `credentials.json` - API credentials

### 💻 **Development:**
- `.vscode/`, `.idea/` - IDE settings (cá nhân)
- `*.swp`, `*.tmp` - Temporary files
- `dist/`, `build/` - Build output (tự generate)

### 🗄️ **Database:**
- `*.sqlite`, `*.db` - Local database files
- `*.sql` - Database dumps

---

## 🚀 Quick Start Git

### 1. Initialize Git Repository

```bash
cd "d:\Fullstack - Iviettech\Thuc tap - Iviettech\Du an\ecommerce-system"
git init
```

### 2. Check Status

```bash
git status
```

Bạn sẽ thấy:
- ✅ Files màu xanh: Sẽ được commit
- ❌ Files bị ignore: Không hiển thị

### 3. Add Files

```bash
# Add tất cả files (trừ files trong .gitignore)
git add .

# Hoặc add từng file cụ thể
git add backend/src/
git add backend/package.json
```

### 4. Commit

```bash
git commit -m "Initial commit: Setup backend authentication system"
```

### 5. Connect to Remote Repository

```bash
# Thêm remote repository
git remote add origin https://github.com/your-username/ecommerce-system.git

# Push lên GitHub
git push -u origin main
```

---

## ✅ Files NÊN push lên Git

### Backend:
```
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── migrations/
│   ├── seeders/
│   └── server.js
├── package.json
├── .env.example
├── .gitignore
├── .sequelizerc
└── README.md
```

### Documentation:
```
├── SRS.md
├── TESTING.md
├── DATABASE.md
└── README.md
```

---

## ⚠️ Before First Push Checklist

- [ ] File `.env` có trong `.gitignore`
- [ ] `node_modules/` có trong `.gitignore`
- [ ] Đã tạo file `.env.example` (không có password thật)
- [ ] Đã xóa mọi password/secret trong code
- [ ] Đã test `git status` không thấy file sensitive

---

## 🔍 Verify .gitignore Working

```bash
# Kiểm tra files sẽ được track
git status

# Kiểm tra files bị ignore
git status --ignored
```

**Expected result:**
- ❌ `.env` - Ignored
- ❌ `node_modules/` - Ignored
- ✅ `.env.example` - Tracked
- ✅ `package.json` - Tracked

---

## 📝 Commit Message Convention

```bash
# Format
git commit -m "type(scope): subject"

# Examples
git commit -m "feat(auth): Add JWT authentication"
git commit -m "fix(database): Fix connection pool issue"
git commit -m "docs(readme): Update setup instructions"
git commit -m "refactor(controllers): Simplify error handling"
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (formatting)
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance tasks

---

## 🔄 Common Git Commands

```bash
# Check status
git status

# Add files
git add .
git add backend/src/controllers/

# Commit
git commit -m "Your message"

# Push to remote
git push origin main

# Pull from remote
git pull origin main

# Create new branch
git checkout -b feature/product-api

# Switch branch
git checkout main

# View commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard local changes
git checkout -- filename.js
```

---

## 🌿 Git Branching Strategy

```
main (production)
  ↓
develop (development)
  ↓
feature/authentication
feature/product-api
feature/cart-checkout
```

**Workflow:**
```bash
# Create feature branch
git checkout -b feature/product-api

# Work on feature...
git add .
git commit -m "feat(products): Add CRUD operations"

# Push feature branch
git push origin feature/product-api

# Merge to develop (after review)
git checkout develop
git merge feature/product-api

# Merge to main (after testing)
git checkout main
git merge develop
```

---

## 🚨 Emergency: Accidentally Pushed Secrets

If you pushed `.env` or passwords by mistake:

### 1. Remove from Git history
```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch backend/.env" \
  --prune-empty --tag-name-filter cat -- --all
```

### 2. Force push
```bash
git push origin --force --all
```

### 3. **CHANGE ALL PASSWORDS & SECRETS IMMEDIATELY**
```
- Database password
- JWT secrets
- API keys
- Everything in .env
```

---

## 📚 Useful Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [gitignore.io](https://www.toptal.com/developers/gitignore)

---

## 💡 Tips

1. **Commit often** - Small, focused commits
2. **Write clear messages** - Future you will thank you
3. **Never commit secrets** - Use .env.example instead
4. **Review before push** - `git diff` and `git status`
5. **Pull before push** - Avoid merge conflicts
