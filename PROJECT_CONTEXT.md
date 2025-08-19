# Content Publishing System - Project Context

## 📋 Project Overview

The **Content Publishing System (CPS)** is a full-stack web application built with **Spring Boot** (backend) and **React.js** (frontend). It provides a comprehensive platform for content management with dual interfaces: an **Admin App** for content creators and administrators, and a **User App** for readers and content consumers.

## 🏗️ System Architecture

### Dual Application Architecture
- **App Selector**: Initial interface allowing users to choose between Admin or User experience
- **Admin App**: Full content management system with authentication
- **User App**: Public-facing interface for reading articles

### Technology Stack
- **Backend**: Spring Boot 3.2.0, Java 17, MySQL 8.0, JWT Authentication
- **Frontend**: React 18.2.0, React Router DOM 6.11.1, Axios 1.4.0
- **Security**: JWT tokens, BCrypt password encoding, role-based access control
- **Database**: MySQL with JPA/Hibernate ORM

---

## 🗄️ Database Schema & Entities

### Core Entities

#### **User Entity** (`users` table)
```java
@Entity
@Table(name = "users")
public class User implements UserDetails
```

**Fields:**
- `id` (Long, Primary Key, Auto-generated)
- `username` (String, Unique, 3-50 chars)
- `email` (String, Unique, Email validation)
- `password` (String, Min 6 chars, BCrypt encrypted)
- `firstName` (String, Required, Max 50 chars)
- `lastName` (String, Required, Max 50 chars)
- `phoneNumber` (String, Optional, E.164 format)
- `role` (Enum: USER, ADMIN, EDITOR)
- `isEnabled` (Boolean, Default true)
- `createdAt`, `updatedAt`, `lastLogin` (LocalDateTime)

**Relationships:**
- One-to-Many with `Article` (as author)
- One-to-Many with `PublishSchedule` (as creator)

**Security Implementation:**
- Implements Spring Security's `UserDetails`
- Supports role-based authorization
- JWT token generation and validation

#### **Article Entity** (`articles` table)
```java
@Entity
@Table(name = "articles")
public class Article
```

**Fields:**
- `id` (Long, Primary Key)
- `title` (String, Required, 5-200 chars)
- `content` (TEXT, Required, Min 10 chars)
- `summary` (String, Optional, Max 500 chars)
- `slug` (String, Auto-generated from title)
- `status` (Enum: DRAFT, PUBLISHED, ARCHIVED)
- `featuredImageUrl` (String, Optional)
- `metaTitle` (String, Max 60 chars, SEO)
- `metaDescription` (String, Max 160 chars, SEO)
- `viewCount` (Long, Default 0)
- `createdAt`, `updatedAt`, `publishedAt` (LocalDateTime)

**Relationships:**
- Many-to-One with `User` (author)
- Many-to-Many with `Tag` (via `article_tags` join table)
- One-to-Many with `PublishSchedule`

**Business Logic:**
- Automatic slug generation from title
- Status management methods: `publish()`, `unpublish()`, `archive()`
- View count tracking: `incrementViewCount()`

#### **Tag Entity** (`tags` table)
```java
@Entity
@Table(name = "tags")
public class Tag
```

**Fields:**
- `id` (Long, Primary Key)
- `name` (String, Unique, 2-50 chars)
- `description` (String, Max 255 chars)
- `colorCode` (String, Default "#007bff")
- `createdAt`, `updatedAt` (LocalDateTime)

**Relationships:**
- Many-to-Many with `Article`

#### **PublishSchedule Entity** (`publish_schedules` table)
```java
@Entity
@Table(name = "publish_schedules")
public class PublishSchedule
```

**Fields:**
- `id` (Long, Primary Key)
- `scheduledAt` (LocalDateTime, Required)
- `status` (Enum: PENDING, EXECUTED, CANCELLED, FAILED)
- `executedAt` (LocalDateTime, Nullable)
- `errorMessage` (String, For failure cases)
- `retryCount` (Integer, Default 0)
- `maxRetries` (Integer, Default 3)
- `createdAt`, `updatedAt` (LocalDateTime)

**Relationships:**
- Many-to-One with `Article`
- Many-to-One with `User` (createdBy)

---

## 🔐 Security Architecture

### JWT Authentication System

#### **JwtUtil** - Token Management
```java
@Component
public class JwtUtil
```
- **Token Generation**: Creates JWT tokens with user details and role claims
- **Token Validation**: Validates token signature, expiration, and user details
- **Claims Extraction**: Extracts username, expiration, and custom claims
- **Configuration**: 
  - Secret Key: Configurable via `app.jwt.secret`
  - Expiration: Configurable via `app.jwt.expiration` (default 24 hours)
  - Algorithm: HS512

#### **JwtAuthenticationFilter** - Request Interception
```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter
```
- **Token Parsing**: Extracts Bearer tokens from Authorization header
- **User Authentication**: Loads user details and sets Spring Security context
- **Error Handling**: Graceful handling of invalid or expired tokens

#### **SecurityConfig** - Security Configuration
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig
```

**Security Rules:**
- **Public Endpoints**: `/api/auth/**`, `/api/public/**`, `/api/articles/published`
- **Protected Endpoints**: All other `/api/**` routes require authentication
- **CORS**: Configured for frontend domain (localhost:3000)
- **Session Management**: Stateless (JWT-based)

**Authentication Flow:**
1. User submits credentials to `/api/auth/login`
2. Spring Security validates credentials
3. JWT token generated and returned
4. Frontend stores token in localStorage
5. Subsequent requests include token in Authorization header
6. JwtAuthenticationFilter validates and sets security context

### Role-Based Access Control

#### **User Roles**
```java
public enum Role {
    USER,    // Basic authenticated user
    ADMIN,   // Full system access
    EDITOR   // Content management access
}
```

#### **Method-Level Security**
```java
@PreAuthorize("hasRole('ADMIN') or hasRole('EDITOR')")
public ResponseEntity<?> createArticle(...)

@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<?> deleteUser(...)
```

---

## 🌐 REST API Architecture

### Base URL Structure
- **Backend**: `http://localhost:8080`
- **API Base**: `/api`
- **Public Endpoints**: `/api/public`

### Authentication Endpoints (`/api/auth`)

#### **POST /api/auth/login**
**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "type": "Bearer",
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "roles": ["ROLE_ADMIN"]
  }
}
```

#### **POST /api/auth/register**
**Request:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string",
  "phoneNumber": "string" // optional
}
```

### Article Endpoints (`/api/articles`)

#### **GET /api/articles** (Admin - Protected)
**Query Parameters:**
- `page` (int, default: 0)
- `size` (int, default: 10)
- `sortBy` (string, default: "id")
- `sortDir` (string, default: "desc")
- `title` (string, optional - filter)
- `content` (string, optional - filter)
- `status` (enum, optional - DRAFT/PUBLISHED/ARCHIVED)
- `authorId` (long, optional - filter)
- `search` (string, optional - global search)

#### **GET /api/articles/published** (Public)
**Description**: Returns only published articles for public consumption
**Query Parameters**: Similar to `/api/articles` but filtered to published only

#### **POST /api/articles** (Protected)
**Request:**
```json
{
  "title": "string",
  "content": "string",
  "summary": "string",
  "tagIds": [1, 2, 3],
  "featuredImageUrl": "string",
  "metaTitle": "string",
  "metaDescription": "string"
}
```

#### **PUT /api/articles/{id}** (Protected)
#### **DELETE /api/articles/{id}** (Protected)
#### **POST /api/articles/{id}/publish** (Protected)

### Tag Endpoints (`/api/tags`)

#### **GET /api/tags**
#### **POST /api/tags** (Protected)
**Request:**
```json
{
  "name": "string",
  "description": "string",
  "colorCode": "#007bff"
}
```
#### **PUT /api/tags/{id}** (Protected)
#### **DELETE /api/tags/{id}** (Protected)

### Schedule Endpoints (`/api/schedules`)

#### **GET /api/schedules** (Protected)
#### **POST /api/schedules** (Protected)
**Request:**
```json
{
  "articleId": 1,
  "scheduledAt": "2024-12-25T10:00:00"
}
```
#### **POST /api/schedules/{id}/execute** (Protected)
#### **POST /api/schedules/{id}/cancel** (Protected)

---

## ⚛️ Frontend Architecture

### Application Structure

#### **App.js** - Main Application Router
```javascript
function App() {
  const [selectedApp, setSelectedApp] = useState(null);
  
  if (!selectedApp) {
    return <AppSelector onSelectApp={setSelectedApp} />;
  }
  
  if (selectedApp === 'admin') {
    return <AdminAppContent />;
  }
  
  if (selectedApp === 'user') {
    return <UserApp />;
  }
}
```

#### **AppSelector** - Application Choice Interface
```javascript
const AppSelector = ({ onSelectApp }) => (
  <div className="app-selector">
    <div className="app-option" onClick={() => onSelectApp('user')}>
      <h2>User App</h2>
      <p>Read articles, search content, and explore published stories</p>
    </div>
    <div className="app-option" onClick={() => onSelectApp('admin')}>
      <h2>Admin App</h2>
      <p>Manage content, create articles, and control the publishing system</p>
    </div>
  </div>
);
```

### Component Architecture

#### **Admin App Components**

**Layout Components:**
- `Navbar.js` - Admin navigation with dashboard, articles, tags, schedules
- `Dashboard.js` - Analytics dashboard with stats and recent activity

**Authentication Components:**
- `auth/Login.js` - Admin login form with validation
- `auth/Register.js` - Admin registration form
- `AuthContext.js` - Authentication state management

**Article Management:**
- `articles/ArticleList.js` - Article listing with pagination and filters
- `articles/ArticleForm.js` - Create/edit article form
- `articles/ArticleView.js` - Article preview/view

**Tag Management:**
- `tags/TagList.js` - Tag listing with CRUD operations
- `tags/TagForm.js` - Create/edit tag form

**Schedule Management:**
- `schedules/ScheduleList.js` - Schedule listing and management
- `schedules/ScheduleForm.js` - Create/edit schedule form

**Common Components:**
- `common/Button.js` - Reusable button component
- `common/FormInput.js` - Reusable input component with validation
- `common/NotificationComponent.js` - Toast notifications

#### **User App Components**

**Main Structure:**
- `user/UserApp.js` - User app router and layout
- `user/UserNavbar.js` - Public navigation
- `user/UserDashboard.js` - User dashboard (for authenticated users)

**Authentication:**
- `user/UserLogin.js` - User login form
- `user/UserRegister.js` - User registration form

**Article Reading:**
- `user/UserArticleList.js` - Public article browsing
- `user/UserArticleView.js` - Article reading interface

### State Management

#### **AuthContext** - Authentication State
```javascript
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const login = async (credentials) => { /* JWT handling */ };
  const register = async (userData) => { /* Registration logic */ };
  const logout = async () => { /* Cleanup tokens */ };
  
  return (
    <AuthContext.Provider value={{ user, login, register, logout, ... }}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### **Local Storage Management**
- **Admin Token**: `localStorage.getItem('token')`
- **User Token**: `localStorage.getItem('userToken')`
- **User Data**: `localStorage.getItem('user')`

### API Service Layer

#### **apiService.js** - HTTP Client Configuration
```javascript
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor for auth tokens
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('token');
  const userToken = localStorage.getItem('userToken');
  const token = adminToken || userToken;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Service modules
export const articleService = {
  getAll: (params) => api.get('/articles', { params }),
  getPublished: (params) => api.get('/articles/published', { params }),
  create: (data) => api.post('/articles', data),
  // ... other methods
};
```

#### **authService.js** - Authentication API
```javascript
const authService = {
  login: async (credentials) => {
    const response = await axios.post('/api/auth/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await axios.post('/api/auth/register', userData);
    return response.data;
  }
};
```

---

## 🔄 Business Logic & Services

### Backend Services

#### **AuthService** - Authentication Business Logic
```java
@Service
@Transactional
public class AuthService {
    
    public JwtResponse login(LoginRequest loginRequest) {
        // 1. Authenticate user with Spring Security
        // 2. Update last login time
        // 3. Generate JWT token
        // 4. Return user details with token
    }
    
    public String register(RegisterRequest registerRequest) {
        // 1. Validate user doesn't exist
        // 2. Encrypt password
        // 3. Save user to database
        // 4. Return success message
    }
}
```

#### **ArticleService** - Article Management
```java
@Service
@Transactional
public class ArticleService {
    
    public Page<Article> getArticlesWithFilters(
        String title, String content, Article.Status status, 
        Long authorId, Pageable pageable) {
        // Complex filtering and pagination
    }
    
    public Article createArticle(Article article, List<Long> tagIds) {
        // 1. Set author from security context
        // 2. Generate slug from title
        // 3. Associate tags
        // 4. Save article
    }
    
    public void publishArticle(Long id) {
        // 1. Find article
        // 2. Update status to PUBLISHED
        // 3. Set published timestamp
    }
}
```

#### **PublishScheduleService** - Scheduled Publishing
```java
@Service
@Transactional
public class PublishScheduleService {
    
    @Scheduled(fixedDelay = 60000) // Every minute
    public void processScheduledPublications() {
        // 1. Find pending schedules due for execution
        // 2. Publish articles
        // 3. Update schedule status
        // 4. Handle retry logic for failures
    }
    
    public void executeSchedule(Long scheduleId) {
        // Manual execution of scheduled publication
    }
}
```

### Data Validation

#### **Backend Validation** (Bean Validation)
```java
public class RegisterRequest {
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50)
    private String username;
    
    @Email(message = "Email should be valid")
    private String email;
    
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}
```

#### **Frontend Validation**
```javascript
const validateForm = () => {
  const newErrors = {};
  
  if (!formData.username.trim()) {
    newErrors.username = 'Username is required';
  } else if (formData.username.length < 3) {
    newErrors.username = 'Username must be at least 3 characters';
  }
  
  return Object.keys(newErrors).length === 0;
};
```

---

## 🎯 Key Features & Functionality

### Admin App Features

#### **Dashboard Analytics**
- Total articles count
- Published vs draft articles
- Most viewed articles
- Popular tags
- Pending schedules count
- Recent activity feed

#### **Article Management**
- **CRUD Operations**: Create, read, update, delete articles
- **Rich Content**: Title, content, summary, featured image, SEO metadata
- **Status Management**: Draft → Published → Archived workflow
- **Tag Association**: Many-to-many relationship with tags
- **Search & Filtering**: By title, content, status, author
- **Pagination**: Configurable page size and sorting

#### **Tag System**
- **Tag CRUD**: Create, edit, delete tags
- **Color Coding**: Visual distinction with customizable colors
- **Article Association**: Tag assignment to articles
- **Popular Tags**: Analytics on most used tags

#### **Publish Scheduling**
- **Future Publishing**: Schedule articles for specific date/time
- **Automatic Execution**: Background job processes schedules
- **Manual Execution**: Force execution of pending schedules
- **Retry Logic**: Automatic retry on failures (max 3 attempts)
- **Status Tracking**: PENDING → EXECUTED/FAILED/CANCELLED

### User App Features

#### **Public Article Access**
- **Browse Published Articles**: No authentication required
- **Search Functionality**: Full-text search across title and content
- **Pagination**: Efficient loading of large article sets
- **Responsive Design**: Mobile-friendly reading experience

#### **User Authentication** (Optional)
- **Registration**: Create user accounts
- **Login**: Access personalized dashboard
- **User Dashboard**: View reading history and account info

#### **Article Reading Experience**
- **Full Article Display**: Rich content rendering
- **Metadata Display**: Author, publication date, tags
- **View Count Tracking**: Analytics on article popularity
- **Tag Browsing**: Filter articles by tags

---

## 🔧 Configuration & Environment

### Backend Configuration (`application.properties`)

#### **Database Configuration**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/content_publishing_system?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=1234
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

#### **JPA/Hibernate Configuration**
```properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true
```

#### **JWT Configuration**
```properties
app.jwt.secret=mySuperSecretKeyForJWTTokenGeneration...
app.jwt.expiration=86400000  # 24 hours in milliseconds
```

#### **CORS Configuration**
```properties
spring.web.cors.allowed-origins=http://localhost:3000
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
```

### Frontend Configuration

#### **Package.json Proxy**
```json
{
  "proxy": "http://localhost:8080"
}
```

#### **Environment Variables**
- Development proxy automatically forwards API calls to backend
- Production builds require separate backend deployment

---

## 🗃️ Sample Data & Initialization

### **DataInitializer** - Test Data Setup
The system automatically creates sample data on startup:

#### **Default Test User**
```
Username: testuser
Email: test@example.com
Password: password123
Role: USER
```

#### **Sample Tags**
- Technology (#667eea)
- Programming (#667eea)
- Web Development (#667eea)
- JavaScript (#667eea)
- React (#667eea)

#### **Sample Articles**
1. "Getting Started with React" - Published
2. "Modern JavaScript Features" - Published
3. "Building Responsive Web Applications" - Published
4. "Introduction to Web Development" - Published
5. "Advanced React Patterns" - Published

All sample articles are:
- Assigned to testuser as author
- Status: PUBLISHED
- Associated with relevant tags
- Include full content, summary, and metadata

---

## 🚀 Development Workflow

### First-Time Setup
```bash
# Backend
cd backend
mvn clean install
mvn spring-boot:run

# Frontend
cd frontend
npm install --legacy-peer-deps
npm start
```

### After Code Changes
```bash
# Stop all processes
taskkill /f /im node.exe
taskkill /f /im java.exe

# Restart with cache clearing
cd frontend && npm cache clean --force && npm start
cd backend && mvn clean compile && mvn spring-boot:run
```

### Development Ports
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8080
- **Database**: localhost:3306

---

## 🔍 Key Implementation Details

### **Slug Generation**
```java
private String generateSlug(String title) {
    return title.toLowerCase()
               .replaceAll("[^a-z0-9\\s]", "")
               .replaceAll("\\s+", "-")
               .trim();
}
```

### **View Count Tracking**
```java
public void incrementViewCount() {
    this.viewCount++;
}
```

### **Password Encryption**
```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

### **Pagination Implementation**
```java
Page<Article> articles = articleRepository.findArticlesWithFilters(
    title, content, status, authorId, 
    PageRequest.of(page, size, sort)
);
```

### **Error Handling**
```java
@RestControllerAdvice
public class ValidationExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(
        MethodArgumentNotValidException ex) {
        // Return structured error responses
    }
}
```

---

## 📊 Performance Considerations

### **Database Optimization**
- **Lazy Loading**: Relationships loaded on-demand
- **Indexing**: Unique constraints on username, email, tag names
- **Pagination**: Efficient data loading with configurable page sizes

### **Frontend Optimization**
- **Code Splitting**: Separate admin and user app bundles
- **Lazy Loading**: Components loaded as needed
- **Caching**: API responses cached in axios interceptors

### **Security Best Practices**
- **JWT Expiration**: Configurable token lifetime
- **Password Hashing**: BCrypt with salt
- **Input Validation**: Both frontend and backend validation
- **CORS Configuration**: Restricted to allowed origins

---

This comprehensive project context provides a complete understanding of the Content Publishing System's architecture, implementation details, and development workflow. The system demonstrates modern full-stack development practices with robust security, scalable architecture, and clean separation of concerns between admin and user functionalities.
