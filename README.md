# 🚀 Scalable Microservices Backend

A high-performance and scalable microservices architecture built with **NestJS**, **TypeScript**, **MongoDB**, and inter-service communication via **TCP**. The system manages reservations, user authentication, payment processing (Stripe), and email notifications (Gmail).

---

## 📐 System Architecture

The system is split into independent and decentralized microservices that communicate via HTTP REST requests (for external clients) and the **TCP** protocol (for low-latency internal communication using `@MessagePattern`).

```
┌─────────┐
│ Client  │
└───┬─────┴─────────────────────────┐
    │ POST /login                   │ POST /reservations (JWT)
    ▼                               ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│       Auth Service      │   │   Reservations Service  │
│  HTTP 3001 | TCP 3002   │   │        HTTP 3000        │
└───────────┬─────────────┘   └────────────┬────────────┘
            │                              │
            │ MessagePattern: authenticate │ MessagePattern: create_charge
            └──────────────┬───────────────┘
                           ▼
              ┌─────────────────────────┐
              │    Payments Service     │ ──► Stripe API
              │        TCP 3003         │
              └────────────┬────────────┘
                           │ MessagePattern: notify_email
                           ▼
              ┌─────────────────────────┐
              │  Notifications Service  │ ──► Gmail API
              │        TCP 3004         │
              └─────────────────────────┘
```

---

## 🛠️ Technologies Used

* **Framework:** [NestJS](https://nestjs.com/) (Monorepo Architecture)
* **Language:** TypeScript
* **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
* **Inter-Service Communication:** NestJS Microservices (**TCP** Transport)
* **Authentication & Security:** JWT (JSON Web Tokens), Passport.js, HTTP-Only Cookies
* **Data Validation:** `class-validator` & `class-transformer`
* **External Integrations:**
  * **Stripe SDK** (Payment processing)
  * **Nodemailer / Gmail API** (Transactional email delivery)
* **DevOps & Containerization:** Docker, Docker Compose, Kubernetes

---

## 📦 Services & Ports

| Service | Transport | HTTP Port | TCP Port | Description |
| :--- | :---: | :---: | :---: | :--- |
| **Reservations** | HTTP / TCP | `3000` | - | Manages the creation and retrieval of venue/seat reservations. |
| **Auth** | HTTP / TCP | `3001` | `3002` | Manages users, login, JWT issuance, and cross-service session validation. |
| **Payments** | TCP | - | `3003` | Processes charges via Stripe upon receiving `create_charge` events. |
| **Notifications** | TCP | - | `3004` | Sends confirmation emails and alerts via Gmail (`notify_email`). |
| **Database** | MongoDB | `27017` | - | Shared or isolated MongoDB instance per collection. |

---

## 🔑 Authentication Flow & TCP Communication

1. **User Authentication (`/login`):**
   * The client sends a `POST /login` request to the **Auth Service**.
   * The Auth Service validates credentials and returns an HTTP-Only cookie containing the JWT.

2. **Reservation Creation (`POST /reservations`):**
   * The client sends a reservation request accompanied by the JWT token.
   * The `JwtAuthGuard` in the **Reservations Service** intercepts the request and emits a TCP message `@MessagePattern('authenticate')` to the **Auth Service**.
   * The Auth Service verifies the JWT signature and returns the authenticated user payload.

3. **Payment Processing:**
   * Once the user is validated, the **Reservations Service** emits a TCP event `@MessagePattern('create_charge')` to the **Payments Service**.
   * The Payments Service connects to the Stripe API to process the payment.

4. **Notification:**
   * After the payment is successfully processed, the **Payments Service** notifies the **Notifications Service** via TCP `@MessagePattern('notify_email')`.
   * The Notifications Service sends a confirmation email to the user via the Gmail integration.

---

## 📂 Project Structure (Monorepo)

```text
├── apps/
│   ├── auth/                # Authentication & User Management Module
│   ├── reservations/        # Reservations Management Module
│   ├── payments/            # Stripe Integration Module (TCP)
│   └── notifications/       # Email Notification Module (TCP)
├── libs/
│   └── common/              # Shared library across microservices
│       ├── src/
│       │   ├── auth/        # JwtAuthGuard, strategies, and middlewares
│       │   ├── database/    # AbstractRepository, AbstractSchema, and DatabaseModule
│       │   ├── decorators/  # Custom decorators such as @CurrentUser()
│       │   ├── dto/         # Shared DTOs (e.g., UserDto)
│       │   └── constants/   # Injection tokens and service names
├── docker-compose.yaml      # Development environment orchestration
└── nest-cli.json            # NestJS Monorepo configuration
```

---

## ⚙️ Environment Configuration (.env)

Each microservice maintains its own `.env` file located in `apps/<service>/.env`.

### `apps/reservations/.env`
```env
PORT=3000
MONGODB_URI=mongodb://mongo:27017/reservations
AUTH_HOST=auth
AUTH_PORT=3002
PAYMENTS_HOST=payments
PAYMENTS_PORT=3003
```

### `apps/auth/.env`
```env
HTTP_PORT=3001
TCP_PORT=3002
MONGODB_URI=mongodb://mongo:27017/auth
JWT_SECRET=your_super_secret_secure_key
JWT_EXPIRATION=3600
```

### `apps/payments/.env`
```env
PORT=3003
STRIPE_SECRET_KEY=sk_test_...
NOTIFICATIONS_HOST=notifications
NOTIFICATIONS_PORT=3004
```

### `apps/notifications/.env`
```env
PORT=3004
SMTP_USER=your_email@gmail.com
GOOGLE_OAUTH_CLIENT_ID=your_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_client_secret
GOOGLE_OAUTH_REFRESH_TOKEN=your_refresh_token
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18+)
* **Docker** & **Docker Compose**
* **NPM** or **PNPM**

### 1. Clone the repository
```bash
git clone https://github.com/your-username/your-repository.git
cd your-repository
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run with Docker Compose (Recommended)
```bash
docker-compose up --build
```

### 4. Run locally in development mode
If you prefer running services individually with hot-reload enabled:

```bash
# Reservations Service
npm run start:dev reservations

# Auth Service
npm run start:dev auth

# Payments Service
npm run start:dev payments

# Notifications Service
npm run start:dev notifications
```

---

## 🧪 Running Tests

```bash
# Unit tests
npm run test

# End-to-End (E2E) tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## 🛡️ License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.