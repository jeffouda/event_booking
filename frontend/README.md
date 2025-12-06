# EventSphere Frontend

This is the frontend application for the EventSphere event booking system, built with React and Vite.

## Technologies Used

- **React**: JavaScript library for building user interfaces
- **Vite**: Fast build tool and development server
- **React Router**: Declarative routing for React
- **Axios**: HTTP client for API requests
- **Formik**: Form library for React
- **Yup**: Schema validation for forms
- **JWT Decode**: Decode JWT tokens

## Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jeffouda/event_booking
   cd event-booking/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## Building for Production

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Preview the production build**:
   ```bash
   npm run preview
   ```

## Project Structure

- `src/App.jsx`: Main application component with routing
- `src/pages/`: Page components (Login, Register, Events, etc.)
- `src/components/`: Reusable components (Navbar)
- `src/context/`: React context for authentication
- `src/api/`: Axios configuration for API calls
- `src/layouts/`: Layout components

## Features

- User registration and login
- Event browsing and creation
- Ticket booking system
- User dashboard for booked tickets
- Responsive design with glassmorphism UI

## Environment Variables

Create a `.env` file in the root directory if needed for API base URL:

```
VITE_API_BASE_URL=http://localhost:8000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `npm run lint`
5. Submit a pull request

## License

This project is licensed under the MIT License. Feel free to use, modify, and distribute it as per the license terms.
