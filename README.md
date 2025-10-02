# 🔗 URL Shortener - Enterprise-Grade Link Management System

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.1.0-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.4.0-green.svg)](https://mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-blue.svg)](https://docker.com/)
[![Azure](https://img.shields.io/badge/Azure-App%20Service-blue.svg)](https://azure.microsoft.com/)

A full-stack URL shortening service with advanced user authentication, email verification, and enterprise deployment capabilities. Built with modern web technologies and deployed on Microsoft Azure.

## 🚀 **Key Features**

### **Core Functionality**
- **URL Shortening**: Generate short, memorable links using nanoid algorithm
- **Custom Short IDs**: Allow users to create branded short links
- **Link Redirection**: Fast, reliable URL redirection with 301 redirects
- **Display Domain**: Support for custom branded domains (e.g., `bit.ly/abc123`)

### **User Management System**
- **User Registration & Authentication**: Secure account creation with bcrypt password hashing
- **Email Verification**: Multi-provider email verification system
- **Account Security**: Password strength validation and secure session management
- **Verification Code System**: Time-limited 6-digit verification codes (15-minute expiry)

### **Advanced Email Integration**
- **Gmail OAuth2**: Production-ready Gmail integration using Google APIs
- **SMTP Fallback**: Support for custom SMTP servers
- **Development Mode**: Ethereal email testing for development
- **Multi-Provider Support**: Flexible email configuration system

## 🛠 **Technology Stack**

### **Backend Technologies**
- **Node.js 20.x**: Modern JavaScript runtime with ES modules
- **Express.js 5.1.0**: High-performance web framework
- **MongoDB 7.4.0**: NoSQL database with Mongoose ODM
- **bcryptjs**: Industry-standard password hashing
- **nanoid**: Cryptographically secure ID generation

### **Email & Authentication**
- **Google APIs**: OAuth2 integration for Gmail
- **Nodemailer**: Multi-transport email delivery
- **JWT-ready**: Prepared for token-based authentication

### **DevOps & Deployment**
- **Docker**: Containerized application with multi-stage builds
- **Docker Compose**: Local development orchestration
- **Azure App Service**: Cloud deployment with container registry
- **Azure Container Registry (ACR)**: Private container image storage
- **MongoDB Atlas/CosmosDB**: Cloud database solutions

### **Frontend Technologies**
- **Vanilla JavaScript**: Modern ES6+ features
- **Responsive CSS**: Mobile-first design with CSS Grid/Flexbox
- **Google Fonts**: Professional typography (Poppins)
- **Progressive Enhancement**: Works without JavaScript

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

### **Containerization**
- **Multi-stage Docker builds** for optimized production images
- **Alpine Linux base** for minimal attack surface
- **Production-ready** container configuration
- **Environment variable injection** for secure configuration

### **Azure Cloud Deployment**
```bash
# Container Registry
az acr build --registry myregistry --image urlshortener:latest .

# App Service Deployment
az webapp create --deployment-container-image-name myregistry.azurecr.io/urlshortener:latest

# Environment Configuration
az webapp config appsettings set --settings PORT=3000 MONGODB_URI=... SMTP_USER=...
```

### **Local Development**
```bash
# Docker Compose Stack
docker-compose up -d  # MongoDB + App Service

# Development Mode
npm install
npm start
```

## 🔧 **Configuration Management**

### **Environment Variables**
```env
# Database
MONGODB_URI=mongodb+srv://...

# Application
PORT=3000
BASE_URL=https://yourdomain.com
DISPLAY_DOMAIN=bit.ly

# Email (Gmail OAuth2)
SMTP_USER=your-email@gmail.com
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REFRESH_TOKEN=...

# Email (SMTP Fallback)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_PASS=...
```

## 📊 **Performance & Security**

### **Security Features**
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Comprehensive request validation
- **SQL Injection Prevention**: MongoDB with Mongoose ODM
- **Environment Secrets**: No hardcoded credentials
- **HTTPS Ready**: SSL/TLS termination support

### **Performance Optimizations**
- **Database Indexing**: Optimized queries on shortId and email
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

### **Development Features**
- **Hot Reload**: Development server with auto-restart
- **Error Logging**: Comprehensive error tracking
- **Email Preview**: Ethereal email testing links
- **Debug Mode**: Detailed logging for troubleshooting

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
2. **Container Build**: Azure Container Registry
3. **Automated Deployment**: Azure App Service
4. **Environment Management**: Staging/Production configs
5. **Monitoring**: Application insights ready

### **Infrastructure as Code**
- **Docker Configuration**: Reproducible environments
- **Azure CLI Scripts**: Automated provisioning
- **Environment Templates**: Consistent deployments

## 📈 **Scalability & Future Enhancements**

### **Current Capabilities**
- **Horizontal Scaling**: Stateless application design
- **Database Scaling**: MongoDB Atlas auto-scaling
- **CDN Ready**: Static asset optimization
- **Load Balancer Compatible**: Multiple instance support

### **Planned Features**
- **Analytics Dashboard**: Click tracking and statistics
- **API Rate Limiting**: Request throttling
- **Custom Domains**: User-defined short domains
- **Bulk URL Processing**: CSV import/export
- **QR Code Generation**: Visual link sharing

---

## 🎯 **Technical Highlights for CV**

✅ **Full-Stack Development**: End-to-end application development  
✅ **Cloud Deployment**: Azure App Service with container orchestration  
✅ **Database Design**: MongoDB schema design and optimization  
✅ **Authentication Systems**: Secure user management with email verification  
✅ **Email Integration**: Multi-provider email system with OAuth2  
✅ **DevOps Practices**: Docker containerization and CI/CD pipeline  
✅ **API Development**: RESTful API design and implementation  
✅ **Security Implementation**: Password hashing, input validation, environment secrets  
✅ **Performance Optimization**: Database indexing, connection pooling  
✅ **Modern JavaScript**: ES6+ features, async/await, modules  

---

*This project demonstrates proficiency in modern web development, cloud deployment, database design, security implementation, and DevOps practices - essential skills for full-stack development roles.*
