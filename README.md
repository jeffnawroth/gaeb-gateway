# GAEB Gateway

## About the Project

GAEB Gateway is a web application for processing and visualizing IFC building models (Industry Foundation Classes) with integration to GAEB formats (Gemeinsamer Ausschreibungsstandard Elektronisch für Bauleistungen - German standard for electronic tendering in construction). The project enables extraction of building elements from IFC files, their interactive 3D visualization, and creation of bills of quantities.

## Features

- **IFC Processing**: Load and parse IFC files to extract building elements (walls, doors, windows, roofs, etc.)
- **3D Visualization**: Interactive display of IFC models using @xbim/viewer
- **GAEB Conversion**: Create and edit GAEB bills of quantities from IFC data
- **User Management**: JWT-based authentication and authorization with role system
- **REST API**: Complete backend API for IFC and user data management

## Tech Stack

### Backend
- **Framework**: ASP.NET Core 7.0 (C#)
- **Database**: PostgreSQL 18.1
- **ORM**: Entity Framework Core
- **IFC Processing**: Xbim Toolkit (Xbim.Essentials, Xbim.Geometry)
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: Vue.js 2.6 with TypeScript
- **UI Framework**: Vuetify 2.6 (Material Design)
- **State Management**: Vuex
- **3D Viewer**: @xbim/viewer
- **HTTP Client**: Axios
- **Validation**: Vee-Validate

### DevOps
- **Containerization**: Docker & Docker Compose
- **Build Tools**: Vue CLI, .NET CLI

## Installation and Execution

### Prerequisites
- Docker and Docker Compose
- Environment variables (see `.env` example below)

### Environment Variables

Create a `.env` file in the project root directory:

```env
VUE_APP_API_PATH=http://localhost:5007
POSTGRES_PASSWORD=your_secure_password
POSTGRES_CONNECTION_STRING=Host=db;Port=5432;Database=gaebgateway;Username=postgres;Password=your_secure_password
JWT_SECRET=your_jwt_secret_at_least_32_characters_long
```

### Starting the Project

```bash
# Start development environment with Docker Compose
docker-compose -f compose.dev.yml up --build
```

The application will be available at:
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5007
- **API Documentation**: http://localhost:5007/swagger
- **Database**: localhost:5432

### Without Docker

#### Backend
```bash
cd backend/gaeb-gateway-backend
dotnet restore
dotnet run
```

#### Frontend
```bash
cd frontend
npm install
npm run serve
```

## Project Structure

```
├── backend/                 # ASP.NET Core Backend
│   ├── Controllers/        # API Endpoints
│   ├── Models/            # Data Models
│   ├── Data/              # Database Context
│   └── Migrations/        # EF Core Migrations
├── frontend/               # Vue.js Frontend
│   ├── src/
│   │   ├── components/    # Vue Components
│   │   ├── views/         # Page Components
│   │   └── api/           # API Client
│   └── public/            # Static Assets
└── compose.dev.yml        # Docker Compose Configuration
```
