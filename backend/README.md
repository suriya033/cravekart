# CraveKart Backend

This is the Java Spring Boot backend for the CraveKart food delivery application, integrated with **MongoDB Atlas**.

## 🚀 Technologies Used
- **Java 17**
- **Spring Boot 3.4.3**
- **Spring Data MongoDB**
- **MongoDB Atlas** (Cloud Database)
- **Lombok**

## 🛠️ Configuration
The backend connects to **MongoDB Atlas**. Ensure your IP is whitelisted in the Atlas dashboard.

- **Port:** 8080
- **Database:** MongoDB Atlas (Cloud)
- **Status:** Integrated

## 🚀 How to Run

### Important: No NPM Commands
This is a **Java** project. Do **NOT** use `npm start` or `npm run dev`.

### Prerequisites
1.  **Java 17**: Install from [Adoptium (Temurin)](https://adoptium.net/) if not already installed.
2.  **Maven**: Install from [Apache Maven](https://maven.apache.org/download.cgi).

### Execution Steps
Navigate to the `backend` directory and run:
```powershell
mvn spring-boot:run
```

If the build succeeds, you will see `Started BackendApplication in X seconds`.

## 📂 API Endpoints

### Authentication
- `POST /api/auth/login`: Login with email and password
- `POST /api/auth/register`: Register a new user

### Restaurants
- `GET /api/restaurants`: Get all restaurants
- `GET /api/restaurants/{id}`: Get details for a specific restaurant

### Menu/Dishes
- `GET /api/dishes`: Get all popular dishes
- `GET /api/dishes/restaurant/{restaurantId}`: Get menu for a specific restaurant

### Orders
- `POST /api/orders`: Create a new order
- `GET /api/orders/customer/{customerId}`: Get order history for a user
