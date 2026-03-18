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
