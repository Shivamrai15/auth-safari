# Auth Server Structure

This auth server has been organized into a clean MVC (Model-View-Controller) architecture for better maintainability and scalability.

## Project Structure

```
src/
├── config/
│   ├── constants.ts        # Environment variables and constants
│   └── passport.ts         # Passport strategies configuration
├── controllers/
│   ├── authController.ts   # Authentication logic
│   ├── userController.ts   # User-related operations
│   └── healthController.ts # Health check endpoints
├── middleware/
│   └── auth.ts            # Authentication middleware
├── routes/
│   ├── authRoutes.ts      # Authentication routes
│   ├── userRoutes.ts      # User routes
│   ├── healthRoutes.ts    # Health check routes
│   ├── mobileRoutes.ts    # Mobile-specific routes
│   └── index.ts           # Route aggregation
├── lib/
│   └── db.ts              # Database connection
└── index.ts               # Application entry point
```

## API Endpoints

### Authentication
- `GET /auth/google` - Mobile OAuth entry point
- `GET /api/auth/google` - Google OAuth initialization
- `GET /api/auth/google/callback` - Google OAuth callback

### User Management
- `GET /api/v2/session` - Verify user session
- `GET /api/v2/profile` - Get user profile
- `POST /api/v2/logout` - Logout user

### Health Check
- `GET /api/v2/health` - Server health status

## Features

- **Modular Structure**: Clean separation of concerns
- **TypeScript Support**: Full type safety
- **Mobile-First**: Designed for mobile app authentication
- **Google OAuth**: Integrated Google authentication
- **JWT Tokens**: Secure token-based authentication
- **Deep Linking**: Mobile app redirect support
- **Prisma ORM**: Database management

## Environment Variables

```env
DATABASE_URL="your-mongodb-connection-string"
JWT_SECRET="your-jwt-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
BASE_URL="your-production-url"
```

## Usage

1. **Start the server**: `npm run dev`
2. **Mobile authentication flow**:
   - App hits `/auth/google`
   - User authenticates with Google
   - App receives deep link: `safari://auth/success?token=jwt-token`
3. **Verify session**: Use token with `/api/v2/session`

## Mobile Deep Links

- Success: `safari://auth/success?token={jwt-token}`
- Error: `safari://auth/error?message={error-message}`
