# 🔗 URL Shortener - Web App

[![Node.js](https://img.shields.io/badge/Node.js-22.11.0-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.1.0-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.8.7-green.svg)](https://mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-blue.svg)](https://docker.com/)
[![Azure](https://img.shields.io/badge/Azure-App%20Service-blue.svg)](https://azure.microsoft.com/)

A full-stack URL shortening web application with user authentication and email verification, deployed on Microsoft Azure. Built with modern JavaScript technologies and MongoDB.

<img width="1919" height="862" alt="image" src="https://github.com/user-attachments/assets/09091a8f-2ba2-464c-8a68-6c69c6926fe1" />

## 🚀 **Key Features**

### **Core Functionality**
- **URL Shortening**: Generate short, memorable links using nanoid algorithm
- **Custom Short IDs**: Allow users to create branded short links
- **Link Redirection**: Fast, reliable URL redirection with 301 redirects

### **User Management System**
- **User Registration & Authentication**: Secure account creation with bcrypt password hashing
- **Account Security**: Password strength validation and secure session management
- **Verification Code System**: Email verification using Google Gmail API with time-limited 6-digit verification codes (15-minute expiry)

<img width="1919" height="868" alt="image" src="https://github.com/user-attachments/assets/0f282908-b61a-4a00-83ca-b4a03bf2d271" />

### **Advanced Email Integration**
- **Gmail OAuth2**: Production-ready Gmail integration using Google APIs
- **SMTP Fallback**: Support for custom SMTP servers
- **Development Mode**: Ethereal email testing for development
- **Multi-Provider Support**: Flexible email configuration system

## 🛠 **Technology Stack**

### **Backend Technologies**
- **Node.js 22.11**: Modern JavaScript runtime with ES modules
- **Express.js 5.1.0**: High-performance web framework
- **MongoDB 7.8.7**: NoSQL database with Mongoose ODM
- **bcryptjs**: Industry-standard password hashing
- **nanoid**: Cryptographically secure ID generation

<img width="1622" height="679" alt="image" src="https://github.com/user-attachments/assets/c5b979fa-e906-4c5d-95b3-517bd3aaa673" />

### **Email & Authentication**
- **Google APIs**: OAuth2 integration for Gmail
- **Nodemailer**: Multi-transport email delivery
- **JWT-ready**: Prepared for token-based authentication

### **DevOps & Deployment**
- **Docker**: Containerized application with multi-stage builds
- **Docker Compose**: Local development orchestration
- **Azure App Service**: Cloud deployment with container registry
- **Docker Hub**: Private container image storage for Docker images
- **MongoDB Atlas**: Cloud database solutions

### **Frontend Technologies**
- **Vanilla JavaScript**: Modern ES6+ features
- **Responsive CSS**: Mobile-first design with CSS Grid/Flexbox

## 🏗 **Architecture & Design Patterns**

### **Backend Architecture**
```
├── RESTful API Design
├── Modular Route Handlers
├── Async/Await Error Handling
├── Environment-based Configuration
├── Database Connection Pooling
└── Graceful Error Recovery
```

### **Database Schema Design**
```javascript
// URL Schema
{
  shortId: String (unique, indexed),
  originalUrl: String,
  createdAt: Date
}

// User Schema
{
  name: String,
  email: String (unique, indexed),
  passwordHash: String,
  emailVerified: Boolean,
  verificationCode: String,
  verificationExpires: Date
}
```

## 🚀 **Deployment & Infrastructure**

<img width="1919" height="814" alt="image" src="https://github.com/user-attachments/assets/b312acc3-5a2f-4aad-aa9e-d68e9111ff9b" />

### **Containerization**
- **Multi-stage Docker builds** for optimized production images
- **Alpine Linux base** for minimal attack surface
- **Production-ready** container configuration
- **Environment variable injection** for secure configuration

### **Azure Cloud Deployment**

- **Hosted on Azure App Service**
- **MongoDB database on MongoDB Atlas**
- **Environment variables used for database URI, email credentials, and application settings**

## 📊 **Performance & Security**

### **Security Features**
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Comprehensive request validation
- **SQL Injection Prevention**: MongoDB with Mongoose ODM
- **Environment Secrets**: No hardcoded credentials
- **HTTPS Ready**: SSL/TLS termination support

### **Performance Optimizations**
- **Connection Pooling**: MongoDB connection reuse
- **Static File Serving**: Express static middleware
- **Minimal Dependencies**: Lightweight production build

## 🧪 **Testing & Development Tools**

### **Development Scripts**
```json
{
  "get-refresh-token": "OAuth2 token generation helper",
  "check-token": "Token validation utility",
  "send-test-mail": "Email delivery testing"
}
```

## 🌐 **API Endpoints**

### **URL Management**
- `POST /shorten` - Create short URL
- `GET /:shortId` - Redirect to original URL

### **User Authentication**
- `POST /register` - User registration
- `POST /login` - User authentication
- `POST /verify-email` - Email verification
- `POST /resend-verification` - Resend verification code

## 📱 **Frontend Features**

### **User Interface**
- **Responsive Design**: Mobile-first approach
- **Modern CSS**: Grid/Flexbox layouts
- **Interactive Forms**: Real-time validation
- **Success/Error States**: User feedback system
- **Copy to Clipboard**: One-click link copying

### **User Experience**
- **Progressive Enhancement**: Works without JavaScript
- **Accessibility**: WCAG compliant forms
- **Loading States**: Visual feedback for async operations
- **Error Handling**: Graceful error recovery

## 🔄 **CI/CD & DevOps**

### **Deployment Pipeline**
1. **Source Control**: Git with feature branches
2. **Container Build**: Docker Hub
3. **Automated Deployment**: Azure App Service
4. **Environment Management**: Staging/Production configs
5. **Monitoring**: Application insights ready

### **Infrastructure as Code**
- **Docker Configuration**: Reproducible environments
- **Azure CLI Scripts**: Automated provisioning
- **Environment Templates**: Consistent deployments

## 📈 **Scalability & Future Enhancements**

### **Current Capabilities**
- **Database Scaling**: MongoDB Atlas auto-scaling
- **CDN Ready**: Static asset optimization

### **Planned Features**
- **Analytics Dashboard**: Click tracking and statistics
- **API Rate Limiting**: Request throttling
- **Custom Domains**: User-defined short domains
- **Bulk URL Processing**: CSV import/export
- **QR Code Generation**: Visual link sharing
