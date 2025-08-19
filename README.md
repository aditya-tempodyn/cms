# Content Publishing System

A full-stack content publishing platform built with **React.js** (Frontend) and **Spring Boot** (Backend). The system provides two distinct interfaces: an **Admin App** for content management and a **User App** for reading published content.



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


## 1.First time project running guide

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

### 3. Backend Configuration Setup

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

### 4. Frontend Configuration

API proxy configuration in `package.json`:

```json
{
  "proxy": "http://localhost:8080"
}
```



### 5. Backend Running 

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 6. Frontend Running

```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

The frontend will start on `http://localhost:3000`







## 2.After making Edits project running guide

### After Making Code Changes

When you've made changes to the frontend or backend code and need to restart the applications with fresh builds:

#### Stop All Running Processes
```bash
# Stop all Node.js processes (React frontend)
taskkill /f /im node.exe

# Stop all Java processes (Spring Boot backend)
taskkill /f /im java.exe
```

#### Restart Frontend with Cache Clearing
```bash
cd frontend
npm cache clean --force
npm start
```

#### Restart Backend with Fresh Compilation
```bash
cd backend
mvn clean compile
mvn spring-boot:run
```


> **💡 Tip**: Keep two terminal windows open - one for frontend and one for backend - for faster development cycles.


