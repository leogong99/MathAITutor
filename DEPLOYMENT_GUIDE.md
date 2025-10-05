# GCP Cloud Run Deployment Guide

## The 404 Error Fix

The 404 error was caused by several issues in your `clouddeploy.yaml`:

### **Problems Fixed:**

1. **Wrong Entrypoint**: Changed from `yarn start` to `npm start`
2. **Missing Port Configuration**: Added `--port=8080` to the deployment
3. **Missing Standalone Output**: Added `output: 'standalone'` to `next.config.js`
4. **Proper Docker Build**: Created `Dockerfile` for proper containerization

### **Key Changes Made:**

#### **1. Updated `clouddeploy.yaml`:**
```yaml
# Changed entrypoint from yarn to npm
_ENTRYPOINT: npm start

# Added port configuration
- '--port=8080'
```

#### **2. Updated `next.config.js`:**
```javascript
// Added standalone output for proper containerization
output: 'standalone',
```

#### **3. Created `Dockerfile`:**
- Multi-stage build for optimization
- Proper Next.js standalone configuration
- Correct port and user setup

## Deployment Process

### **Automatic Deployment (Recommended):**
Your Cloud Build trigger will automatically:
1. Build the Docker image using the `Dockerfile`
2. Push to Google Container Registry
3. Deploy to Cloud Run with proper configuration

### **Manual Deployment:**
```bash
# Build the image
docker build -t gcr.io/675937690896/mathaibuddy .

# Push to GCR
docker push gcr.io/675937690896/mathaibuddy

# Deploy to Cloud Run
gcloud run deploy mathaibuddy \
  --image gcr.io/675937690896/mathaibuddy \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 1024Mi
```

## Environment Variables

Make sure these are set in your GCP Cloud Run service:
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Your Google OAuth client ID
- `NEXT_PUBLIC_API_URL` - Your API endpoint URL
- `NODE_ENV=production`

## Testing

After deployment, test these endpoints:
- **Home Page**: `https://mathaibuddy-675937690896.us-central1.run.app/`
- **Chat Page**: `https://mathaibuddy-675937690896.us-central1.run.app/chat`

## Troubleshooting

If you still get 404 errors:
1. Check Cloud Run logs in GCP Console
2. Verify environment variables are set
3. Ensure the service is using port 8080
4. Check that the build completed successfully

The deployment should now work correctly! 🎉
