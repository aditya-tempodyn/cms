# Content Publishing System - Demo Version

This is a standalone demo version of the Content Publishing System frontend that works with hardcoded data instead of requiring a backend server.

## 🎮 Demo Features

- **Authentication**: Login/Register forms with demo credentials
- **Dashboard**: Overview with statistics and recent content
- **Articles Management**: Create, edit, view, and manage articles
- **Tags System**: Organize content with tags
- **Publishing Schedules**: Schedule content for future publication
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Navigate to the dummy frontend directory:
   ```bash
   cd dummy-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and go to `http://localhost:3000`

## 🔑 Demo Credentials

To login to the demo application, use these credentials:

- **Username**: `demo_user`
- **Password**: `demo123`

## 📱 Features Overview

### Authentication
- Login form with demo credentials button
- Registration form (shows success but requires demo credentials to login)
- Automatic redirect to dashboard after login

### Dashboard
- Statistics cards showing article counts, tags, and schedules
- Recent articles list with quick actions
- Most viewed articles ranking
- Popular tags overview
- Quick action buttons for common tasks

### Articles Management
- View all articles with filtering and pagination
- Create new articles with rich content
- Edit existing articles
- View article details with formatted content
- Publish/unpublish articles
- Tag assignment

### Tags System
- Create and manage content tags
- Color-coded tags for easy identification
- Tag usage statistics
- Filter articles by tags

### Publishing Schedules
- Schedule articles for future publication
- View pending and completed schedules
- Manage publication timelines

## 🎨 Mock Data

The application comes with pre-populated mock data including:
- 6 sample articles with various statuses (published, draft)
- 8 categorized tags with different colors
- 4 publication schedules (pending and completed)
- Realistic content and metadata

## 🛠️ Technology Stack

- **React 18** - Frontend framework
- **React Router 6** - Client-side routing
- **CSS3** - Styling with modern features
- **Local Storage** - Session persistence
- **Mock APIs** - Simulated backend responses

## 📁 Project Structure

```
dummy-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── auth/          # Login/Register components
│   │   ├── articles/      # Article management
│   │   ├── tags/          # Tag management
│   │   ├── schedules/     # Publishing schedules
│   │   ├── layout/        # Navigation and layout
│   │   └── common/        # Reusable components
│   ├── context/           # React context for state
│   ├── services/          # Mock API services
│   ├── data/              # Mock data
│   └── App.js             # Main application
├── package.json
└── README.md
```

## 🌟 Key Differences from Original

This demo version differs from the original in the following ways:

1. **No Backend Dependency**: Uses mock data and services instead of real API calls
2. **Simulated Delays**: Includes realistic loading states and API delays
3. **Local Storage**: Persists authentication state locally
4. **Demo Credentials**: Fixed login credentials for demonstration
5. **Static Data**: Content changes are simulated but don't persist between sessions

## 🔧 Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (not recommended)

## 📝 Notes

- This is a demonstration version with simulated functionality
- Data changes don't persist between browser refreshes
- All API calls are mocked with realistic delays
- The UI is fully functional and matches the original design
- Responsive design works on all device sizes

## 🎯 Use Cases

This demo is perfect for:
- **Showcasing UI/UX design** without backend setup
- **Client demonstrations** and presentations
- **Frontend development testing** and prototyping
- **Portfolio demonstrations** of React skills
- **Training and tutorials** for content management systems

Enjoy exploring the Content Publishing System demo! 🚀 