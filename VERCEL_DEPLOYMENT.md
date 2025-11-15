# Social Media Content Analyzer - Vercel Deployment Guide

## 🚀 Quick Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- MongoDB Atlas account
- Google Gemini API key

---

## 📋 Step-by-Step Deployment

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/socialmediaanalyzer.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure your project:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./`
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)

### 3. Add Environment Variables

In Vercel project settings → Environment Variables, add:

| Name | Value | Where to Get |
|------|-------|--------------|
| `MONGODB_URI` | Your MongoDB connection string | [MongoDB Atlas](https://cloud.mongodb.com/) |
| `GEMINI_API_KEY` | Your Gemini API key | [Google AI Studio](https://makersuite.google.com/app/apikey) |
| `NEXTAUTH_URL` | Your Vercel deployment URL | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Random secret key | Generate with `openssl rand -base64 32` |

### 4. Deploy

Click **"Deploy"** and wait for the build to complete.

---

## ⚙️ Environment Variables Setup

### MongoDB URI
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a cluster (free tier available)
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/socialmedia?retryWrites=true&w=majority
```

### Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key

### NextAuth Secret
Generate a secure random string:
```bash
openssl rand -base64 32
```

Or use: [generate-secret.vercel.app](https://generate-secret.vercel.app/32)

### NextAuth URL
- **Development:** `http://localhost:3000`
- **Production:** `https://your-app-name.vercel.app`

Update this after your first deployment with your actual Vercel URL.

---

## 🔧 Post-Deployment Configuration

### Update MongoDB IP Whitelist
1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (`0.0.0.0/0`)
   - Or add Vercel's IP ranges for better security

### Update NextAuth URL
After deployment:
1. Copy your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
2. Go to Vercel → Settings → Environment Variables
3. Update `NEXTAUTH_URL` to your production URL
4. Redeploy (Deployments → ... → Redeploy)

---

## 🔍 Vercel Configuration Details

### `vercel.json`
- Sets API route timeout to 60 seconds (needed for AI processing)
- Links environment variables securely

### Function Timeouts
- **Hobby Plan:** 10 seconds default, 60 seconds max
- **Pro Plan:** 60 seconds default, 300 seconds max
- Our app uses 60 seconds for AI analysis routes

---

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript has no errors: `npm run build` locally

### Environment Variables Not Working
- Verify variable names match exactly (case-sensitive)
- Redeploy after adding new variables
- Check Vercel logs for missing variable errors

### MongoDB Connection Fails
- Verify connection string is correct
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Ensure database user has proper permissions

### NextAuth Errors
- Verify `NEXTAUTH_URL` matches your deployment URL
- Ensure `NEXTAUTH_SECRET` is set
- Check that URL includes `https://` (not `http://`)

### API Timeout Errors
- Vercel Hobby plan has 10-second default limit
- Our `vercel.json` extends this to 60 seconds
- Consider upgrading to Pro for longer timeouts

---

## 📊 Monitoring

### Vercel Analytics
Enable analytics in Vercel dashboard:
- Project → Analytics
- Track page views, performance, and errors

### Logs
View real-time logs:
- Vercel Dashboard → Your Project → Logs
- Monitor API requests and errors

---

## 🔄 Continuous Deployment

Once set up, every push to your main branch automatically deploys:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will:
1. Detect the push
2. Build your app
3. Deploy automatically
4. Provide a unique preview URL

---

## 🎯 Production Checklist

Before going live:
- [ ] All environment variables set in Vercel
- [ ] `NEXTAUTH_URL` updated to production URL
- [ ] MongoDB IP whitelist configured
- [ ] Test authentication flow
- [ ] Test file upload and analysis
- [ ] Check all API routes work
- [ ] Enable Vercel Analytics
- [ ] Set up custom domain (optional)

---

## 🌐 Custom Domain (Optional)

1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` to custom domain
5. Redeploy

---

## 💡 Performance Tips

- **Image Optimization:** Already configured in `next.config.ts`
- **Compression:** Enabled by default
- **Caching:** Vercel's CDN handles this automatically
- **API Routes:** Optimized with 60-second timeout

---

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [NextAuth.js Deployment](https://next-auth.js.org/deployment)

---

## 🆘 Need Help?

- Vercel Support: [vercel.com/support](https://vercel.com/support)
- Vercel Community: [github.com/vercel/next.js/discussions](https://github.com/vercel/next.js/discussions)
- Next.js Discord: [nextjs.org/discord](https://nextjs.org/discord)

---

**Your app is now production-ready! 🎉**
