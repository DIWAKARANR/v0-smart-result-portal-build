# SmartResult Portal - Setup & Credentials Guide

## Database Setup

1. **Run the database schema** (execute in your Neon/Supabase console):
   - Run the SQL from: `scripts/01-schema.sql`

2. **Insert Demo Data** (optional - for testing):
   - Run the SQL from: `scripts/02-seed-demo-data.sql`

---

## Important Security Notes

### Demo Credentials (For Testing ONLY)
These credentials are shown in the app for demonstration purposes only:

**Admin Demo Account:**
- Email: `admin@demo.com`
- Password: `demo123`
- School Name: `Demo School`

**Student Demo Account:**
- Register No: `DEMO001`
- DOB: `2005-01-15`
- Name: `John Doe`
- Class: `10`
- Section: `A`

### Production Credentials (KEEP PRIVATE)
Use these for your actual admin account. **DO NOT SHARE THESE:**

**Your Admin Account:**
- Email: `admin@yourschool.com` (Choose your email)
- Password: `YourSecurePassword123!` (Choose a strong password)
- School Name: `Your School Name`

---

## How to Use

### For Admin
1. Go to `/admin/register` to create your account
2. Login at `/admin/login` with your credentials
3. Add students manually in the Admin Dashboard:
   - Click "Add Student"
   - Fill: Register No, Name, DOB, Class, Section
   - The student uses Register No + DOB to login
4. Create exams, add results, and publish them
5. View analytics and student rankings

### For Students
1. Students cannot self-register (Admin creates accounts)
2. Go to `/student/login`
3. Login with: Register No (from admin) + DOB
4. View exam results with color-coded grades
5. See performance charts and AI feedback

---

## How Student Credentials Work

**Admin creates student accounts:**
- Admin adds student: Register No = `REG001`, DOB = `2005-01-15`
- Student logs in with: Register No = `REG001`, DOB = `2005-01-15`
- No passwords needed - credentials are set by admin

---

## Color-Coded Grade System

- **A (90-100)** → Green ✓
- **B (80-89)** → Blue ✓
- **C (70-79)** → Yellow ⚠️
- **D (60-69)** → Orange ⚠️
- **F (Below 60)** → Red ✗

---

## Important Files

- **Admin Login:** `/app/admin/login/page.tsx`
- **Admin Register:** `/app/admin/register/page.tsx`
- **Student Login:** `/app/student/login/page.tsx`
- **Admin Dashboard:** `/app/admin/dashboard/page.tsx`
- **Student Dashboard:** `/app/student/dashboard/page.tsx`

---

## API Endpoints

- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/admin/register` - Admin registration
- `POST /api/auth/student/login` - Student login
- `POST /api/exams` - Create exam
- `POST /api/students` - Add student
- And many more...

---

## Testing Checklist

✓ Run database migrations first
✓ Test admin registration
✓ Test admin login with demo credentials
✓ Add a student in admin dashboard
✓ Test student login with created credentials
✓ Create an exam and add results
✓ Publish results and verify color-coded grades
✓ Test AI feedback and predictions

---

## Support

For issues:
1. Check if database is properly set up
2. Verify all environment variables are set
3. Check browser console for errors
4. Check server logs for API errors
