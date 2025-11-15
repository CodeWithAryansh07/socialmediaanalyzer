# Authentication & Database Setup Guide

This guide will help you set up authentication and MongoDB for the Social Media Content Analyzer.

## Prerequisites

You've already installed the required packages:
- `next-auth` - Authentication for Next.js
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing

## Step 1: Set up MongoDB

1. **Create a MongoDB Atlas account** (free tier available):
   - Go to https://cloud.mongodb.com/
   - Sign up or log in
   - Create a new cluster (M0 free tier is sufficient)

2. **Get your connection string**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<database>` with `socialmediaanalyzer`

3. **Update `.env.local`**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/socialmediaanalyzer?retryWrites=true&w=majority
   ```

## Step 2: Configure NextAuth

1. **Generate a secret key**:
   ```bash
   # On Windows PowerShell:
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
   
   # Or use this simple method:
   # Just generate any random string (min 32 characters)
   ```

2. **Update `.env.local`**:
   ```env
   NEXTAUTH_SECRET=your-generated-secret-here
   NEXTAUTH_URL=http://localhost:3000
   ```

## Step 3: Test the Setup

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Create an account**:
   - Go to http://localhost:3000
   - Click "Sign Up"
   - Fill in your details
   - Create your account

3. **Sign in**:
   - After registration, sign in with your credentials
   - You'll be redirected to the dashboard

4. **Upload a file**:
   - In the dashboard, upload a PDF or image
   - The analysis will be saved to your MongoDB database
   - Check your upload history below the uploader

## Features Enabled

✅ **User Authentication**
- Email/password registration
- Secure login with bcrypt hashing
- JWT session management

✅ **MongoDB Storage**
- User profiles stored in database
- Upload history persisted
- Images stored as base64 (for files < 1MB)

✅ **Protected Routes**
- Dashboard requires authentication
- Upload history is user-specific

✅ **Session Management**
- Persistent login across page refreshes
- Secure logout functionality

## Troubleshooting

### MongoDB Connection Issues
- Verify your IP is whitelisted in MongoDB Atlas (Network Access)
- Check username/password are correct
- Ensure connection string format is correct

### Authentication Issues
- Clear browser cookies if having session issues
- Verify NEXTAUTH_SECRET is set in `.env.local`
- Check MongoDB is running and accessible

### Image Storage
- Images are stored as base64 strings in MongoDB
- Large images (>1MB) are automatically compressed before upload
- PDF files don't store image data, only extracted text

## Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique, lowercase),
  password: String (bcrypt hashed),
  createdAt: Date
}
```

### Uploads Collection
```javascript
{
  userId: ObjectId (reference to User),
  fileType: 'pdf' | 'image',
  fileName: String,
  fileSize: Number,
  imageData: String (base64, only for images),
  extractedText: String,
  analysis: {
    summary: String,
    suggestions: [String],
    hashtags: [String],
    bestTimeToPost: String,
    toneRecommendations: String
  },
  createdAt: Date
}
```

## Next Steps

1. Set up your MongoDB connection
2. Generate NEXTAUTH_SECRET
3. Update `.env.local` with real values
4. Run `npm run dev`
5. Create an account and start analyzing!

For production deployment, remember to:
- Use strong passwords
- Rotate your NEXTAUTH_SECRET
- Set up proper MongoDB security rules
- Use environment variables for all secrets
