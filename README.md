# Volt Conglomerate - NEXUS Platform

## Project Overview
Volt Conglomerate is a technology company focused on delivering AI-driven digital solutions for African markets. This repository contains the NEXUS (Nuclear Explosion Utilization System) platform, an innovative energy solution, along with other digital services.

## Tech Stack
- **Frontend**: React.js with TypeScript
- **Backend**: Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Cloud Platform**: AWS (for production)

## Project Structure
```
voltconglomerate/
├── frontend/                 # React.js frontend application
│   ├── public/              # Static files
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── pages/           # Page components
│       ├── services/        # API services
│       ├── styles/          # Global styles
│       └── utils/           # Utility functions
│
├── backend/                 # Django backend
│   ├── config/             # Django project settings
│   ├── apps/               # Django apps
│   │   ├── users/         # User management
│   │   ├── core/          # Core functionality
│   │   ├── mazepay/       # MazePay service
│   │   ├── geoattendance/ # GeoAttendance service
│   │   ├── handyconnect/  # HandyConnect service
│   │   └── nexus/         # NEXUS system
│   └── manage.py
│
├── docker/                  # Docker configuration
├── docs/                   # Documentation
└── scripts/                # Utility scripts
```

## Getting Started

### Prerequisites
- Node.js (v16+)
- Python (3.9+)
- PostgreSQL (13+)
- Docker (optional)

### Installation

#### Backend Setup
1. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install Python dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

#### Frontend Setup
1. Install Node.js dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

### Running the Application

#### Development
1. Start the backend server:
   ```bash
   cd backend
   python manage.py runserver
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

#### Production (Docker)
```bash
docker-compose up --build
```

## Features

### Core Services
1. **NEXUS System**
   - AI-mediated nuclear energy utilization
   - Real-time monitoring and control
   - Safety protocols and fail-safes

2. **MazePay**
   - Digital utility payments
   - Multi-currency support
   - Transaction history

3. **GeoAttendance**
   - Geolocation-based attendance tracking
   - Real-time monitoring
   - Reporting and analytics

4. **HandyConnect**
   - Service provider matching
   - Booking management
   - Rating and reviews

## API Documentation
API documentation is available at `/api/docs/` when running the development server.

## Testing
```bash
# Run backend tests
cd backend
python manage.py test

# Run frontend tests
cd frontend
npm test
```

## Deployment
Deployment is handled through GitHub Actions. Push to the `main` branch to trigger the CI/CD pipeline.

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
- Email: info@voltconglomerate.com
- Website: [www.voltconglomerate.com](https://www.voltconglomerate.com)
- Address: 123 Innovation Drive, Lagos, Nigeria
