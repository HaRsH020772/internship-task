# Adding Environment Variables to Node.js Code

This guide outlines how to add environment variables to Node.js code using a `.env` file. Environment variables are a way to configure and manage your application settings outside of your codebase, making it easier to deploy and manage different environments (e.g., development, staging, production).

## Prerequisites

- Node.js installed on your system

## Steps

1. **Create a `.env` file:** 
   Create a file named `.env` in the root directory of your Node.js project.

2. **Define Environment Variables:** 
   In the `.env` file, define your environment variables in the following format:
   ```plaintext
   # Server configuration
   PORT=7070

   # Database configuration
   DB_URL=<url>

   # Cloudinary credentials
   CLOUDINARY_NAME=<name>
   CLOUDINARY_API_KEY=<api_key>
   CLOUDINARY_API_SECRET=<api_secret_key>

   # JWT credentials
   JWT_SECRET=<jwt_token>
   JWT_EXPIRY=<expiry_time>

   # Resend credentials
   RESEND_API_TOKEN=<resend_token>
   RESEND_EMAIL=<resend_email>
