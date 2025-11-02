# Manual Seeding Options

## Option 1: Admin API Endpoint (Easiest - Recommended)

After deploying, you can trigger seeding via API:

1. **Login as admin** in your deployed app
2. **Call the endpoint**:
   ```bash
   curl -X POST https://your-backend-url.railway.app/admin/seed \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json"
   ```

Or use Postman/Thunder Client with:
- Method: POST
- URL: `https://your-backend-url.railway.app/admin/seed`
- Headers: `Authorization: Bearer YOUR_TOKEN`

**Get your JWT token:**
- Login via frontend or API
- Copy the `accessToken` from the response

## Option 2: Railway CLI (If needed)

If you want to use Railway CLI, ensure environment variables are loaded:

```bash
# Make sure you're in backend directory
cd backend

# Link to your Railway project (if not already linked)
railway link

# Run seed with Railway environment
railway run npm run seed
```

**Note:** Railway CLI should automatically inject `DATABASE_URL` from your Railway project.

## Option 3: Auto-Seed on Startup

The app automatically seeds on startup in production if the database is empty. Check Railway logs to see if it worked.

