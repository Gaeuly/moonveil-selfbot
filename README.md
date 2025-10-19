# GitMoon

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Code Style](https://img.shields.io/badge/code%20style-prettier-ff69b4.svg?style=for-the-badge)](https://prettier.io)
[![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFBA5F)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/en/)
[![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)

### Project Description 📝

GitMoon is a web application designed to streamline and enhance the development workflow surrounding Git repositories. It offers a suite of tools for generating comprehensive README files and crafting detailed commit messages. Built with TypeScript, React, and Tailwind CSS, GitMoon provides a modern and intuitive user interface to simplify otherwise complex and time-consuming tasks.

This project aims to improve code maintainability and collaboration by providing developers with features that automatically create well-structured READMEs and guide them through the process of writing clear and informative commit messages. With integrations for API services like Gemini API and GitHub API, GitMoon assists users in crafting professional-quality documentation, promoting better understanding and collaboration within development teams. GitMoon is built to be deployed on Vercel, ensuring a smooth and optimized deployment experience.

### File Structure 🌳
```
├── .gitignore
├── README.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── public
│   ├── banner.webp
│   ├── favicon
│   │   ├── android-chrome-192x192.png
│   │   ├── android-chrome-512x512.png
│   │   ├── apple-touch-icon.png
│   │   ├── favicon-16x16.png
│   │   ├── favicon-32x32.png
│   │   ├── favicon.ico
│   │   └── site.webmanifest
│   └── gitmoon.png
├── src
│   ├── App.tsx
│   ├── components
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   ├── commit
│   │   │   ├── ActionsSection.tsx
│   │   │   ├── CommitLogSection.tsx
│   │   │   ├── ConfigSection.tsx
│   │   │   ├── DeleteSection.tsx
│   │   │   ├── FileUploadSection.tsx
│   │   │   ├── GuideSection.tsx
│   │   │   ├── Shared.tsx
│   │   │   └── Toast.tsx
│   │   └── readme
│   │       ├── ConfigSection.tsx
│   │       ├── OptionsSection.tsx
│   │       └── OutputSection.tsx
├── hooks
│   │   ├── useGithub.ts
│   │   └── useReadmeGenerator.ts
│   ├── index.css
│   ├── lib
│   │   ├── geminiApi.ts
│   │   ├── githubApi.ts
│   │   └── readme
│   │       ├── api.ts
│   │       └── prompt.ts
│   ├── main.tsx
│   ├── pages
│   │   ├── CommitPage.tsx
│   │   ├── LandingPage.tsx
│   │   └── ReadmePage.tsx
│   ├── sections
│   │   ├── About.tsx
│   │   ├── Feature.tsx
│   │   └── Hero.tsx
│   ├── types
│   │   ├── commit.ts
│   │   └── readme.ts
│   └── vite-env.d.ts
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
└── vite.config.ts
```

### Key Features ✨

- **README Generation:**  Automatically generates well-structured and informative README files based on project details and user preferences using generative AI.
- **Commit Message Assistance:** Provides guidance and suggestions for writing clear and concise commit messages.
- **GitHub Integration:** Seamlessly integrates with the GitHub API to fetch repository information and facilitate interactions.
- **Modern UI:** Offers a clean, intuitive, and responsive user interface built with React and styled with Tailwind CSS.
- **Customizable Options:** Provides various configuration options to tailor the generated README files and commit messages to specific project needs.
- **API Integrations:** Leverages API services like Gemini API to enhance README and commit message generation.
- **Deployment Ready:** Configured for easy deployment on Vercel, ensuring optimal performance and scalability.

### Tech Stack & Tools 🛠️

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFBA5F)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/en/)
[![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)
[![PostCSS](https://img.shields.io/badge/PostCSS-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white)](https://postcss.org/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Git](https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white)](https://git-scm.com/)

### Installation & Running Locally 🚀

1.  Clone the repository:

```bash
git clone <repository_url>
```

2.  Navigate to the project directory:

```bash
cd GitMoon
```

3.  Install dependencies:

```bash
npm install
```

4.  Start the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173` (or the address shown in the terminal) to view the application.

### How to Contribute 🤝

We welcome contributions to GitMoon! Here's how you can contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and ensure the code is well-documented.
4.  Write tests for your changes.
5.  Run the tests to ensure everything is working correctly.
6.  Commit your changes with a clear and concise commit message.
7.  Push your branch to your forked repository.
8.  Create a pull request to the main branch of the original repository.

Please follow the existing code style and conventions. All contributions are subject to review and approval.
