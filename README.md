# YouApp Technical Test - Backend (NestJS + MongoDB + RabbitMQ)

This project is a RESTful API implementation for a User Profile and Messaging system using an **Event-Driven** architecture with RabbitMQ as the Message Broker.

---

## 📖 API Documentation

> **[CLICK HERE TO VIEW POSTMAN DOCUMENTATION](REPLACE_WITH_YOUR_POSTMAN_LINK_HERE)**
> _(Includes documentation for Register, Login, Profile, and Messaging endpoints)_

---

## 🚀 Key Features

- **Authentication**: JWT-based authentication with Bcrypt password hashing.
- **User Profile**: Full CRUD for profiles with auto-generated Horoscope & Zodiac signs based on birth date.
- **Messaging System**:
  - **Asynchronous**: Sends messages via RabbitMQ (Producer-Consumer pattern).
  - **Reliability**: Ensures messages are persisted to MongoDB through a dedicated Worker.
  - **Two-Way Chat View**: Retrieve chat history between two specific users.
- **Dockerized**: The entire stack (App, DB, RabbitMQ) can be launched with a single command.
- **Unit Testing**: Automated testing for Services and Controllers using Jest.

---

## 🛠️ Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: MongoDB (Mongoose ODM)
- **Message Broker**: RabbitMQ
- **Containerization**: Docker & Docker Compose
- **Testing**: Jest
- **Validation**: Class-validator & Class-transformer

---

## 📦 Getting Started (Deployment)

### 1. Prerequisites

Ensure you have the following installed:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### 2. Environment Setup

Copy the `.env.example` file to `.env` and adjust the values if necessary:

```bash
cp .env.example .env
```

### 3. Running With Docker

 Run the following command in the project root terminal.

 ```bash
docker-compose up --build -d
```

The application will be accessible on port ```3001``` (or the ```PORT``` defined in your ```.env```)

### 4. 🧪 Running Unit Tests

To ensure all functionalities are working as expected, you can run tests inside the container:

```bash
# Run all tests
docker exec -it nestjs_api_container npm run test

# Run tests with coverage report
docker exec -it nestjs_api_container npm run test:cov
```

### 5. 🔗 Service Access Points

- **Backend API**: ```http://localhost:3001/api```
- **RabbitMQ Dashboard**: ```http://localhost:15672``` (User: ```guest```, Pass: ```guest```)
- **MongoDB**: ```mongodb://localhost:27017```

### 6. 📐 Messaging Architecture (Event-Driven)

This project utilizes a Producer-Consumer pattern:

1. **Client** sends a message via the ```POST /api/sendMessage``` endpoint.
2. **Backend (Producer)** validates the data and pushes the payload to the **RabbitMQ** queue.
3. **Worker (Consumer)** listens to the queue, persists the message into **MongoDB**, and logs a notification to the console.

This approach ensures the system remains responsive and can handle high message traffic by decoupling the write operation from the API response.

---

Developed by Aan Alma for the YouApp Technical Test.
