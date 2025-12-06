# EventSphere Backend

This is the backend API for the EventSphere event booking application, built with FastAPI.

## Technologies Used

- **FastAPI**: Modern, fast web framework for building APIs with Python 3.8+
- **SQLAlchemy**: SQL toolkit and Object-Relational Mapping (ORM)
- **Alembic**: Database migration tool
- **SQLite**: Database (can be changed to PostgreSQL)
- **JWT**: JSON Web Tokens for authentication
- **Bcrypt**: Password hashing
- **Pydantic**: Data validation

## Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone <https://github.com/jeffouda/event_booking>
   cd event-booking/backend
   ```

2. **Install dependencies**:
   Make sure you have Pipenv installed. If not, install it with `pip install pipenv`.

   ```bash
   pipenv install
   ```

3. **Activate the virtual environment**:
   ```bash
   pipenv shell
   ```

4. **Set up the database**:
   The application uses SQLite by default. To initialize the database:

   ```bash
   alembic upgrade head
   ```

   This will create the database tables.

## Running the Application

1. **Start the development server**:
   ```bash
   pipenv run uvicorn app.main:app --reload
   ```

   The API will be available at `http://localhost:8000`

2. **API Documentation**:
   Visit `http://localhost:8000/docs` for the interactive Swagger UI documentation.

## Database Configuration

- Default database: SQLite (`event_booking.db`)
- To use PostgreSQL, update `SQLALCHEMY_DATABASE_URL` in `app/database.py` and install psycopg2.

## Authentication

The API uses JWT tokens for authentication. Users can register and login to get access tokens.

## API Endpoints

- `POST /register`: Register a new user
- `POST /token`: Login and get access token
- `GET /events`: Get all events
- `POST /events`: Create a new event (authenticated)
- `DELETE /events/{event_id}`: Delete an event (authenticated)
- `POST /events/{event_id}/tickets`: Create ticket types for an event
- `POST /book`: Book a ticket
- `GET /my-tickets`: Get user's booked tickets

## Environment Variables

For production, set the following environment variables:

- `SECRET_KEY`: Secret key for JWT encoding
- `SQLALCHEMY_DATABASE_URL`: Database connection string

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License. Feel free to use, modify, and distribute it as per the license terms.

