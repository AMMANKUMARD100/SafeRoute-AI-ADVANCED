# 🤝 Contributing to SafeRoute AI

Welcome! We're excited to have you contribute to SafeRoute AI. This document provides guidelines for contributing to the project.

---

## 📋 Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please:

- Be respectful and inclusive
- Welcome differing opinions and experiences
- Focus on criticism of ideas, not individuals
- Report inappropriate behavior to support@saferoute.ai

---

## 🚀 Getting Started

### 1. Fork & Clone
```bash
# Fork the repository on GitHub
# Then clone your fork locally
git clone https://github.com/YOUR-USERNAME/SafeRoute-AI.git
cd SafeRoute-AI

# Add upstream remote
git remote add upstream https://github.com/original/SafeRoute-AI.git
```

### 2. Setup Development Environment
```bash
# Install dependencies
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..
cd ai-services && pip install -r requirements.txt && cd ..

# Setup environment variables
cp .env.example .env
# Edit .env with your credentials

# Start services
# Follow SETUP.md for detailed instructions
```

### 3. Create Feature Branch
```bash
# Update main
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
```

---

## 🎯 Contributing Types

### Bug Fixes
```bash
# 1. Create issue describing the bug
# 2. Create branch: git checkout -b fix/bug-description
# 3. Fix the bug + add tests
# 4. Commit: git commit -m "fix: Brief description of fix"
# 5. Push & create PR with issue reference
```

### Features
```bash
# 1. Discuss in issues first (optional but recommended)
# 2. Create branch: git checkout -b feature/feature-name
# 3. Implement feature + tests
# 4. Commit: git commit -m "feat: Brief description"
# 5. Push & create PR
```

### Documentation
```bash
# 1. Create branch: git checkout -b docs/documentation-topic
# 2. Update/add documentation
# 3. Commit: git commit -m "docs: Brief description"
# 4. Push & create PR
```

---

## 📝 Commit Convention

We follow Conventional Commits:

```
type(scope): subject

Body (optional)

Footer (optional)
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation
- **style**: Code style (formatting, semicolons, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvement
- **test**: Test additions/updates
- **chore**: Build, dependencies, or tooling

### Examples
```
feat(auth): add two-factor authentication
fix(routes): correct safety score calculation
docs(readme): add quick start guide
style(client): format code with prettier
refactor(api): simplify error handling
```

---

## 🏗️ Code Style

### Frontend (React/JavaScript)
```javascript
// Use functional components with hooks
const MyComponent = ({ prop1, prop2 }) => {
  const [state, setState] = useState(null);
  
  useEffect(() => {
    // Side effects here
  }, []);
  
  return <div>{/* JSX here */}</div>;
};

export default MyComponent;
```

### Backend (Node.js/Express)
```javascript
// Use async/await
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### Python (AI Services)
```python
# Follow PEP 8
def extract_features(audio_path):
    """Extract features from audio file."""
    try:
        # Implementation
        return features
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        raise
```

---

## 🧪 Testing

### Frontend Tests
```bash
cd client
npm test                    # Run all tests
npm test -- --coverage      # With coverage
```

### Backend Tests
```bash
cd server
npm test                    # Run all tests
npm test -- --coverage      # With coverage
```

### AI Tests
```bash
cd ai-services
pytest                      # Run all tests
pytest --cov               # With coverage
```

---

## 📋 Pull Request Process

### Before Submitting
1. ✅ Update main branch: `git pull upstream main`
2. ✅ Run tests locally: `npm test` or `pytest`
3. ✅ Test the feature manually
4. ✅ Update documentation if needed
5. ✅ Check code style with linter
6. ✅ Rebase on latest main if needed

### Submitting PR
```bash
# Push your branch
git push origin feature/your-feature-name

# Create PR on GitHub with:
- Clear title
- Description of changes
- Related issue number (#123)
- Screenshots (if UI changes)
- Testing instructions
```

### PR Template
```markdown
## Description
Brief description of changes

## Related Issue
Closes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Breaking change

## Testing Instructions
1. Step 1
2. Step 2

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Tests pass
- [ ] Code follows style guide
- [ ] Documentation updated
- [ ] No new warnings generated
```

---

## 🔄 Code Review Process

### Reviewer Checks
- ✅ Code quality and style
- ✅ Test coverage (>80%)
- ✅ Performance impact
- ✅ Security implications
- ✅ Documentation clarity
- ✅ Breaking changes

### Author Responds
- Address comments promptly
- Request clarification if needed
- Mark conversations as resolved
- Request re-review after changes

### Merge Criteria
- ✅ 2+ approvals
- ✅ All checks passing
- ✅ No conflicts
- ✅ Clean commit history

---

## 📚 Architecture Guidelines

### Frontend Structure
```
src/
├── components/
│   ├── common/           # Reusable components
│   ├── dashboards/       # Dashboard modules
│   ├── maps/             # Map components
│   ├── safety/           # Safety features
│   └── voice/            # Voice features
├── pages/                # Page components
├── context/              # Context providers
├── hooks/                # Custom hooks
├── services/             # API layer
└── utils/                # Utilities
```

### Backend Structure
```
server/
├── config/               # Configuration
├── controllers/          # Route handlers
├── models/               # Database models
├── routes/               # API routes
├── middleware/           # Custom middleware
└── utils/                # Utilities
```

### AI Services Structure
```
ai-services/
├── route_scorer/
│   ├── app.py           # Flask app
│   ├── model.py         # ML model
│   └── train.py         # Training script
└── voice_stress/
    ├── app.py           # Flask app
    └── feature_extraction.py
```

---

## 🚨 Reporting Security Issues

**DO NOT** create public GitHub issues for security vulnerabilities.

Instead:
1. Email: security@saferoute.ai
2. Include: Description, affected version, proof of concept
3. Give us 14 days to patch before disclosure

---

## 📖 Documentation Guidelines

### Code Comments
```javascript
// Good
// Calculate safety score based on crime rate and lighting
const score = crimeRate * 0.4 + lightingScore * 0.6;

// Bad
// Score calculation
const score = crimeRate * 0.4 + lightingScore * 0.6;
```

### Function Documentation
```javascript
/**
 * Scores a route for safety
 * @param {Object} source - Starting location {lat, lng}
 * @param {Object} destination - Ending location {lat, lng}
 * @param {string} timeOfDay - Time of day (morning/afternoon/evening/night)
 * @returns {number} Safety score (0-1)
 */
function scoreRoute(source, destination, timeOfDay) {
  // Implementation
}
```

### README Updates
- Update README.md if changing user-facing features
- Update API documentation if changing endpoints
- Add migration guide if breaking changes

---

## 🎓 Learning Resources

### Frontend
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

### Backend
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Socket.io Guide](https://socket.io/docs/)

### AI/ML
- [Scikit-learn Docs](https://scikit-learn.org/)
- [Librosa Documentation](https://librosa.org/)
- [Flask Docs](https://flask.palletsprojects.com/)

---

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given GitHub contributor badge

---

## 💬 Getting Help

- 📧 Email: dev@saferoute.ai
- 💬 Discord: [Join Server](https://discord.gg/saferoute)
- 📝 GitHub Issues: [Ask Question](https://github.com/saferoute/saferoute-ai/issues)
- 📚 Documentation: [Read Docs](./docs)

---

## 🎯 Good First Issues

Looking to contribute? Start with these:

- [Good First Issue](https://github.com/saferoute/saferoute-ai/labels/good%20first%20issue)
- [Help Wanted](https://github.com/saferoute/saferoute-ai/labels/help%20wanted)

---

## 📋 Development Checklist

Before committing:
- [ ] Code compiles/runs without errors
- [ ] Tests pass locally
- [ ] Code follows style guide
- [ ] No console errors or warnings
- [ ] Documentation updated
- [ ] Commit messages are clear
- [ ] No sensitive data committed

---

## 🚀 Deployment

### Staging Deploy
```bash
git push origin feature/branch
# PR auto-deploys to staging.saferoute.ai
```

### Production Deploy
```bash
# After PR approval and merge to main
# Automatic deployment to saferoute.ai
```

---

## 📞 Questions?

Feel free to:
- Ask in GitHub Discussions
- Email: dev@saferoute.ai
- Join our Discord community

We're here to help! 🎉

---

**Thank you for contributing to SafeRoute AI!**
Your efforts help make women's commutes safer. ❤️
