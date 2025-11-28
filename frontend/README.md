# Frontend - React + TypeScript + Vite

E-Commerce frontend application built with React, TypeScript, TailwindCSS, Redux Toolkit, and React Router v6.

## Tech Stack

- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **TailwindCSS** - Styling
- **Redux Toolkit** - State Management
- **React Router v6** - Navigation
- **Axios** - HTTP Client

## Project Structure

```
src/
├── components/       # Reusable UI components
│   └── layout/       # Layout components (Navbar, Footer, MainLayout)
├── pages/            # Page components
├── features/         # Redux slices & store
├── services/         # API service layer (Axios)
├── hooks/            # Custom React hooks
├── utils/            # Helper functions
├── routes/           # Route configuration
├── types/            # TypeScript type definitions
├── App.tsx           # Main App component
├── main.tsx          # Entry point
└── index.css         # Global styles (TailwindCSS)
```

## Getting Started

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

### Development Server

```bash
npm run dev
```

Application will run on `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Features Implemented

- ✅ React 18 with TypeScript
- ✅ Vite configuration with path aliases
- ✅ TailwindCSS with custom theme
- ✅ React Router v6 with layouts
- ✅ Redux Toolkit store with auth slice
- ✅ Axios API integration
- ✅ Type-safe development

## Available Routes

- `/` - Home page
- `/products` - Products listing
- `/login` - Login page
- `/register` - Registration page

## Path Aliases

- `@/` → `./src/`
- `@/components` → `./src/components`
- `@/pages` → `./src/pages`
- `@/features` → `./src/features`
- `@/services` → `./src/services`
