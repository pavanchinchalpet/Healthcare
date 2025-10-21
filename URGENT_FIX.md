# 🚨 URGENT: Fix Production Issues

## **Problem Analysis:**
1. **CORS Error**: Backend not allowing Vercel frontend requests
2. **Manifest 404**: manifest.json not found on Vercel

## **🔧 IMMEDIATE FIXES NEEDED:**

### **1. Update Render Backend Environment Variables**

Go to your Render dashboard → Environment Variables and add/update:

```
FRONTEND_URL=https://healthcare-eight-bay.vercel.app
CORS_ORIGIN=https://healthcare-eight-bay.vercel.app
```

### **2. Redeploy Backend**

After updating environment variables:
1. Go to Render dashboard
2. Click "Manual Deploy" → "Deploy latest commit"
3. Wait for deployment to complete

### **3. Redeploy Frontend**

After backend is updated:
1. Go to Vercel dashboard
2. Click "Redeploy" on your project
3. Wait for deployment to complete

## **🔍 Verification Steps:**

### **Test Backend CORS:**
```bash
curl -X POST https://healthcare-backend-gap2.onrender.com/graphql \
  -H "Content-Type: application/json" \
  -H "Origin: https://healthcare-eight-bay.vercel.app" \
  -d '{"query": "query { getPatients { id name } }"}'
```

### **Test Frontend:**
1. Visit: https://healthcare-eight-bay.vercel.app
2. Open browser console
3. Check for CORS errors
4. Verify data loads

## **📋 Expected Results:**

✅ **Backend logs should show:**
```
🌐 CORS Allowed Origins: ['http://localhost:3000', 'https://healthcare-eight-bay.vercel.app']
✅ CORS: Allowing origin: https://healthcare-eight-bay.vercel.app
```

✅ **Frontend should show:**
- No CORS errors in console
- Data loads successfully
- Dashboard shows patient/doctor counts

## **🚨 If Still Not Working:**

### **Check Render Logs:**
1. Go to Render dashboard
2. Click on your service
3. Go to "Logs" tab
4. Look for CORS messages

### **Check Vercel Logs:**
1. Go to Vercel dashboard
2. Click on your project
3. Go to "Functions" tab
4. Check for build errors

## **📞 Quick Debug Commands:**

```bash
# Test if backend is running
curl https://healthcare-backend-gap2.onrender.com/graphql

# Test CORS headers
curl -I -X OPTIONS https://healthcare-backend-gap2.onrender.com/graphql \
  -H "Origin: https://healthcare-eight-bay.vercel.app"

# Test manifest file
curl https://healthcare-eight-bay.vercel.app/manifest.json
```
