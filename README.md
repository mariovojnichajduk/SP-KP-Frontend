# StudioPresent Marketplace Frontend

## Description

StudioPresent Marketplace is a modern marketplace platform frontend built with React, TypeScript, and Vite. The application provides a responsive user interface for browsing products, managing listings, user authentication, and seller-buyer communication. It features state management with Redux Toolkit, client-side routing with React Router, and real-time notifications.

## Technologies & Libraries

### Core Framework
- **React 19** - Modern UI library with latest features
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server

### State Management
- **Redux Toolkit** - Simplified Redux state management
- **React Redux** - Official React bindings for Redux

### Routing & Navigation
- **React Router DOM** - Client-side routing and navigation

### HTTP Client
- **Axios** - Promise-based HTTP client for API communication

### UI & Notifications
- **React Toastify** - Toast notifications for user feedback

### Development Tools
- **ESLint** - Code linting and style enforcement
- **TypeScript ESLint** - TypeScript-specific linting rules
- **Vite HMR** - Hot Module Replacement for fast development

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Backend API running (see backend README)

### Steps

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see section below)

4. Run the application

## Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

```env
# API Configuration
VITE_API_URL=http://localhost:3000/
```

### Environment Variables Explanation

- **VITE_API_URL** - Backend API base URL. In Vite, environment variables must be prefixed with `VITE_` to be accessible in the client-side code.

**Important**:
- For production, update this to your production backend URL (e.g., `https://api.yourdomain.com/`)
- Always include the trailing slash `/` in the URL
- The variable is accessible in the app as `import.meta.env.VITE_API_URL`

## Running the Application

### Development Mode
```bash
# Start development server with hot reload
npm run dev
```

The application will be available at `http://localhost:5173` (Vite's default port)

### Production Build
```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

The optimized production files will be in the `dist/` directory.

### Linting
```bash
# Run ESLint to check code quality
npm run lint
```

## Project Structure

```
src/
├── api/            # API service layer and HTTP client configuration
├── components/     # Reusable React components
├── pages/          # Page-level components (routes)
├── store/          # Redux store configuration and slices
├── types/          # TypeScript type definitions
├── styles/         # Global styles and CSS modules
├── assets/         # Static assets (images, fonts, etc.)
├── App.tsx         # Root application component
├── main.tsx        # Application entry point
└── index.css       # Global CSS styles
```

## Key Features

- User authentication (login, register, email verification)
- Product browsing and search
- Listing management (create, edit, delete)
- Category filtering
- Image upload and management
- Seller-buyer contact system
- Responsive design for mobile and desktop
- Toast notifications for user feedback
- Protected routes with authentication

## Development Tips

### Hot Module Replacement (HMR)
Vite provides fast HMR out of the box. Changes to your code will be reflected instantly in the browser without losing application state.

### TypeScript
The project is fully typed with TypeScript. Make sure to define proper types for your components, API responses, and Redux state.

### Environment Variables
Remember that all environment variables in Vite must be prefixed with `VITE_` to be exposed to the client. Never store sensitive secrets in frontend environment variables as they are publicly accessible.

### Production Deployment
When deploying to production:
1. Update `VITE_API_URL` to your production backend URL
2. Run `npm run build` to create optimized production files
3. Deploy the `dist/` folder to your hosting service (Vercel, Netlify, etc.)
4. Ensure your hosting service is configured for SPA routing (redirect all routes to `index.html`)

## License

This project is private and unlicensed.
