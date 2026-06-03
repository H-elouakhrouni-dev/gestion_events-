# HuggingFace Spaces Deployment Guide

This guide explains how to deploy the **Gestion Evenements** full-stack application to HuggingFace Spaces.

## Prerequisites

- [HuggingFace account](https://huggingface.co) with Spaces access
- [Git](https://git-scm.com) installed
- [Docker](https://www.docker.com) installed (for local testing)

## Deployment Steps

### 1. Create a HuggingFace Space

1. Go to [HuggingFace Spaces](https://huggingface.co/spaces)
2. Click **Create new Space**
3. Configure:
   - **Space name**: `gestion_events` (or your preferred name)
   - **Owner**: Select your username or organization
   - **Space type**: `Docker`
   - **Visibility**: `Public` or `Private`
4. Click **Create Space**

### 2. Push Your Code to HuggingFace Space

```bash
# Navigate to your project directory
cd c:\Users\LENOVO\gestion_evenements

# Add HuggingFace Space as remote
git remote add huggingface https://huggingface.co/spaces/YOUR_USERNAME/gestion_events

# Push to HuggingFace
git push -u huggingface main
```

Replace `YOUR_USERNAME` with your actual HuggingFace username.

### 3. File Structure for HuggingFace Spaces

Your repository should have this structure:

```
├── Dockerfile
├── .dockerignore
├── backend/
│   ├── .env.example
│   ├── composer.json
│   ├── artisan
│   ├── app/
│   ├── routes/
│   ├── database/
│   └── ... (Laravel files)
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── src/
│   └── ... (React files)
└── docker-compose.yml
```

### 4. HuggingFace Space Configuration

The `Dockerfile` in your root directory will be automatically detected and built by HuggingFace Spaces.

**Key configurations:**
- **Port**: Application runs on port `80` (HF Spaces default)
- **Database**: Uses SQLite (`/app/storage/database.sqlite`)
- **Frontend**: Built React app served alongside Laravel backend
- **Build time**: ~5-10 minutes (depends on dependencies)

### 5. Environment Variables

HuggingFace Spaces will use the defaults from `backend/.env.example`:
- Database: SQLite (no external database needed)
- Cache: File-based
- Session: File-based

To customize, add **Repo secrets** in your Space settings:
1. Go to Space **Settings** → **Repository secrets**
2. Add variables like:
   - `APP_KEY`: Laravel application key (generate locally: `php artisan key:generate`)
   - `APP_DEBUG`: Set to `false` for production
   - `MAIL_FROM_ADDRESS`: Your email

### 6. Building Locally (Optional)

To test locally before pushing to HuggingFace:

```bash
# Build Docker image
docker build -t gestion_events:latest .

# Run with docker-compose
docker-compose up --build

# Access at http://localhost:8000
```

### 7. Troubleshooting

#### Build Fails
- Check Docker syntax errors: `docker build --no-cache -t test:latest .`
- Ensure all dependencies are listed in `backend/composer.json` and `frontend/package.json`

#### App Doesn't Start
- Check logs in HuggingFace Space: Settings → **Logs**
- Verify `.env` configuration is correct

#### Frontend Not Loading
- Ensure React build completes: Check `frontend/dist/` is created
- Verify CORS settings in `backend/config/cors.php`

#### Database Errors
- SQLite database is created automatically on first run
- Run migrations after first deployment:
  ```bash
  php artisan migrate --force
  php artisan seed --force  # if needed
  ```

### 8. Accessing Your Application

Once deployed, your Space will be available at:
```
https://huggingface.co/spaces/YOUR_USERNAME/gestion_events
```

The embedded app will run directly in the browser.

## Using External Database (Optional)

If you want to use MySQL instead of SQLite:

1. Get a managed MySQL database (e.g., PlanetScale, Railway, Heroku Postgres)
2. Add repo secrets in HuggingFace Space:
   - `DB_CONNECTION`: `mysql`
   - `DB_HOST`: Your database host
   - `DB_PORT`: `3306`
   - `DB_DATABASE`: Database name
   - `DB_USERNAME`: Database user
   - `DB_PASSWORD`: Database password

3. Update `Dockerfile` if needed to handle database URL format

## Monitoring & Updates

- **View logs**: Space Settings → Logs
- **Deploy updates**: Push to `huggingface` remote, Space rebuilds automatically
- **Restart Space**: In Settings, click "Restart"

## Next Steps

1. Set up your APP_KEY (generate with `php artisan key:generate`)
2. Configure any additional environment variables needed
3. Test API endpoints to ensure they work
4. Share your Space URL with others

For more help: [HuggingFace Spaces Documentation](https://huggingface.co/docs/hub/spaces)
