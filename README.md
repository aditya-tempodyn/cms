# 🚀 Content Publishing System

A comprehensive full-stack content management platform built with **Spring Boot** and **React**. Features JWT authentication, CRUD operations for articles/tags/schedules, real-time scheduling, and a modern responsive UI.

![Java](https://img.shields.io/badge/Java-17+-blue?style=flat-square)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-green?style=flat-square)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=flat-square)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange?style=flat-square)

## ✨ Features

### 🔐 **Authentication & Security**
- JWT-based authentication with role-based access (USER/ADMIN/EDITOR)
- Secure password validation with email/phone format checking
- Protected routes and API endpoints

### 📝 **Content Management**
- **Articles**: Create, edit, publish, and archive articles with rich text support
- **Tags**: Color-coded tag system with usage tracking and popularity metrics
- **Scheduling**: Automated publishing with retry logic and countdown timers

### 🎨 **Modern UI/UX**
- Responsive design for desktop and mobile
- Real-time notifications and status updates
- Interactive color picker for tags
- Advanced filtering, search, and pagination
- Empty states and loading indicators

### 📊 **Analytics & Tracking**
- View count tracking for articles
- Tag popularity and usage statistics
- Schedule execution monitoring with retry counts
- Dashboard with overview metrics

---

## 📋 Prerequisites

### **Required Software:**
```bash
☑️ Java 17+ (for Spring Boot backend)
☑️ Node.js 16+ & npm (for React frontend)
☑️ MySQL 8.0+ (database)
☑️ Git (to clone/manage project)
```

### **Check Versions:**
```bash
java -version          # Should show Java 17+
node -v               # Should show Node 16+
npm -v                # Should show npm 8+
mysql --version       # Should show MySQL 8+
```

---

## 🗄️ Database Setup

### **1. Start MySQL Service:**
```bash
# Windows
net start mysql

# macOS (if using Homebrew)
brew services start mysql

# Linux
sudo systemctl start mysql
```

### **2. Create Database:**
```sql
mysql -u root -p
CREATE DATABASE content_publishing_system;
CREATE USER 'cms_user'@'localhost' IDENTIFIED BY 'cms_password';
GRANT ALL PRIVILEGES ON content_publishing_system.* TO 'cms_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### **3. Database Configuration (already configured):**
The backend is pre-configured with the following database settings in `application.properties`
which is at backend\src\main\resources\application.properties :

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/content_publishing_system
spring.datasource.username=cms_user
spring.datasource.password=cms_password
spring.jpa.hibernate.ddl-auto=update
```

---

## 🔧 Backend Setup (Spring Boot)

### **1. Navigate to Backend Directory:**
```bash
cd backend
```

### **2. Install Dependencies & Run:**
```bash
# Install dependencies (Maven will download automatically)
mvn clean install

# Run the application
mvn spring-boot:run
```

### **3. Verify Backend is Running:**
```bash
# Should show: Started ContentPublishingSystemApplication
# Backend runs on: http://localhost:8080

# Test API endpoint:
curl http://localhost:8080/api/public/health
```

---

## ⚛️ Frontend Setup (React)

### **1. Navigate to Frontend Directory:**
```bash
cd frontend
```

### **2. Install Dependencies:**
```bash
npm install
```

### **3. Start Development Server:**
```bash
npm start
```

### **4. Verify Frontend is Running:**
```bash
# Frontend runs on: http://localhost:3000
# Browser should automatically open
```

---

## 🚀 Running the Complete System

### **1. Start Services in Order:**

**Terminal 1 - Database:**
```bash
# Make sure MySQL is running
mysql -u root -p -e "SHOW DATABASES;"
```

**Terminal 2 - Backend:**
```bash
cd backend
mvn spring-boot:run
# Wait for "Started ContentPublishingSystemApplication"
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm start
# Wait for "webpack compiled successfully"
```

### **2. Access the Application:**
```
🌐 Frontend: http://localhost:3000
🔗 Backend API: http://localhost:8080
📊 Database: localhost:3306/content_publishing_system
```

---

## 👤 First Time Setup

### **1. Register First User:**
- Go to http://localhost:3000
- Click "Sign Up"
- Create admin account:
  ```
  Username: admin
  Email: admin@example.com
  Phone: +1234567890
  Password: Admin123!
  ```

### **2. Login & Test Features:**
- ✅ **Dashboard** - View overview statistics
- ✅ **Articles** - Create, edit, and publish content
- ✅ **Tags** - Create colorful organizational tags
- ✅ **Schedules** - Schedule future publications

---

## 📁 Project Structure

```
content-publishing-system/
├── backend/                    # Spring Boot Application
│   ├── src/main/java/
│   │   └── com/cms/
│   │       ├── entity/        # Database entities (User, Article, Tag, PublishSchedule)
│   │       ├── repository/    # Data access layer with JPA
│   │       ├── service/       # Business logic and validation
│   │       ├── controller/    # REST API endpoints
│   │       └── config/        # Security, JWT, and CORS configuration
│   ├── src/main/resources/
│   │   └── application.properties # Database and app configuration
│   └── pom.xml               # Maven dependencies
├── frontend/                  # React Application
│   ├── src/
│   │   ├── components/       # UI components
│   │   │   ├── articles/     # Article CRUD (ArticleList, ArticleForm, ArticleView)
│   │   │   ├── tags/         # Tag CRUD (TagList, TagForm)
│   │   │   ├── schedules/    # Schedule CRUD (ScheduleList, ScheduleForm)
│   │   │   ├── auth/         # Authentication (Login, Register)
│   │   │   ├── common/       # Shared components (Button, FormInput, Notifications)
│   │   │   └── layout/       # Navigation and layout components
│   │   ├── context/          # React context for authentication
│   │   ├── services/         # API service calls with Axios
│   │   └── App.js           # Main application router
│   └── package.json         # Node.js dependencies
└── README.md               # This file
```

---

## 🔧 Configuration Files

### **Backend Configuration:**

**File Path:** `backend/src/main/resources/application.properties`

```properties
# Server Configuration
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/content_publishing_system
spring.datasource.username=cms_user
spring.datasource.password=cms_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# JWT Configuration
app.jwtSecret=mySecretKey
app.jwtExpirationInMs=604800000

# CORS Configuration
cors.allowed.origins=http://localhost:3000
```

### **Frontend Configuration:**

**File Path:** `frontend/package.json`

```json
{
  "name": "content-publishing-system-frontend",
  "proxy": "http://localhost:8080",
  "dependencies": {
    "react": "^18.2.0",
    "react-router-dom": "^6.8.1",
    "axios": "^1.3.4"
  }
}
```

> **📍 Important:** 
> - The backend configuration file must be created/edited at `backend/src/main/resources/application.properties`
> - The frontend configuration is already present in `frontend/package.json` when you run `npm install`
> - If the `application.properties` file doesn't exist, create it manually in the specified path

---

## 🧪 Testing the System

### **1. Test Backend API:**
```bash
# Health check
curl http://localhost:8080/api/public/health

# Register user
curl -X POST http://localhost:8080/api/auth/register \
-H "Content-Type: application/json" \
-d '{"username":"testuser","email":"test@test.com","phone":"+1234567890","password":"Test123!"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
-H "Content-Type: application/json" \
-d '{"username":"testuser","password":"Test123!"}'
```

### **2. Test Frontend Features:**
- ✅ Register/Login functionality
- ✅ Dashboard displays statistics correctly
- ✅ Create and edit articles with tags
- ✅ Manage colorful tags with descriptions
- ✅ Schedule future publications with countdown timers

---

## 📚 API Endpoints

### **Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### **Articles:**
- `GET /api/articles` - Get all articles (with pagination/filtering)
- `GET /api/articles/{id}` - Get article by ID
- `POST /api/articles` - Create new article
- `PUT /api/articles/{id}` - Update article
- `DELETE /api/articles/{id}` - Delete article
- `POST /api/articles/{id}/publish` - Publish article

### **Tags:**
- `GET /api/tags` - Get all tags (with pagination/filtering)
- `GET /api/tags/{id}` - Get tag by ID
- `POST /api/tags` - Create new tag
- `PUT /api/tags/{id}` - Update tag
- `DELETE /api/tags/{id}` - Delete tag

### **Schedules:**
- `GET /api/schedules` - Get all schedules (with pagination/filtering)
- `GET /api/schedules/{id}` - Get schedule by ID
- `POST /api/schedules` - Create new schedule
- `PUT /api/schedules/{id}` - Update schedule
- `DELETE /api/schedules/{id}` - Delete schedule
- `POST /api/schedules/{id}/execute` - Execute schedule immediately
- `POST /api/schedules/{id}/cancel` - Cancel schedule

---

## ❗ Troubleshooting

### **Common Issues:**

**Database Connection Error:**
```bash
# Check MySQL is running
sudo systemctl status mysql
# Or restart MySQL
sudo systemctl restart mysql
```

**Port Already in Use:**
```bash
# Kill process on port 8080 (backend)
kill -9 $(lsof -ti:8080)
# Kill process on port 3000 (frontend)
kill -9 $(lsof -ti:3000)
```

**Maven Build Issues:**
```bash
# Clean and rebuild
mvn clean install -U
```

**npm Install Issues:**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**CORS Issues:**
- Ensure backend is running on port 8080
- Ensure frontend proxy is configured in package.json
- Check CORS configuration in `WebConfig.java`

---

## 🎯 Quick Start Commands

For a rapid setup, run these commands in sequence:

```bash
# 1. Setup database
mysql -u root -p -e "CREATE DATABASE content_publishing_system;"

# 2. Start backend (Terminal 1)
cd backend && mvn spring-boot:run

# 3. Start frontend (Terminal 2)
cd frontend && npm install && npm start

# 4. Open browser to http://localhost:3000
```

---

## 🏗️ Technology Stack

### **Backend:**
- **Framework**: Spring Boot 3.2.0
- **Security**: Spring Security with JWT authentication
- **Database**: MySQL 8.0+ with JPA/Hibernate
- **Build Tool**: Maven
- **Java Version**: 17+

### **Frontend:**
- **Framework**: React 18.2.0
- **Routing**: React Router DOM 6.8.1
- **HTTP Client**: Axios 1.3.4
- **Styling**: Modern CSS with responsive design
- **Build Tool**: Create React App

### **Database Schema:**
- **Users**: Authentication and role management
- **Articles**: Content with status tracking and view counts
- **Tags**: Color-coded organizational system
- **PublishSchedules**: Automated publishing with retry logic

---

## 🚀 Features in Detail

### **Article Management:**
- Rich text content creation and editing
- Status management (DRAFT, PUBLISHED, ARCHIVED)
- Tag association and filtering
- View count tracking
- Summary and metadata support

### **Tag System:**
- Custom color coding with live preview
- Usage statistics and popularity tracking
- Flexible filtering and search
- Description and metadata support

### **Scheduling System:**
- Future publication scheduling
- Automatic execution with retry logic
- Real-time countdown timers
- Manual execution and cancellation
- Status tracking (PENDING, COMPLETED, FAILED, CANCELLED)

### **Authentication & Security:**
- JWT token-based authentication
- Role-based access control (USER, ADMIN, EDITOR)
- Secure password validation
- Email and phone format validation
- Protected API endpoints

---

## 📊 Dashboard Features

The dashboard provides:
- **Overview Statistics**: Total articles, tags, schedules
- **Recent Activity**: Latest articles and scheduled publications
- **Quick Actions**: Direct links to create new content
- **Status Summaries**: Published vs draft articles, pending schedules

---

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop and mobile
- **Modern Styling**: Clean, professional interface with hover animations
- **Real-time Updates**: Live notifications and status changes
- **Interactive Elements**: Color pickers, countdown timers, progress indicators
- **User Feedback**: Comprehensive error handling and success messages
- **Accessibility**: Proper form labels, keyboard navigation support

---

## 📈 Future Enhancements

Potential areas for expansion:
- Rich text editor integration (e.g., TinyMCE, Quill)
- File upload and media management
- Email notification system
- Advanced analytics and reporting
- Multi-language support
- Theme customization
- Advanced user permissions
- Comment system for articles
- Social media integration
- SEO optimization features

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the [API documentation](#-api-endpoints)
3. Ensure all [prerequisites](#-prerequisites) are installed correctly
4. Verify database configuration and connectivity

---

## 🎉 Success!

Your Content Publishing System is now ready to use! 

Open http://localhost:3000 in your browser, register your first user, and start creating content with the powerful scheduling and tag management features.

**Happy publishing! 🚀** 