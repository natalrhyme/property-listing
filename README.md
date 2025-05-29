# Property Listing Project

A modern property listing platform built with Node.js and TypeScript that allows users to browse, search, and manage real estate listings. Features include user authentication, property favoriting, and Redis caching for improved performance. The application provides a RESTful API for property management and user interactions.

## Installation

Instructions on how to set up and install the project.

```bash
# Clone the repository
git clone <repository_url>

# Navigate to the project directory
cd property listing

# Install backend dependencies
cd backend
npm install 

```

## Usage

Instructions on how to run and use the project.

```bash
# Start the backend server
cd backend
npm start 

#environment variables
MONGO_URI=mongodb://127.0.0.1:27017/DB_name
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379

```

## API Endpoints

Document your main API endpoints here.

- `GET /api/properties` - Get all properties
- `POST /api/properties` - Create a new property
- `GET /api/properties/:id` - Get a specific property
- `PUT /api/properties/:id` - Update a specific property
- `DELETE /api/properties/:id` - Delete a specific property
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

## Technologies Used

List the main technologies and frameworks used in the project.

- Node.js
- Express.js
- MongoDB
- Mongoose
- TypeScript
- JSON Web Tokens (JWT)

