# AutoShield Insurance Management System

A comprehensive full-stack Auto Insurance Management Website built with React.js, Spring Boot, and MySQL. This application provides a complete solution for managing insurance policies, claims, and user queries with role-based access control.

## 🚀 Features

### Frontend (React.js)

- **Professional UI**: Modern, responsive design with Material UI and Tailwind CSS
- **Homepage**: Content-rich single page with hero section, carousel, services, and contact form
- **Authentication**: Secure login/signup with role-based access (User/Admin)
- **User Dashboard**:
  - Apply for insurance policies with comprehensive forms
  - View applied policies with PDF download functionality
  - Submit claims with dummy payment system
  - Submit queries and track responses
- **Admin Dashboard**:
  - Create and manage insurance policies
  - Approve/reject claims with detailed management
  - Respond to user queries
  - View all policies and users

### Backend (Spring Boot)

- **RESTful APIs**: Complete CRUD operations for all entities
- **JWT Authentication**: Secure token-based authentication
- **Spring Security**: Role-based authorization and CORS configuration
- **Spring Data JPA**: Database operations with MySQL
- **Exception Handling**: Comprehensive error handling with meaningful messages

### Database (MySQL)

- **User Management**: User and Admin roles with encrypted passwords
- **Policy Management**: Insurance policy templates and user applications
- **Claims Processing**: Claim submission and approval workflow
- **Query System**: User support and admin response system

## 🛠️ Technology Stack

### Frontend

- React.js 18
- Material UI 5
- React Router 6
- Axios for API calls
- React Slick for carousel
- jsPDF for PDF generation
- Date pickers for forms

### Backend

- Spring Boot 3.x
- Spring Security 6
- Spring Data JPA
- MySQL 8.0
- JWT (JSON Web Tokens)
- BCrypt for password encryption

## 📋 Prerequisites

- Node.js (v16 or higher)
- Java 17 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd AIM-PROJECT
```

### 2. Database Setup

1. Create a MySQL database named `aim_insurance`
2. Update database credentials in `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/aim_insurance
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. Backend Setup

```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

### 4. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will start on `http://localhost:3000`

## 📱 Usage

### User Registration & Login

1. Visit `http://localhost:3000`
2. Click "Sign Up" to create a new account
3. Choose role: User or Admin
4. Fill in the registration form with validation
5. Login with your credentials

### User Features

- **Apply Policy**: Complete form with vehicle details, insurance type, and coverage
- **View Policies**: See all applied policies with download option
- **Submit Claims**: File claims with payment processing simulation
- **Submit Queries**: Contact support with questions

### Admin Features

- **Create Policies**: Define new insurance policy templates
- **Manage Claims**: Review and approve/reject user claims
- **Respond Queries**: Answer user questions and mark as resolved
- **View All Data**: Monitor all policies, claims, and users

## 🎨 UI/UX Features

### Design System

- **Color Palette**: Professional blue (#0f4c81) and coral (#ff7a59) theme
- **Typography**: Inter and Poppins fonts for modern readability
- **Responsive Design**: Mobile-first approach with breakpoints
- **Accessibility**: WCAG compliant with proper contrast and keyboard navigation

### Homepage Sections

- **Hero Section**: Eye-catching background with call-to-action buttons
- **Quick Stats**: Key metrics display with icons
- **Carousel**: Interactive slides showcasing services
- **Services**: Three main service cards with descriptions
- **About Us**: Company information with testimonials
- **Contact**: Detailed contact information with form and map

### Enhanced Forms

- **Validation**: Real-time form validation with helpful error messages
- **User Experience**: Intuitive form layouts with proper field grouping
- **PDF Generation**: Professional PDF downloads for policy applications
- **Payment Simulation**: Realistic payment flow for claims

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Policies

- `POST /api/policies` - Create policy (Admin only)
- `GET /api/policies` - Get all policies
- `POST /api/user-policies` - Apply for policy
- `GET /api/user-policies` - Get user's policies

### Claims

- `POST /api/claims` - Submit claim
- `GET /api/claims` - Get claims (user's or all for admin)
- `PUT /api/claims/{id}/status` - Update claim status (Admin only)

### Queries

- `POST /api/queries` - Submit query
- `GET /api/queries` - Get queries (user's or all for admin)
- `PUT /api/queries/{id}/reply` - Reply to query (Admin only)

## 🐛 Troubleshooting

### Common Issues

1. **Signup Failed Error**

   - Check if MySQL is running
   - Verify database connection in `application.properties`
   - Ensure email is not already registered

2. **CORS Issues**

   - Backend CORS is configured for `http://localhost:3000`
   - Update CORS settings in `SecurityConfig.java` if using different port

3. **PDF Download Issues**

   - Ensure jsPDF and jspdf-autotable are installed
   - Check browser console for JavaScript errors

4. **Database Connection**
   - Verify MySQL service is running
   - Check database credentials
   - Ensure database `aim_insurance` exists

### Debug Steps

1. Check backend logs for errors
2. Verify frontend console for API call issues
3. Test API endpoints using Postman or similar tools
4. Ensure all dependencies are installed

## 📝 Development Notes

### File Structure

```
AIM-PROJECT/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── api/          # API client
│   │   ├── theme/        # Material UI theme
│   │   └── styles/       # Global styles
│   └── public/assets/    # Static assets
├── backend/
│   └── src/main/java/com/aim/aim_backend/
│       ├── model/        # JPA entities
│       ├── repository/   # Data repositories
│       ├── service/      # Business logic
│       ├── web/         # REST controllers
│       └── security/    # Security configuration
└── README.md
```

### Key Features Implemented

- ✅ Professional homepage with hero, carousel, and services
- ✅ Enhanced signup with validation and error handling
- ✅ Comprehensive policy application forms
- ✅ PDF download functionality for applications
- ✅ Dummy payment system for claims
- ✅ Admin dashboard for policy and claim management
- ✅ Responsive design across all devices
- ✅ JWT-based authentication and authorization
- ✅ MySQL database with proper relationships

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support or questions, please contact:

- Email: support@autoshield.example
- Phone: +91 98765 43210

---

**AutoShield Insurance** - Protecting your journey with reliable coverage and exceptional service.
