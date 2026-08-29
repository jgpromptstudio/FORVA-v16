# FORVA deployment workflow

Source of truth: GitHub.

1. Push this repository to GitHub.
2. Import/connect the GitHub repository in Bolt for preview only.
3. Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the preview environment. Do not commit `.env`.
4. Validate regular-user and admin routes in Bolt preview.
5. Deploy the same approved GitHub commit to Netlify.
6. Configure production environment variables in Netlify.
7. Point `forva.net` to the approved Netlify production deployment.

Admin access is authorized by the existing `platform_admins` table. The regular dashboard only shows the Admin Dashboard entry when `checkIsAdmin()` confirms the current user is a platform admin. Email text alone is not used as an authorization mechanism.
