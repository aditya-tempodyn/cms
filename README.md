# Content Publishing System

A full-stack content publishing platform built with **React.js** (Frontend) and **Spring Boot** (Backend). The system provides two distinct interfaces: an **Admin App** for content management and a **User App** for reading published content.

## 🚀 Features

### Admin Application
- **User Management**: Authentication, authorization, and role-based access control
- **Article Management**: Create, edit, publish, and manage articles with rich text content
- **Tag System**: Organize content with customizable tags and categories
- **Scheduling System**: Schedule article publications for future dates
- **Dashboard**: Analytics and overview of content performance
- **Search & Filtering**: Advanced search and filtering capabilities

### User Application
- **Public Article Reading**: Browse and read published articles
- **Search & Sort**: Search articles by title/content and sort by various criteria
- **User Registration/Login**: Personal accounts for enhanced experience
- **Responsive Design**: Mobile-friendly interface for all devices
- **Article Viewing**: Full article display with metadata and tags

## 🏗️ Architecture

### Frontend (React.js)
```
frontend/
├── src/
│   ├── components/
│   │   ├── admin/           # Admin app components
│   │   │   ├── articles/    # Article management
│   │   │   ├── tags/        # Tag management
│   │   │   ├── schedules/   # Schedule management
│   │   │   ├── auth/        # Authentication
│   │   │   └── layout/      # Navigation & layout
│   │   ├── user/            # User app components
│   │   │   ├── UserApp.js   # User app router
│   │   │   ├── UserArticleList.js
│   │   │   ├── UserArticleView.js
│   │   │   ├── UserLogin.js
│   │   │   └── UserRegister.js
│   │   └── common/          # Shared components
│   ├── services/
│   │   └── apiService.js    # API communication
│   ├── context/
│   │   └── AuthContext.js   # Authentication state
│   └── App.js              # Main application router
```

### Backend (Spring Boot)
```
backend/
├── src/main/java/com/contentpublishing/
│   ├── entity/              # JPA entities
│   │   ├── User.java        # User management
│   │   ├── Article.java     # Article content
│   │   ├── Tag.java         # Tag system
│   │   └── PublishSchedule.java # Scheduling
│   ├── controller/          # REST API endpoints
│   │   ├── AuthController.java
│   │   ├── ArticleController.java
│   │   ├── TagController.java
│   │   └── PublishScheduleController.java
│   ├── service/             # Business logic
│   │   ├── AuthService.java
│   │   ├── ArticleService.java
│   │   ├── TagService.java
│   │   └── PublishScheduleService.java
│   ├── repository/          # Data access layer
│   ├── security/            # Security configuration
│   └── DataInitializer.java # Test data setup
```

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0** - UI framework
- **React Router DOM 6.11.1** - Client-side routing
- **Axios 1.4.0** - HTTP client
- **CSS Modules** - Component styling

### Backend
- **Spring Boot 3.2.0** - Application framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Data persistence
- **MySQL 8.0** - Database
- **JWT** - Token-based authentication
- **Maven** - Build tool

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Java 17** (JDK)
- **MySQL 8.0** (or higher)
- **Maven** (v3.6 or higher)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd content-hub
```

### 2. Database Setup
1. Create a MySQL database:
```sql
mysql -u root -p
CREATE DATABASE content_publishing_system;
CREATE USER 'cms_user'@'localhost' IDENTIFIED BY 'cms_password';
GRANT ALL PRIVILEGES ON content_publishing_system.* TO 'cms_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

2. Update database credentials in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 4. Frontend Setup
```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

The frontend will start on `http://localhost:3000`

## 🎯 Usage

### Application Selection
When you visit `http://localhost:3000`, you'll see an app selector with two options:

1. **Admin App** - For content creators and administrators
2. **User App** - For readers and content consumers

### Admin App Features

#### Authentication
- **Login**: Use admin credentials to access the management interface
- **Register**: Create new admin accounts
- **Role-based Access**: Different permissions for USER, ADMIN, and EDITOR roles

#### Article Management
- **Create Articles**: Rich text editor with title, content, summary, and metadata
- **Edit Articles**: Modify existing articles with full editing capabilities
- **Publish Articles**: Change article status from DRAFT to PUBLISHED
- **Delete Articles**: Remove articles from the system
- **Search & Filter**: Find articles by title, status, or content

#### Tag Management
- **Create Tags**: Add new tags with names, descriptions, and colors
- **Edit Tags**: Modify tag properties
- **Delete Tags**: Remove unused tags
- **Tag Articles**: Associate tags with articles for better organization

#### Scheduling System
- **Create Schedules**: Schedule articles for future publication
- **Execute Schedules**: Manually trigger scheduled publications
- **Cancel Schedules**: Cancel pending schedules
- **Monitor Status**: Track schedule execution status

#### Dashboard
- **Overview**: View system statistics and recent activity
- **Quick Actions**: Fast access to common tasks
- **Recent Articles**: Latest articles with status indicators
- **Most Viewed**: Popular articles by view count

### User App Features

#### Public Access
- **Browse Articles**: View all published articles without authentication
- **Read Articles**: Full article display with author, date, and tags
- **Search Articles**: Find articles by title or content
- **Sort Options**: Sort by publication date, title, or view count

#### User Accounts
- **Register**: Create personal accounts for enhanced features
- **Login**: Access personalized dashboard
- **User Dashboard**: View recent articles and user information

#### Article Reading
- **Article List**: Grid view of published articles with summaries
- **Article View**: Full article display with metadata
- **Pagination**: Navigate through large article collections
- **Responsive Design**: Mobile-friendly reading experience

## 🔧 Configuration

### Backend Configuration
Key configuration options in `application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/content_publishing_system
spring.datasource.username=root
spring.datasource.password=1234

# JWT
app.jwt.secret=your-secret-key
app.jwt.expiration=86400000

# Server
server.port=8080

# CORS
spring.web.cors.allowed-origins=http://localhost:3000
```

### Frontend Configuration
API proxy configuration in `package.json`:
```json
{
  "proxy": "http://localhost:8080"
}
```

## 🔐 Security Features

### Authentication
- **JWT Tokens**: Secure token-based authentication
- **Role-based Access**: USER, ADMIN, EDITOR roles
- **Password Security**: Encrypted password storage
- **Session Management**: Automatic token refresh

### Authorization
- **Protected Routes**: Admin routes require authentication
- **Public Access**: User app allows anonymous access to published content
- **Resource-level Security**: Users can only modify their own content
- **Admin Override**: Administrators have full system access

## 📊 Data Models

### User Entity
- **Basic Info**: username, email, firstName, lastName
- **Authentication**: password, role, isEnabled
- **Timestamps**: createdAt, updatedAt, lastLogin
- **Relationships**: articles (author), schedules (creator)

### Article Entity
- **Content**: title, content, summary, slug
- **Metadata**: metaTitle, metaDescription, featuredImageUrl
- **Status**: DRAFT, PUBLISHED, ARCHIVED
- **Analytics**: viewCount, publishedAt
- **Relationships**: author, tags, schedules

### Tag Entity
- **Properties**: name, description, colorCode
- **Relationships**: articles (many-to-many)

### PublishSchedule Entity
- **Scheduling**: scheduledAt, status, retryCount
- **Execution**: executedAt, errorMessage
- **Relationships**: article, createdBy

## 🧪 Testing

### Backend Testing
```bash
cd backend
mvn test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Article Endpoints
- `GET /api/articles` - Get all articles (admin)
- `GET /api/articles/published` - Get published articles (public)
- `POST /api/articles` - Create article
- `PUT /api/articles/{id}` - Update article
- `DELETE /api/articles/{id}` - Delete article
- `POST /api/articles/{id}/publish` - Publish article

### Tag Endpoints
- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create tag
- `PUT /api/tags/{id}` - Update tag
- `DELETE /api/tags/{id}` - Delete tag

### Schedule Endpoints
- `GET /api/schedules` - Get all schedules
- `POST /api/schedules` - Create schedule
- `POST /api/schedules/{id}/execute` - Execute schedule
- `POST /api/schedules/{id}/cancel` - Cancel schedule

## 🚀 Deployment

### Backend Deployment
1. Build the JAR file:
```bash
cd backend
mvn clean package
```

2. Run the application:
```bash
java -jar target/content-publishing-system-1.0.0.jar
```

### Frontend Deployment
1. Build the production bundle:
```bash
cd frontend
npm run build
```

2. Deploy the `build` folder to your web server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

## 🔄 Recent Updates

- **Dual Interface**: Added separate admin and user applications
- **Schedule Execution**: Manual schedule execution capability
- **Enhanced Security**: Improved authentication and authorization
- **Responsive Design**: Mobile-friendly user interface
- **Test Data**: Automatic test data initialization

---

**Built with ❤️ using React and Spring Boot** 