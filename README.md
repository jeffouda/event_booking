# EventSphere

EventSphere is a full-stack event booking application that allows users to browse, create, and book tickets for events. The application consists of a React-based frontend and a FastAPI-based backend.

## Live Demo

- **Frontend**: [https://eventsphere-frontend-two.vercel.app/](https://eventsphere-frontend-two.vercel.app/)
- **Backend API**: [https://eventsphere-backend-n996.onrender.com](https://eventsphere-backend-n996.onrender.com)

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios
- Formik & Yup
- JWT Decode

### Backend
- FastAPI
- SQLAlchemy
- Alembic
- SQLite (default, can be configured for PostgreSQL)
- JWT Authentication
- Bcrypt

## Features

- User registration and authentication
- Browse and search events
- Create new events (authenticated users)
- Book tickets for events
- View personal booked tickets
- Responsive design with modern UI

## Installation

### Prerequisites
- Node.js (for frontend)
- Python 3.8+ (for backend)
- Pipenv (for backend dependencies)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pipenv install
   ```

3. Activate virtual environment:
   ```bash
   pipenv shell
   ```

4. Set up the database:
   ```bash
   alembic upgrade head
   ```

5. Start the server:
   ```bash
   pipenv run uvicorn app.main:app --reload
   ```

   API will be available at `http://localhost:8000`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   Application will be available at `http://localhost:5173`

##  API Documentation

When running locally, visit `http://localhost:8000/docs` for interactive Swagger UI documentation.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.