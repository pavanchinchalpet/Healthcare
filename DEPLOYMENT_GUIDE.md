# Deployment Guide for Healthcare Management System

## 🚀 Frontend Deployment (Vercel)

### 1. Environment Variables in Vercel Dashboard

Go to your Vercel project dashboard > Settings > Environment Variables and add:

```
NEXT_PUBLIC_GRAPHQL_ENDPOINT = https://your-backend-app-name.onrender.com/graphql
```

### 2. Deployment Steps

1. **Connect Repository**: Connect your GitHub repository to Vercel
2. **Build Settings**: 
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. **Environment Variables**: Add the variable above
4. **Deploy**: Click "Deploy"

### 3. Custom Domain (Optional)

- Go to Settings > Domains
- Add your custom domain
- Update DNS records as instructed

---

## 🔧 Backend Deployment (Render)

### 1. Environment Variables in Render Dashboard

Go to your Render service dashboard > Environment and add:

```
DATABASE_URL = postgresql://neondb_owner:npg_HRgKD2USepQ6@ep-dry-dew-adxkuks1-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&options=endpoint%3Dep-dry-dew-adxkuks1-pooler

PORT = 4000

CORS_ORIGIN = https://your-frontend-app-name.vercel.app

FRONTEND_URL = https://your-frontend-app-name.vercel.app

NODE_ENV = production
```

### 2. Deployment Steps

1. **Create Web Service**:
   - Connect your GitHub repository
   - Choose "Web Service"
   - Build Command: `npm run build`
   - Start Command: `npm run start:prod`

2. **Environment Variables**: Add all variables above

3. **Deploy**: Click "Create Web Service"

### 3. Important Notes

- **Database**: Already configured with Neon PostgreSQL
- **CORS**: Configured to allow your Vercel frontend
- **Port**: Render will override PORT automatically
- **SSL**: Render provides HTTPS automatically

---

## 🔄 Update Process

### After Deployment:

1. **Get Backend URL**: Copy your Render service URL
2. **Update Frontend**: Update `NEXT_PUBLIC_GRAPHQL_ENDPOINT` in Vercel
3. **Update Backend**: Update `CORS_ORIGIN` and `FRONTEND_URL` in Render
4. **Redeploy**: Both services will automatically redeploy

### Example URLs:

- **Frontend**: `https://healthcare-eight-bay.vercel.app`
- **Backend**: `https://healthcare-backend-gap2.onrender.com`

---

## ✅ Verification

### Test Frontend:
1. Visit your Vercel URL
2. Check browser console for GraphQL errors
3. Test CRUD operations

### Test Backend:
1. Visit `https://your-backend-url.onrender.com/graphql`
2. Test GraphQL queries
3. Check CORS headers

---

## 🛠️ Troubleshooting

### Common Issues:

1. **CORS Errors**: Update `CORS_ORIGIN` in Render
2. **GraphQL Connection**: Check `NEXT_PUBLIC_GRAPHQL_ENDPOINT` in Vercel
3. **Database Connection**: Verify `DATABASE_URL` in Render
4. **Build Failures**: Check build logs in respective dashboards

### Debug Commands:

```bash
# Test backend locally
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { getPatients { id name } }"}'

# Test frontend locally
npm run dev
```
