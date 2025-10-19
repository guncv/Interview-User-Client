# 🎤 Interview Simulation - User Client

> A modern, AI-powered interview simulation platform that helps users practice and improve their interview skills with real-time feedback and comprehensive evaluation.

[![React](https://img.shields.io/badge/React-19.1.1-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0.3-purple?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-Private-red)](LICENSE)

---

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Development](#-development)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [API Configuration](#-api-configuration)
- [Available Routes](#-available-routes)
- [Build & Deploy](#-build--deploy)
- [Code Quality](#-code-quality)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [Browser Support](#-browser-support)

---

## ✨ Features

### 🎯 Core Features
- **🎙️ Real-time Interview Simulation**
  - Live voice streaming with WebSocket support
  - Audio queue management for smooth playback
  - Natural conversation flow with AI interviewer

- **📊 AI-Powered Evaluation**
  - Detailed performance analysis and scoring
  - Comprehensive feedback on answers
  - Rating system for interview quality
  - Session-based evaluation tracking

- **📄 Resume Management**
  - Upload and manage multiple resumes
  - Resume parsing for tailored interview questions
  - Integration with interview preparation

- **🎬 Recording & Playback**
  - View all past interview sessions
  - Detailed recording list with metadata
  - Session replay capabilities

### 🔐 Authentication & Security
- **OAuth 2.0 Integration**
  - Google OAuth authentication
  - Facebook OAuth authentication
  - Secure callback handling
  - Session management with Redux

### 📱 User Experience
- **🐛 Issue Reporting System**
  - In-app bug reporting
  - User feedback collection
  - Direct communication channel

- **💬 Review & Comments**
  - Detailed interview comments
  - Performance insights
  - Actionable improvement suggestions

- **⚖️ Legal & Compliance**
  - Comprehensive Privacy Policy page
  - Terms of Service documentation
  - GDPR-compliant data handling

---

## 🛠️ Tech Stack

### Frontend Framework & Build Tools
- **[React](https://reactjs.org/)** `19.1.1` - Modern UI library with latest features
- **[TypeScript](https://www.typescriptlang.org/)** `5.8.3` - Type-safe development
- **[Vite](https://vitejs.dev/)** `7.0.3` - Lightning-fast build tool and dev server
- **[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)** - Fast React refresh with SWC

### State Management & Side Effects
- **[Redux](https://redux.js.org/)** `5.0.1` - Predictable state container
- **[@reduxjs/toolkit](https://redux-toolkit.js.org/)** `2.8.2` - Modern Redux patterns
- **[redux-saga](https://redux-saga.js.org/)** `1.3.0` - Elegant side effects management
- **[react-redux](https://react-redux.js.org/)** `9.2.0` - React bindings for Redux

### Routing & Navigation
- **[react-router-dom](https://reactrouter.com/)** `7.6.3` - Declarative routing

### Styling & UI
- **[styled-components](https://styled-components.com/)** `6.1.19` - CSS-in-JS styling
- **[lucide-react](https://lucide.dev/)** `0.525.0` - Beautiful icon set
- **[lottie-react](https://www.npmjs.com/package/lottie-react)** `2.4.1` - Stunning animations
- **[@lottiefiles/dotlottie-react](https://www.npmjs.com/package/@lottiefiles/dotlottie-react)** `0.14.3` - Advanced Lottie support

### HTTP & Real-time Communication
- **[axios](https://axios-http.com/)** `1.10.0` - Promise-based HTTP client
- **WebSocket** - Real-time bidirectional communication

### Utilities
- **[dayjs](https://day.js.org/)** `1.11.18` - Lightweight date manipulation
- **[eventemitter3](https://github.com/primus/eventemitter3)** `5.0.1` - Event emitter for custom events
- **[react-simple-star-rating](https://www.npmjs.com/package/react-simple-star-rating)** `5.1.7` - Star rating component

### Code Quality & Development
- **[ESLint](https://eslint.org/)** `9.30.1` - Code linting
- **[typescript-eslint](https://typescript-eslint.io/)** `8.35.1` - TypeScript linting rules
- **[Husky](https://typicode.github.io/husky/)** `9.1.7` - Git hooks
- **[lint-staged](https://github.com/okonet/lint-staged)** `16.1.2` - Pre-commit linting

---

## 📋 Prerequisites

Ensure you have the following installed on your system:

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | ≥18.0.0 | JavaScript runtime |
| **pnpm** | ≥8.0.0 | Fast, disk space efficient package manager |
| **Git** | Latest | Version control |

### Install pnpm

```bash
# Using npm
npm install -g pnpm

# Using Homebrew (macOS)
brew install pnpm

# Using curl
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

---

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd interview-user-client
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all dependencies and set up Husky git hooks automatically.

### 3. Configure Environment

Update the `env.ts` file with your backend API endpoints:

```typescript
// env.ts
export const config = {
    Domain: 'http://localhost:8080',          // Backend domain
    WebSocketUrl: 'ws://localhost:8080',      // WebSocket endpoint
    ApiBaseUrl: 'http://localhost:8080',      // REST API base URL
};
```

**For production:**
```typescript
export const config = {
    Domain: 'https://api.yourapp.com',
    WebSocketUrl: 'wss://api.yourapp.com',
    ApiBaseUrl: 'https://api.yourapp.com',
};
```

---

## 🚀 Development

### Quick Start

```bash
# Start development server (default)
pnpm run dev

# Or use Makefile shortcuts
make run-local        # Run on localhost
make run-host         # Run on network (accessible from other devices)
```

The application will be available at:
- **Local:** `http://localhost:5173`
- **Network:** `http://<your-ip>:5173` (with `make run-host`)

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start dev server with hot reload |
| `pnpm run dev:with-lint` | Lint code before starting dev server |
| `pnpm run dev:no-lint` | Start dev server without linting |
| `pnpm run dev:watch` | Run dev server with continuous linting |
| `pnpm run build` | Build for production (includes type check & linting) |
| `pnpm run build:no-lint` | Build without linting |
| `pnpm run preview` | Preview production build locally |
| `pnpm run lint` | Run ESLint on all files |
| `pnpm run lint:check` | Run ESLint with zero warnings policy |
| `pnpm run lint:errors-only` | Show only errors (hide warnings) |
| `pnpm run lint:fix` | Auto-fix ESLint issues |
| `pnpm run start` | Alias for `pnpm run dev` |

### Development Workflow

```bash
# 1. Create a feature branch
git checkout -b feature/your-feature-name

# 2. Make your changes and commit
git add .
git commit -m "feat: add new feature"
# Husky will automatically lint staged files

# 3. Push your changes
git push origin feature/your-feature-name

# 4. Create a Pull Request to 'develop' branch
```

---

## 📁 Project Structure

```
interview-user-client/
├── 📂 public/                    # Static public assets
│   └── vite.svg
│
├── 📂 src/
│   ├── 📂 actions/              # Redux action creators
│   │   ├── evaluationAction.ts
│   │   ├── interviewAction.ts
│   │   ├── issueReport.ts
│   │   ├── resumeAction.ts
│   │   ├── reviewCommenAction.ts
│   │   └── userAction.ts
│   │
│   ├── 📂 api/                  # API client & endpoints
│   │   ├── axiosInstance.ts     # Configured axios instance
│   │   ├── errorApi.ts          # Error handling
│   │   ├── evaluationApi.ts
│   │   ├── interviewApi.ts
│   │   ├── issueReportApi.ts
│   │   ├── resumeApi.ts
│   │   ├── reviewCommentApi.ts
│   │   └── userApi.ts
│   │
│   ├── 📂 assets/               # Static assets
│   │   ├── animations/          # Lottie animation files
│   │   ├── fonts/              # Custom fonts (Prompt family)
│   │   ├── images/             # Images (logo, backgrounds, etc.)
│   │   └── styles/             # Style constants
│   │       ├── Color.ts
│   │       ├── Font.ts
│   │       └── Size.ts
│   │
│   ├── 📂 components/           # React components
│   │   ├── common/             # Reusable UI components (37+ components)
│   │   ├── dialog/             # Modal dialogs
│   │   │   ├── CreateAndUpdateIssuePopup.tsx
│   │   │   └── SettingsPopup.tsx
│   │   └── layout/             # Layout components
│   │       ├── AppProvider.tsx
│   │       ├── AuthLayout.tsx
│   │       ├── AuthPageLayout.tsx
│   │       ├── ContentLayout.tsx
│   │       └── ContextProvider.tsx
│   │
│   ├── 📂 constants/            # App-wide constants
│   │
│   ├── 📂 features/             # Feature pages (route components)
│   │   ├── CreateInterviewPage.tsx
│   │   ├── FacebookCallbackPage.tsx
│   │   ├── InterviewEvaluationPage.tsx
│   │   ├── InterviewSimulation.tsx
│   │   ├── OAuthCallbackPage.tsx
│   │   ├── PrivacyPolicyPage.tsx
│   │   ├── RecordingListPage.tsx
│   │   ├── SignInPage.tsx
│   │   └── TermsOfServicePage.tsx
│   │
│   ├── 📂 hook/                 # Custom React hooks
│   │   └── useVoiceStreaming.ts # Voice streaming hook
│   │
│   ├── 📂 interface/            # TypeScript interfaces
│   │   ├── evaluationInterface.ts
│   │   ├── healthInterface.ts
│   │   ├── interviewInterface.ts
│   │   ├── reportIssueInterface.ts
│   │   ├── resumeInterface.ts
│   │   ├── reviewCommentInterface.ts
│   │   └── userInterface.ts
│   │
│   ├── 📂 reducers/             # Redux reducers
│   │   ├── evaluationReducer.ts
│   │   ├── interviewReducer.ts
│   │   ├── issueReportReducer.ts
│   │   ├── resumeReducer.ts
│   │   ├── reviewCommentReducer.ts
│   │   ├── userReducer.ts
│   │   └── rootReducer.ts
│   │
│   ├── 📂 routes/               # Routing configuration
│   │   ├── AppRoutes.tsx       # Main route component
│   │   └── routeConfig.ts      # Route definitions
│   │
│   ├── 📂 sagas/                # Redux-Saga side effects
│   │   ├── evaluationSaga.ts
│   │   ├── interviewSaga.ts
│   │   ├── issueReport.ts
│   │   ├── resumeSaga.ts
│   │   ├── reviewCommentSaga.ts
│   │   ├── userSaga.ts
│   │   └── rootSaga.ts
│   │
│   ├── 📂 store/                # Redux store configuration
│   │   └── store.ts
│   │
│   ├── 📂 utils/                # Utility functions
│   │   ├── AudioQueueManager.ts # Audio playback management
│   │   ├── format.ts           # Formatting utilities
│   │   ├── generator.ts        # ID/data generators
│   │   ├── navigation.ts       # Navigation helpers
│   │   └── suppressLottieWarning.ts
│   │
│   ├── App.tsx                  # Root App component
│   ├── App.css                  # Global app styles
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global CSS
│
├── 📂 dist/                     # Production build output (generated)
├── 📄 env.ts                    # Environment configuration
├── 📄 package.json              # Dependencies & scripts
├── 📄 pnpm-lock.yaml           # Lockfile
├── 📄 tsconfig.json            # TypeScript config (root)
├── 📄 tsconfig.app.json        # TypeScript config (app)
├── 📄 tsconfig.node.json       # TypeScript config (node)
├── 📄 vite.config.ts           # Vite configuration
├── 📄 eslint.config.js         # ESLint configuration
├── 📄 Makefile                 # Make commands
└── 📄 README.md                # This file
```

---

## 🏛️ Architecture

### State Management Flow

```
┌─────────────────┐
│   Components    │
└────────┬────────┘
         │ dispatch(action)
         ▼
┌─────────────────┐
│  Redux Store    │
└────────┬────────┘
         │ action
         ▼
┌─────────────────┐      ┌──────────────┐
│  Redux Saga     │ ◄───►│  API Layer   │
└────────┬────────┘      └──────────────┘
         │ put(action)
         ▼
┌─────────────────┐
│    Reducers     │
└────────┬────────┘
         │ new state
         ▼
┌─────────────────┐
│   Components    │
│   (re-render)   │
└─────────────────┘
```

### Key Architectural Patterns

1. **Redux Saga for Side Effects**
   - Async operations handled by sagas
   - Separation of concerns (business logic vs UI)
   - Easy testing and error handling

2. **Modular API Layer**
   - Centralized Axios instance
   - Consistent error handling
   - Request/response interceptors

3. **Component Organization**
   - Feature-based structure
   - Reusable common components
   - Layout components for consistent UI

4. **Type Safety**
   - Comprehensive TypeScript interfaces
   - Type-safe Redux actions and state
   - Type-safe API responses

---

## 🔌 API Configuration

### Backend Requirements

Your backend API should be running and accessible. The client expects:

- **REST API** at `ApiBaseUrl`
- **WebSocket** server at `WebSocketUrl`
- **CORS** enabled for your frontend origin

### Configuration File: `env.ts`

```typescript
export const config = {
    Domain: string,          // Base domain
    WebSocketUrl: string,    // WebSocket endpoint (ws:// or wss://)
    ApiBaseUrl: string,      // REST API base URL
};
```

### Environment-specific Configs

**Development:**
```typescript
Domain: 'http://localhost:8080'
WebSocketUrl: 'ws://localhost:8080'
ApiBaseUrl: 'http://localhost:8080'
```

**Staging:**
```typescript
Domain: 'https://staging-api.yourapp.com'
WebSocketUrl: 'wss://staging-api.yourapp.com'
ApiBaseUrl: 'https://staging-api.yourapp.com'
```

**Production:**
```typescript
Domain: 'https://api.yourapp.com'
WebSocketUrl: 'wss://api.yourapp.com'
ApiBaseUrl: 'https://api.yourapp.com'
```

---

## 🗺️ Available Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | SignInPage | Landing page / Sign in |
| `/auth/google/callback` | OAuthCallbackPage | Google OAuth callback handler |
| `/auth/facebook/callback` | FacebookCallbackPage | Facebook OAuth callback handler |
| `/recordings` | RecordingListPage | View all interview recordings |
| `/create-interview` | CreateInterviewPage | Create a new interview session |
| `/interview` | InterviewSimulation | Live interview simulation |
| `/evaluation/:sessionId` | InterviewEvaluationPage | View interview evaluation results |
| `/privacy-policy` | PrivacyPolicyPage | Privacy policy documentation |
| `/terms-of-service` | TermsOfServicePage | Terms of service documentation |

---

## 🏗️ Build & Deploy

### Production Build

```bash
# Build with linting and type checking
pnpm run build

# Build without linting (faster, not recommended)
pnpm run build:no-lint
```

Build output: `dist/` directory

### Preview Build

```bash
pnpm run preview
```

### Deployment Checklist

- [ ] Update `env.ts` with production API endpoints
- [ ] Run `pnpm run lint:check` to ensure code quality
- [ ] Run `pnpm run build` to create production build
- [ ] Test the build with `pnpm run preview`
- [ ] Deploy `dist/` folder to your hosting service
- [ ] Configure proper HTTPS and domain
- [ ] Set up OAuth redirect URIs in Google/Facebook consoles
- [ ] Enable gzip/brotli compression
- [ ] Configure CDN if needed

### Recommended Hosting Platforms

- **Vercel** - Zero-config deployment
- **Netlify** - Continuous deployment from Git
- **AWS S3 + CloudFront** - Scalable static hosting
- **Firebase Hosting** - Fast and secure hosting
- **GitHub Pages** - Free hosting for public repos

---

## ✅ Code Quality

### Linting

The project uses ESLint with TypeScript support and React-specific rules.

```bash
# Check for linting issues
pnpm run lint

# Auto-fix issues
pnpm run lint:fix

# Show only errors (no warnings)
pnpm run lint:errors-only

# Strict mode (fail on warnings)
pnpm run lint:check
```

### Git Hooks (Husky)

Pre-commit hooks automatically:
1. Run ESLint on staged files
2. Auto-fix issues when possible
3. Prevent commits with linting errors

### Lint-Staged Configuration

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix --quiet"
    ]
  }
}
```

### Code Style Guidelines

- Use **TypeScript** for all new files
- Follow **React Hooks** best practices
- Use **styled-components** for styling
- Keep components **small and focused**
- Write **meaningful variable/function names**
- Add **JSDoc comments** for complex functions
- Prefer **functional components** over class components

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### 1. **Port Already in Use**

```bash
Error: Port 5173 is already in use
```

**Solution:**
```bash
# Find and kill the process using port 5173
lsof -ti:5173 | xargs kill -9

# Or use a different port
pnpm run dev -- --port 3000
```

#### 2. **Module Not Found Errors**

```bash
Error: Cannot find module 'xyz'
```

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### 3. **TypeScript Errors**

```bash
Error: Type 'X' is not assignable to type 'Y'
```

**Solution:**
```bash
# Rebuild TypeScript cache
rm -rf tsconfig.tsbuildinfo tsconfig.app.tsbuildinfo tsconfig.node.tsbuildinfo
pnpm run build
```

#### 4. **WebSocket Connection Failed**

```bash
WebSocket connection to 'ws://localhost:8080' failed
```

**Solution:**
- Ensure backend server is running
- Check `WebSocketUrl` in `env.ts`
- Verify CORS settings on backend
- Check firewall/network settings

#### 5. **OAuth Callback Errors**

```bash
OAuth callback failed or redirects to wrong page
```

**Solution:**
- Verify OAuth redirect URIs in Google/Facebook console
- Ensure callback URLs match exactly (including protocol and port)
- Check OAuth credentials in backend configuration

#### 6. **Build Fails with Memory Error**

```bash
JavaScript heap out of memory
```

**Solution:**
```bash
# Increase Node memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm run build
```

#### 7. **Lottie Warnings in Console**

Lottie warnings are suppressed by `utils/suppressLottieWarning.ts`. If you see them:

```bash
# Check if the utility is imported in main.tsx
```

### Getting Help

If you encounter issues not listed here:

1. Check the browser console for error messages
2. Check the terminal for build/runtime errors
3. Verify all dependencies are installed: `pnpm install`
4. Try clearing cache: `rm -rf node_modules dist .vite pnpm-lock.yaml && pnpm install`
5. Use the in-app issue reporting feature
6. Contact the development team

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Branch Strategy

```
main/master      ← Production-ready code
  ↑
develop          ← Development branch (base for PRs)
  ↑
feature/*        ← New features
bugfix/*         ← Bug fixes
hotfix/*         ← Urgent production fixes
```

### Contribution Workflow

1. **Create a Branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

3. **Test Your Changes**
   ```bash
   pnpm run lint:check      # Ensure no linting errors
   pnpm run build           # Ensure build succeeds
   pnpm run preview         # Test production build
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

   **Commit Message Format:**
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting)
   - `refactor:` Code refactoring
   - `test:` Adding/updating tests
   - `chore:` Maintenance tasks

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   
   Then create a Pull Request to `develop` branch

### Pull Request Guidelines

- ✅ Provide clear title and description
- ✅ Link related issues
- ✅ Ensure all checks pass
- ✅ Request review from team members
- ✅ Address review comments
- ✅ Keep PRs focused and reasonably sized

### Code Review Process

All PRs require:
- [ ] Code review approval from at least 1 team member
- [ ] All CI checks passing
- [ ] No merge conflicts
- [ ] Up-to-date with base branch

---

## 🌐 Browser Support

### Supported Browsers

| Browser | Version |
|---------|---------|
| Chrome | Last 2 versions ✅ |
| Firefox | Last 2 versions ✅ |
| Safari | Last 2 versions ✅ |
| Edge | Last 2 versions ✅ |
| Opera | Last 2 versions ✅ |

### Required Features

- ES2015+ support
- WebSocket API
- Web Audio API (for voice features)
- LocalStorage
- Fetch API

### Mobile Support

- ✅ iOS Safari 13+
- ✅ Chrome Mobile
- ✅ Firefox Mobile
- ⚠️ Limited support for older Android browsers

---

## 📦 Key Dependencies

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | 19.1.1 | UI framework |
| react-dom | 19.1.0 | React DOM renderer |
| @reduxjs/toolkit | 2.8.2 | State management |
| redux-saga | 1.3.0 | Side effects |
| react-router-dom | 7.6.3 | Routing |
| axios | 1.10.0 | HTTP client |
| styled-components | 6.1.19 | CSS-in-JS |
| dayjs | 1.11.18 | Date utilities |
| lucide-react | 0.525.0 | Icons |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| typescript | 5.8.3 | Type checking |
| vite | 7.0.3 | Build tool |
| eslint | 9.30.1 | Linting |
| husky | 9.1.7 | Git hooks |

---

## 📊 Performance Tips

### Optimization Strategies

1. **Code Splitting**
   - Routes are automatically code-split
   - Use `React.lazy()` for large components

2. **Bundle Size**
   - Check bundle size: `pnpm run build`
   - Analyze with: `vite-bundle-visualizer`

3. **Caching**
   - Vite automatically generates hashed filenames
   - Configure CDN caching headers

4. **Image Optimization**
   - Use WebP format when possible
   - Compress images before adding to project
   - Consider lazy loading for images

5. **Redux Performance**
   - Use Redux DevTools to monitor performance
   - Memoize selectors with `reselect`
   - Keep state normalized

---

## 📄 License

This project is **private and proprietary**. All rights reserved.

Unauthorized copying, modification, distribution, or use of this software is strictly prohibited without explicit written permission from the copyright holder.

---

## 👥 Team & Support

### Getting Help

- 🐛 **Bug Reports:** Use in-app issue reporting
- 💡 **Feature Requests:** Contact development team
- 📧 **Email Support:** [Contact your team lead]
- 💬 **Team Chat:** [Your communication channel]

### Maintainers

[Add your team information here]

---

## 🗺️ Roadmap

### Current Version: 0.0.0

### Upcoming Features
- [ ] Additional OAuth providers (LinkedIn, GitHub)
- [ ] Advanced analytics dashboard
- [ ] Interview practice recommendations
- [ ] Video interview support
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] AI interview coach
- [ ] Collaborative practice mode

---

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

---

<div align="center">

Made with ❤️ by the Interview Simulation Team

**[⬆ Back to Top](#-interview-simulation---user-client)**

</div>
