# 📚 Bookmart Monorepo

Complete multi-platform book marketplace solution featuring:
- **`bookmart-backend/`**: Django REST Framework (DRF), PostgreSQL, SimpleJWT, Cloudinary/S3, CORS-enabled REST API.
- **`bookmart-web/`**: Next.js 16 (App Router), React 19, Tailwind CSS v4 standalone web frontend.
- **`bookmart-app/`**: Expo 54 / React Native mobile application for iOS and Android.

---

## 🏗️ Architecture & Orchestration Overview

```
                        ┌───────────────────────────────┐
                        │      Host Machine (LAN)       │
                        │        192.168.1.102          │
                        └──────────────┬────────────────┘
                                       │
                ┌──────────────────────┴──────────────────────┐
                │ Docker Network: bookmart_network            │
                │                                             │
                │  ┌───────────────┐        ┌──────────────┐  │
                │  │   postgres    │ ◄────  │   backend    │  │
                │  │  (Port 5432)  │        │ (Port 8000)  │  │
                │  └───────────────┘        └──────┬───────┘  │
                │                                  │          │
                │                           ┌──────┴───────┐  │
                │                           │     web      │  │
                │                           │ (Port 3000)  │  │
                │                           └──────────────┘  │
                └─────────────────────────────────────────────┘
                                       ▲
                  ┌────────────────────┴────────────────────┐
                  │                                         │
        ┌─────────┴─────────┐                     ┌─────────┴─────────┐
        │   Host Browser    │                     │  Physical Phone   │
        │ localhost:3000 or │                     │     (Expo Go)     │
        │ 192.168.1.102:3000│                     │ 192.168.1.102:8000│
        └───────────────────┘                     └───────────────────┘
```

The database (`postgres`), backend (`backend`), and web frontend (`web`) run together in Docker with persistent volumes for database data, media uploads, and static assets. The mobile app (`bookmart-app`) runs on your host machine via Expo and communicates with the backend container over your local network (LAN IP).

---

## 🚀 Quick Start (Single Command)

### 1. Configure Local Network IP
Copy `.env.example` to `.env` if not already created:
```bash
cp .env.example .env
```
Ensure `HOST_IP` in `.env` matches your machine's current LAN IP (e.g. `192.168.1.102`).

### 2. Start Backend, Database, and Web Frontend
From the root `Bookmart/` directory:
```bash
docker compose up --build
```
To run in detached (background) mode:
```bash
docker compose up -d --build
```

### 3. Verify Running Services
- **Web App**: [http://localhost:3000](http://localhost:3000) or [http://192.168.1.102:3000](http://192.168.1.102:3000)
- **Backend API Root**: [http://localhost:8000/api/v1/](http://localhost:8000/api/v1/)
- **API Swagger Documentation**: [http://localhost:8000/api/schema/swagger-ui/](http://localhost:8000/api/schema/swagger-ui/)

---

## 🛠️ Common Backend & Database Commands

All backend management commands can be executed directly inside the running container:

### Create Django Superuser (Admin)
```bash
docker compose exec backend python manage.py createsuperuser
```
Admin dashboard available at: [http://localhost:8000/admin/](http://localhost:8000/admin/)

### Run Database Migrations
Migrations run automatically on container startup (`entrypoint.sh`), but you can trigger them manually:
```bash
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate
```

### Open Django Shell
```bash
docker compose exec backend python manage.py shell
```

### View Live Logs
```bash
# All containers
docker compose logs -f

# Backend container only
docker compose logs -f backend

# Web container only
docker compose logs -f web
```

### Stop Containers
```bash
docker compose down
```
*(To remove database and media volumes as well, run `docker compose down -v`)*

---

## 📱 Mobile App Setup (Expo Go on Physical Phone)

The mobile app runs directly on your machine and connects to the Dockerized backend over your Wi-Fi network.

### 1. Why `localhost` will NOT work on your phone
When your phone makes a network request to `http://localhost:8000`, it refers to **the phone itself** (loopback interface), not your computer. Your phone and computer must be connected to the **same Wi-Fi network**, and the mobile app must point to your computer's LAN IP (e.g. `http://192.168.1.102:8000/api/v1`).

### 2. Configure Mobile `.env`
In `bookmart-app/.env`:
```env
API_URL=http://192.168.1.102:8000/api/v1
```

### 3. Start Expo Bundler
```bash
cd bookmart-app
npx expo start
```

### 4. Open in Expo Go
- **Android**: Scan the QR code using the **Expo Go** app.
- **iOS**: Scan the QR code using the native **Camera** app and tap the Expo prompt.

---

## 🔄 Switching Wi-Fi Networks (Updating LAN IP)

If you switch Wi-Fi networks (e.g., home router, office, coffee shop), your computer will be assigned a new LAN IP:

1. **Find your new LAN IP**:
   - **Windows**: Run `ipconfig` in Command Prompt / PowerShell (look for *IPv4 Address* under your active Wi-Fi adapter).
   - **macOS**: Run `ipconfig getifaddr en0` or check Network Settings.
   - **Linux**: Run `hostname -I` or `ip addr show`.

2. **Update in two places**:
   - In root `.env`: Update `HOST_IP=192.168.x.x`
   - In `bookmart-app/.env`: Update `API_URL=http://192.168.x.x:8000/api/v1`

3. **Restart Docker**:
   ```bash
   docker compose up --build -d
   ```

---

## 🔍 Troubleshooting

- **CORS Errors in Browser**:
  The backend includes `django-cors-headers` and is configured with regex to allow all standard local LAN ranges (`192.168.x.x`, `10.x.x.x`, `172.16-31.x.x`). You can also specify exact origins in `.env` under `CORS_ALLOWED_ORIGINS`.

- **Phone Cannot Reach Backend**:
  1. Ensure both your computer and phone are connected to the exact same Wi-Fi network (check that client isolation is not enabled on your router).
  2. Ensure Windows Defender Firewall allows incoming connections on port 8000. To test, open `http://192.168.1.102:8000/api/schema/swagger-ui/` in your phone's mobile browser.
  3. Clear Metro bundler cache if env changes are not picking up: `npx expo start -c`.

- **Standalone Backend Mode**:
  If you ever need to run only the backend and database without the web frontend, use:
  ```bash
  docker compose -f bookmart-backend/docker-compose.standalone.yml up --build
  ```
