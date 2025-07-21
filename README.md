# AWS File Upload Project

This project is a basic web application that allows users to upload images and log in using AWS services.

## Features

- 📸 Upload images to S3
- 🔐 User sign up and login using AWS Cognito
- 🗂️ Metadata of uploaded files stored in DynamoDB
- 🌍 Hosted on EC2 instance with properly configured Security Groups

## Technologies Used

### Backend

- **Node.js** with Express.js
- **AWS SDK** to interact with AWS services
- **Cognito** for user authentication
- **S3** for storing uploaded images
- **DynamoDB** to store file metadata (such as original name, size, and upload date)
- **EC2** to host the server
- **Security Groups** to control traffic in/out of the EC2 instance

### Frontend

- Vanilla HTML, CSS, and JavaScript (no frontend framework)
- Fully functional login and file upload form

## File Structure

```
/controllers
  auth-controller.js   -> Handles signup and login
  upload-controller.js -> Handles file upload logic

/routes
  auth.js     -> Auth endpoints (/auth/signup, /auth/login)
  files.js    -> File upload endpoint (/upload)

/public
  index.html  -> Main frontend interface
  style.css   -> Custom CSS styles
  script.js   -> Handles form actions on client side

/index.js     -> Entry point for Express app
/.env         -> Environment variables (AWS keys, Cognito client ID, etc.)
```

## How to Run Locally

1. Clone this repo:
   ```bash
   git clone https://github.com/your-username/aws-upload-project.git
   cd aws-upload-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root with the following keys:
   ```env
   AWS_REGION=your-region
   AWS_ACCESS_KEY_ID=your-access-key-id
   AWS_SECRET_ACCESS_KEY=your-secret-access-key
   USER_POOL_ID=your-user-pool-id
   CLIENT_ID=your-client-id
   S3_BUCKET_NAME=your-bucket-name
   DYNAMODB_TABLE_NAME=your-dynamodb-table-name
   ```

4. Start the server:
   ```bash
   node index.js
   ```

5. Access the app at `http://localhost:3000`

## AWS Services Used

- **Amazon EC2** – Hosts the Express backend, configured with appropriate Security Groups for secure HTTP traffic.
- **Amazon S3** – Stores uploaded files.
- **Amazon Cognito** – Handles user sign-up and sign-in securely.
- **Amazon DynamoDB** – Stores metadata (file name, upload date, size) of uploaded files.

---

