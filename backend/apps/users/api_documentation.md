# Users API Documentation

## Overview
This document describes the API endpoints for managing users, reports, and settings in the Ripple Fox application.

## Authentication
All API endpoints (except authentication endpoints) require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Users API Endpoints

### 1. User Management
- **GET /api/users/** - List all users (Admin only)
- **POST /api/users/** - Create a new user (Admin only)
- **GET /api/users/{id}/** - Get user details (Admin only)
- **PUT /api/users/{id}/** - Update user details (Admin only)
- **DELETE /api/users/{id}/** - Delete a user (Admin only)
- **GET /api/users/me/** - Get current user's details
- **POST /api/users/{id}/deactivate/** - Deactivate a user (Admin only)
- **POST /api/users/{id}/activate/** - Activate a user (Admin only)

### 2. Reports API
- **GET /api/reports/** - Get reports dashboard data
  - Returns total users, active users, new users, and growth data
- **GET /api/reports/user_growth/** - Get user growth data
- **GET /api/reports/user_activity/** - Get user activity data

### 3. Settings API
- **GET /api/settings/** - Get current user's settings
- **POST /api/settings/update_settings/** - Update user settings
  - Request body:
    ```json
    {
      "theme": "light|dark|auto",
      "language": "en|es|fr|de",
      "timezone": "UTC",
      "email_notifications": true,
      "push_notifications": true,
      "marketing_emails": false
    }
    ```
- **GET /api/settings/system_settings/** - Get system settings (Admin only)

## Permission Classes

### Available Permissions
- **IsAdminOrReadOnly**: Allows admin users to edit, authenticated users to read
- **IsOwnerOrReadOnly**: Allows owners to edit their own objects
- **CanManageUsers**: Users who can manage other users
- **CanViewReports**: Users who can view reports
- **CanManageSettings**: Users who can manage settings

### Role-based Permissions
The system supports role-based permissions:
- **CEO**: Full access to all features
- **CTO**: Full access except user deletion
- **CFO**: View users and reports
- **HR**: Manage users and view reports
- **IT Admin**: Manage users and settings
- **Manager**: View users and reports
- **Staff**: View users only

## Example API Calls

### Get Current User
```bash
curl -X GET http://localhost:8000/api/users/me/ \
  -H "Authorization: Bearer <token>"
```

### Create User (Admin only)
```bash
curl -X POST http://localhost:8000/api/users/ \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "first_name": "New",
    "last_name": "User",
    "password": "securepassword123!*_"
  }'
```

### Get Reports
```bash
curl -X GET http://localhost:8000/api/reports/ \
  -H "Authorization: Bearer <token>"
```

### Update Settings
```bash
curl -X POST http://localhost:8000/api/settings/update_settings/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "dark",
    "language": "es",
    "email_notifications": false
  }'
```

## Error Responses
- **401 Unauthorized**: Authentication required or invalid token
- **403 Forbidden**: Permission denied
- **404 Not Found**: Resource not found
- **400 Bad Request**: Invalid request data
- **500 Internal Server Error**: Server error

## Status Codes
- **200**: Success
- **201**: Created
- **204**: No Content
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Internal Server Error
