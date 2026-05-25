# Zero Cost Deployment Guide for Gig Platform

This document provides step-by-step instructions to deploy your Gig Platform application for free using Vercel and Supabase.

## Prerequisites

1. GitHub account
2. Supabase account (free tier)
3. Vercel account (free tier)

## Step 1: Push Code to GitHub

```bash
cd gig-platform
git init
git add .
git commit -m "Initial commit: Gig Platform MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/gig-platform.git
git push -u origin main
```

## Step 2: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be created (this may take a few minutes)
3. In your Supabase project dashboard:
   - Go to Settings > API
   - Copy the `Project URL` and `anon public` key
   - Copy the `service_role` key (keep this secret!)

4. Run the database migrations:
   - Go to SQL Editor in Supabase
   - Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
   - Click "Run" to execute the SQL

## Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your `gig-platform` repository
4. In the Environment Variables section, add:

   ```
   NEXT_PUBLIC_SUPABASE_URL = your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY = your-supabase-service-role-key
   NEXT_PUBLIC_APP_URL = your-vercel-deployment-url
   ```

5. Click "Deploy"

Vercel will automatically detect and configure:
- Next.js framework
- TypeScript
- Tailwind CSS

## Step 4: Configure Supabase Auth (Optional)

If you want to enable OAuth providers (Google, GitHub):

1. Go to Supabase Dashboard > Authentication > Providers
2. Enable your preferred providers
3. Add the OAuth callback URL to your provider settings

## Step 5: Update Environment Variables

After deployment, update your Vercel environment variables with the actual deployment URL:

```
NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
WECHAT_PAY_NOTIFY_URL = https://your-app.vercel.app/api/payment/callback
```

## Cost Summary

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Hobby | $0 |
| Supabase | Free Tier | $0 |
| Domain | .vercel.app subdomain | $0 |
| **Total** | | **$0/month** |

## Free Tier Limits

### Supabase Free Tier
- 500MB Database
- 1GB Storage
- 5GB Bandwidth/month
- 100k MAU
- 3 Projects

### Vercel Hobby
- 100GB Bandwidth/month
- Unlimited Projects
- Serverless Functions
- Edge Network

## Troubleshooting

### Build Failures
- Ensure all environment variables are set
- Check the deployment logs for specific errors
- Verify your Supabase project is active

### Database Connection Issues
- Double-check your Supabase URL and keys
- Ensure RLS policies are correctly configured
- Test your database connection in Supabase SQL Editor

### Authentication Issues
- Verify the OAuth callback URL is correct
- Check Supabase Auth settings
- Ensure email confirmation is disabled for testing (optional)

## Production Considerations

For a production deployment, consider:

1. **Custom Domain**: Add your own domain via Vercel
2. **WeChat Pay Integration**: Complete the WeChat Pay API integration
3. **Email Notifications**: Set up Supabase email templates
4. **Monitoring**: Add error tracking (e.g., Sentry)
5. **Analytics**: Configure Vercel Analytics

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

## Support

For issues or questions:
1. Check the project documentation
2. Review Supabase/Vercel status pages
3. Open an issue on GitHub

Happy deploying! 🚀
