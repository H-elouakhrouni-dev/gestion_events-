# HuggingFace Spaces Deployment Checklist

Use this checklist to ensure your application is ready for deployment.

## Pre-Deployment Checklist

- [ ] All code is committed: `git status` shows clean working directory
- [ ] No sensitive information in `.env` files
- [ ] `.gitignore` properly configured
- [ ] No large files (>100MB) are tracked in git
- [ ] Dependencies are properly listed:
  - [ ] `backend/composer.json` has all PHP dependencies
  - [ ] `frontend/package.json` has all Node dependencies
  - [ ] No `node_modules/` or `vendor/` in commits

## Configuration Checklist

- [ ] Laravel APP_KEY is set (generate: `php artisan key:generate`)
- [ ] CORS is properly configured in `backend/config/cors.php`
- [ ] API routes are in `backend/routes/api.php`
- [ ] Frontend build outputs to `frontend/dist/`
- [ ] `.env.example` has all required variables

## Docker & Build Checklist

- [ ] Dockerfile exists in project root
- [ ] `.dockerignore` is configured
- [ ] `docker-compose.yml` is set up (optional, for local testing)
- [ ] Docker build works locally:
  ```bash
  docker build -t gestion_events:test .
  ```
- [ ] Application starts without errors

## Frontend Checklist

- [ ] React app builds successfully:
  ```bash
  cd frontend && npm run build
  ```
- [ ] No build warnings or errors
- [ ] Frontend can communicate with API at `/api/*`
- [ ] Environment variables are correctly set in `api.js`

## Backend Checklist

- [ ] All database migrations are ready
- [ ] Seeders work correctly (optional)
- [ ] API endpoints respond correctly to requests
- [ ] CORS headers are properly configured
- [ ] Auth (Sanctum) is properly configured

## HuggingFace Account Checklist

- [ ] HuggingFace account is active
- [ ] Space is created (if not, create one first)
- [ ] Git access token is configured (if needed)
- [ ] Repo secrets are set for any sensitive variables

## Deployment Steps

1. **Prepare repository**:
   ```bash
   cd c:\Users\LENOVO\gestion_evenements
   git add .
   git commit -m "Prepare for HuggingFace Spaces deployment"
   ```

2. **Add HuggingFace Space remote** (if not already added):
   ```bash
   git remote add huggingface https://huggingface.co/spaces/YOUR_USERNAME/gestion_events
   ```

3. **Push to HuggingFace**:
   ```bash
   git push -u huggingface main
   ```

4. **Monitor build** in HuggingFace Space Settings → Logs

5. **Test application**:
   - Visit your Space URL: `https://huggingface.co/spaces/YOUR_USERNAME/gestion_events`
   - Test login functionality
   - Test API endpoints
   - Check browser console for errors

## Post-Deployment

- [ ] Application loads without errors
- [ ] Frontend displays correctly
- [ ] API endpoints respond
- [ ] Database migrations ran successfully (check logs)
- [ ] Share Space URL with team

## Troubleshooting

If deployment fails:

1. **Check logs**: Go to Space Settings → Logs
2. **Common issues**:
   - Missing dependencies → Update `composer.json` or `package.json`
   - Build fails → Check Dockerfile syntax
   - App crashes on start → Check `.env` configuration
   - Database errors → Ensure SQLite path is writable

3. **Restart Space**:
   - Go to Settings → Restart

## Environment Variables to Set (Optional)

In HuggingFace Space Settings → Repository secrets, add:

```
APP_KEY = [Generate with php artisan key:generate]
APP_DEBUG = false
MAIL_FROM_ADDRESS = your-email@example.com
```

## Resources

- 📖 [Full Deployment Guide](DEPLOYMENT_HUGGINGFACE.md)
- 🐳 [Docker Documentation](https://docs.docker.com)
- 🤗 [HuggingFace Spaces Docs](https://huggingface.co/docs/hub/spaces)
