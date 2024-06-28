# User Auth API
## Register User

### Endpoint
`POST /profile/register`

### Description
Registers a new user and sends a verification OTP to the provided email.

### Request Body
```json
{
  "username": "unique_username",
  "email": "user@example.com",
  "password": "user_password"
}
```

### Response
- Success: 
  ```json
  {
    "message": "User registered, Verify User through OTP"
  }
  ```


## Resend OTP

### Endpoint
`POST /profile/resendotp`

### Description
Resends the verification OTP to the user's email.

### Request Body
```json
{
  "email": "user@example.com"
}
```

### Response
- Success: 
  ```json
  {
    "message": "OTP sent for verification"
  }
  ```

## Verify Email

### Endpoint
`POST /profile/verify`

### Description
Verifies the user's email with the provided OTP.

### Request Body
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

### Response
- Success: 
  ```json
  {
    "message": "Email verified"
  }
  ```

## User Login

### Endpoint
`POST /profile/login`

### Description
Logs in the user with either username or email and password and sends the JWT token.

### Request Body
```json
{
  "username": "unique_username", // or "email": "user@example.com"
  "password": "user_password"
}
```

### Response
- Success: 
  ```json
  {
    "message": "User logged in",
    "token": "jwt_token"
  }
  ```

## Update User Profile

### Endpoint
`PUT /profile/update`

### Description
Updates the user's profile with additional information.

### Request Body
```json
{
  "location": "Mumbai",
  "work": "Software Engineer",
  "dob": "2004-06-15",
  "briefDescription": "A brief description about the user."
}
```

### Response
- Success: 
  ```json
  {
    "message": "Profile updated successfully",
    "user": { ...updatedUserDetails }
  }
  ```

## Get User Profile

### Endpoint
`GET /profile`

### Description
Fetches the profile of the authenticated user.

### Response
- Success: 
  ```json
  {
    "user": { ...userDetails }
  }
  ```

## Admin Login

### Endpoint
`POST /profile/admin/login`

### Description
Logs in an admin user.

### Request Body
```json
{
  "email": "admin@example.com",
  "password": "admin_password"
}
```

### Response
- Success: 
  ```json
  {
    "message": "Admin User logged in",
    "token": "jwt_token"
  }
  ```

## Admin Get Users

### Endpoint
`GET /profile/admin/users`

### Description
Fetches a list of usernames of all non-admin users.

### Response
- Success: 
  ```json
  {
    "users": ["username1", "username2", ...]
  }
  ```

## Admin Get User

### Endpoint
`POST /profile/admin/user`

### Description
Fetches details of a specific user by username.

### Request Body
```json
{
  "username": "unique_username"
}
```

### Response
- Success: 
  ```json
  {
    "user": { ...userDetails }
  }
  ```

## Admin Delete User

### Endpoint
`DELETE /profile/admin/user`

### Description
Deletes a specific user by username.

### Request Body
```json
{
  "username": "unique_username"
}
```

### Response
- Success: 
  ```json
  {
    "message": "User deleted"
  }
  ```


## Notes
- Ensure to include a valid JWT token in the `Authorization` header with `bearer` key for routes that require authentication.
