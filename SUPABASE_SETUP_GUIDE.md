# 🗄️ Supabase Setup Guide for Admin Panel

## Prerequisites

Before using the Admin Panel, ensure your Supabase project has:
1. ✅ Tables created (from `setup.sql`)
2. ✅ Storage bucket configured
3. ✅ Authentication enabled
4. ✅ Row Level Security (RLS) policies active

---

## Step 1: Create Tables

Run the SQL from [src/pages/admin/setup.sql](src/pages/admin/setup.sql) in your Supabase SQL Editor.

**Tables created**:
- `profile` - Hero/About section (singleton)
- `projects` - Portfolio projects
- `skills` - Tech stack & core competencies
- `certifications` - Professional badges

---

## Step 2: Configure Storage Bucket

### Create Portfolio Bucket

1. Go to **Supabase Dashboard** → **Storage**
2. Click **New Bucket**
3. Name: `portfolio`
4. **Public bucket**: ✅ Yes (enable public access)
5. Click **Create**

### Set Bucket Policies

Run this SQL to allow uploads:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio');

-- Allow everyone to view
CREATE POLICY "Public can view portfolio files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'portfolio');

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio');
```

---

## Step 3: Create Admin User

### Option A: Email/Password (Recommended)

1. Go to **Authentication** → **Users**
2. Click **Add User**
3. Enter your email and password
4. Click **Create User**

### Option B: Use Existing User

If you already have a user, just use their credentials in the Login page.

---

## Step 4: Insert Initial Profile Record

The `profile` table should have exactly **one row**. Run this SQL:

```sql
INSERT INTO profile (display_name, headline, about_text, avatar_url)
VALUES (
  'Your Name',
  'Full Stack Developer | System Architect',
  'Brief bio about yourself...',
  NULL
)
ON CONFLICT (id) DO NOTHING;
```

---

## Step 5: Verify Permissions

### Check RLS Policies

Run this query to verify policies are active:

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('profile', 'projects', 'skills', 'certifications');
```

**Expected output**: Policies for `SELECT`, `INSERT`, `UPDATE`, `DELETE`

### Test Data Fetching

Open your browser console on the main site and run:

```javascript
const { data } = await supabase.from('profile').select('*').single();
console.log(data);
```

Should return profile data without errors.

---

## Step 6: Test Admin Panel

1. Navigate to `/admin/login`
2. Enter your credentials
3. Should redirect to `/admin` (Dashboard)
4. Test each section:
   - ✅ Edit profile → Save → Check main site
   - ✅ Add project → Upload image → Verify
   - ✅ Add skill → Check icon renders
   - ✅ Add certification → Upload badge

---

## Common Issues & Solutions

### Issue: "relation 'profile' does not exist"
**Cause**: Tables not created  
**Solution**: Run `setup.sql` in Supabase SQL Editor

### Issue: "new row violates row-level security policy"
**Cause**: RLS policies too restrictive  
**Solution**: Update policies to allow authenticated users:

```sql
-- Example: Allow authenticated users to update projects
CREATE POLICY "Authenticated can update projects"
ON projects FOR UPDATE
TO authenticated
USING (true);
```

### Issue: Images not uploading
**Cause**: Storage bucket not public or policies missing  
**Solution**: 
1. Make bucket public in Dashboard
2. Add storage policies (see Step 2)

### Issue: Skills icons not showing
**Cause**: Invalid Simple Icons slug  
**Solution**: 
1. Visit [simpleicons.org](https://simpleicons.org)
2. Search for your technology
3. Use the exact slug shown (e.g., "nextdotjs" not "Next.js")

### Issue: Profile not syncing to main site
**Cause**: Real-time subscriptions not working  
**Solution**: 
1. Check Supabase project has real-time enabled
2. Verify subscriptions in Index.tsx:
```typescript
const projectsChannel = supabase
  .channel('projects-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, 
    () => fetchData())
  .subscribe();
```

---

## Security Checklist

Before going to production:

- [ ] Remove default credentials from Login.tsx
- [ ] Enable email verification in Supabase Auth
- [ ] Set up password recovery
- [ ] Configure proper CORS policies
- [ ] Enable MFA for admin account
- [ ] Review RLS policies for production
- [ ] Set up monitoring/alerts for auth failures
- [ ] Configure rate limiting

---

## Environment Variables

Make sure these are set in your `.env` or Supabase client:

```typescript
// src/lib/supabase.ts
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
```

**Never commit** your service role key to Git!

---

## Database Backup

Before making changes, backup your data:

```bash
# Using Supabase CLI
supabase db dump -f backup.sql

# Or use the Dashboard:
# Settings → Database → Backups → Download
```

---

## Next Steps

1. ✅ Complete Supabase setup
2. ✅ Create admin user
3. ✅ Test all CRUD operations
4. ✅ Upload real content
5. ✅ Configure custom domain (optional)
6. ✅ Set up CI/CD pipeline
7. ✅ Monitor usage in Supabase Dashboard

---

## Support

If you encounter issues:
1. Check Supabase logs: Dashboard → Logs
2. Review browser console for errors
3. Verify network requests in DevTools
4. Check RLS policies are correct

**The setup is complete! Your admin panel is ready to manage your portfolio content. 🚀**
