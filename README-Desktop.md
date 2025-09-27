# HSE Management System - Desktop Version

This is the Windows desktop version of the HSE (Health, Safety, Environment) Management System built with Electron.

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

## Development

### Running in Development Mode

To run the application in development mode with hot reload:

```bash
npm run electron:dev
```

This will:
1. Start the Vite development server
2. Wait for the server to be ready
3. Launch the Electron desktop application

### Building for Production

To build the application for production:

```bash
npm run build
```

### Creating Desktop Installer

To create a Windows installer:

```bash
npm run electron:dist-win
```

This will create an installer in the `dist-electron` directory.

## Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build the React application
- `npm run electron` - Run Electron with built files
- `npm run electron:dev` - Run in development mode with hot reload
- `npm run electron:pack` - Build and package the application
- `npm run electron:dist` - Create distribution packages
- `npm run electron:dist-win` - Create Windows installer

## Features

- Native Windows desktop application
- Full HSE management functionality
- Modern UI with React and Tailwind CSS
- Database integration with Supabase
- Offline capability
- Auto-updater support (can be configured)

## File Structure

```
├── electron/
│   ├── main.js          # Electron main process
│   └── preload.js       # Preload script for security
├── src/                 # React application source
├── dist/                # Built React application
└── dist-electron/      # Final packaged application
```

## Security

The application uses Electron's security best practices:
- Context isolation enabled
- Node integration disabled
- Remote module disabled
- Preload script for safe API exposure

## Distribution

The built application will be available in the `dist-electron` directory with:
- Windows installer (.exe)
- Portable application
- Auto-updater configuration