# React Pivot Table Export Sample

A comprehensive React application demonstrating pivot table functionality with export capabilities. This sample showcases how to integrate a .NET backend service with a modern React frontend for powerful data analysis and reporting features.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Configuration](#environment-configuration)
- [Troubleshooting](#troubleshooting)

## Features

- 📊 Interactive pivot table interface
- 💾 Export functionality for data reports
- 🔄 Real-time data updates
- 🎨 Modern, responsive UI built with React
- 📡 Seamless integration with .NET backend service
- ⚙️ Configurable service endpoints

## Prerequisites

- **Node.js** (v16 or higher) with npm
- **.NET SDK** (v6.0 or higher)
- **A modern web browser** (Chrome, Firefox, Safari, or Edge)

Verify installations:
```bash
node --version
npm --version
dotnet --version
```

## Project Structure

```
pivot-table/
├── react-samples/
│   └── react-pivot-export/
│       ├── src/
│       │   ├── App.tsx           # Main application component
│       │   ├── main.tsx          # Application entry point
│       │   └── index.css         # Global styles
│       ├── public/               # Static assets
│       ├── vite.config.ts        # Vite configuration
│       ├── tsconfig.json         # TypeScript configuration
│       └── package.json          # Dependencies and scripts
```

## Setup Instructions

### Step 1: Run the Controller Application

The backend service must be running before starting the React client.

1. Navigate to the controller project folder:
   ```bash
   cd ../../../controller
   ```

2. Clean, build, and run the application:
   ```bash
   dotnet clean
   dotnet build
   dotnet run
   ```

3. Note the displayed localhost URL (typically `http://localhost:5285`)

### Step 2: Configure the Service URL

Update the service URL in the client application to match your running backend:

1. Open `src/App.tsx`
2. Locate the `pivotServiceUrl` configuration:
   ```ts
   const pivotServiceUrl =
     import.meta.env.VITE_PIVOT_SERVICE_URL ??
     '<service-url>/api/pivot/post';
   ```

3. Replace `<service-url>` with your backend URL. Example:
   ```ts
   const pivotServiceUrl =
     import.meta.env.VITE_PIVOT_SERVICE_URL ??
     'http://localhost:5285/api/pivot/post';
   ```

> **Note:** If running the controller via Visual Studio, the localhost port may differ from the default. Verify the port in the Visual Studio output window and update accordingly.

### Step 3: Run the Client Application

1. Navigate to the client project folder:
   ```bash
   cd ./react-samples/react-pivot-export
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open the URL displayed in your terminal (typically `http://localhost:5173`) to view the application.

## Environment Configuration

You can configure the service URL using an environment variable without modifying the source code:

```bash
# Linux/macOS
export VITE_PIVOT_SERVICE_URL="http://localhost:5285/api/pivot/post"
npm run dev

# Windows (PowerShell)
$env:VITE_PIVOT_SERVICE_URL="http://localhost:5285/api/pivot/post"
npm run dev

# Windows (Command Prompt)
set VITE_PIVOT_SERVICE_URL=http://localhost:5285/api/pivot/post
npm run dev
```

## Troubleshooting

### Issue: "Cannot connect to backend service"

- **Solution:** Verify the controller application is running and the URL in `App.tsx` matches the actual backend URL
- Check the controller output for the correct localhost port

### Issue: "Module not found" or "npm install fails"

- **Solution:** Ensure Node.js and npm are properly installed
- Try clearing the cache and reinstalling:
  ```bash
  npm cache clean --force
  rm -rf node_modules
  npm install
  ```

### Issue: "Port already in use"

- **Solution:** If port 5285 (backend) or 5173 (frontend) is already in use, check for existing processes
- Kill the process or modify the port configuration in the respective application settings

### Issue: Unexpected behavior or errors in the console

- **Solution:** Clear browser cache and reload the page
- Check browser console (F12) for detailed error messages
- Verify both backend and frontend are running on the correct URLs

## Building for Production

To create an optimized production build:

```bash
npm run build
```

The output will be in the `dist/` directory, ready to be served by a static file server.

## Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)