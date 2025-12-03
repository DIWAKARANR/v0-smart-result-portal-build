# SmartResult Portal - Setup Instructions

## Important: First Steps

1. **Create the database tables** by executing `scripts/01-schema.sql` in your Supabase SQL editor
2. **Add demo data** by executing `scripts/02-seed-demo-data.sql` in your Supabase SQL editor

## Demo Credentials (For Testing)

**These credentials are for demonstration purposes only:**

### Admin Demo Login
- **URL:** `/admin/login`
- **Email:** `admin@demo.com`
- **Password:** `demo123`

### Student Demo Login
- **URL:** `/student/login`
- **Register No:** `DEMO001`
- **DOB:** `2005-01-15` (Date of Birth)

---

## Real Admin Credentials (Keep Private)

After registration, you will have real credentials. Use these to create your actual admin account:

\`\`\`
Email: admin@smartresult.com
Password: [Create your own strong password]
School Name: [Your School Name]
\`\`\`

**Store these credentials securely - you will need them to manage the portal.**

---

## Important Security Notes

- Never share admin credentials
- Admin can create, edit, and delete student records
- Admin can modify marks and exam results
- Students cannot register themselves - admin creates their accounts
- Students login with: Register No + Date of Birth (no password needed)

---

## How to Add Students (Admin Only)

1. Login to admin dashboard with admin credentials
2. Go to "Student Management"
3. Click "Add Student"
4. Fill in: Register No, Name, DOB, Class, Section
5. Student can then login using Register No + DOB from the student portal
