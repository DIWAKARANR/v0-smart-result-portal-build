# SmartResult Portal - Comprehensive Exam Management System

A full-stack web application for managing exam results with AI-powered insights, gamification, and student engagement.

## Features

### Admin Panel
- **Student Management**: Add, edit, delete, and manage student records (Register No, Name, DOB, Class, Section)
- **Exam Management**: Create and manage exams with dynamic exam type renaming (Quarterly, Half-Yearly, Annual)
- **Result Publishing**: Publish exam results with auto color-coded grade system (A-Green, B-Blue, C-Yellow, D-Orange, F-Red)
- **Analytics Dashboard**: View performance trends, grade distribution, and student rankings
- **Rankings System**: Display student rankings with badges for achievements
- **Notifications**: Configure WhatsApp, Email, and SMS notifications for result publishing and alerts
- **Reports**: Download comprehensive analytics reports in PDF/Excel format

### Student Portal
- **Secure Login**: Authentication using Register No and Date of Birth
- **Result Viewing**: View exam results with color-coded grades and performance metrics
- **Performance Charts**: Compare performance across exams and subjects
- **Achievements**: View earned and locked badges (Top Performer, Most Improved, Consistent Achiever)
- **AI Predictions**: Get ML-powered grade forecasts for next exams
- **AI Feedback**: Receive personalized, emotion-linked feedback based on performance
- **PDF Download**: Download certificates and result documents
- **QR Verification**: Verify result authenticity using QR codes

### AI Features
- **Grade Predictions**: Machine learning model predicts future grades based on performance trends
- **Emotion-Linked Feedback**: Feedback tone adapts based on student performance (Encouraging, Neutral, Challenging)
- **Improvement Suggestions**: Personalized tips for academic improvement

### Gamification
- **Badge System**: Earn badges for achievements (Top Performer, Most Improved, Consistent Achiever)
- **Leaderboards**: Student rankings visible across school
- **Progress Tracking**: Visual indicators for improvement

### Advanced Features
- **Digital Signatures**: QR code embedded certificates
- **Notifications**: WhatsApp, Email, and SMS integration
- **Mobile Responsive**: Fully optimized for mobile and tablet devices
- **Data Security**: Secure authentication and data protection

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL (via Neon/Supabase)
- **AI**: Vercel AI SDK with OpenAI/Anthropic models
- **Authentication**: Custom JWT-based auth
- **Charts**: Recharts for data visualization

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Environment variables for Supabase/Database

### Installation

1. Clone the repository
2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
DATABASE_URL=your_database_url
\`\`\`

4. Run database migrations:
\`\`\`bash
npm run migrate
\`\`\`

5. Start development server:
\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:3000

## Demo Credentials

### Admin
- Email: admin@demo.com
- Password: demo123

### Student
- Register No: DEMO001
- DOB: 2005-01-15

## Project Structure

\`\`\`
app/
├── admin/
│   ├── login/
│   ├── register/
│   └── dashboard/
├── student/
│   ├── login/
│   └── dashboard/
├── api/
│   ├── auth/
│   ├── students/
│   ├── exams/
│   ├── results/
│   ├── ai/
│   └── notifications/
└── page.tsx

components/
├── admin/
│   ├── sidebar.tsx
│   ├── dashboard-stats.tsx
│   ├── student-management.tsx
│   ├── exam-management.tsx
│   ├── result-management.tsx
│   ├── ranking-dashboard.tsx
│   ├── qr-certificate.tsx
│   └── notification-system.tsx
└── student/
    ├── sidebar.tsx
    ├── mobile-sidebar.tsx
    ├── results-view.tsx
    ├── performance-charts.tsx
    ├── badges.tsx
    ├── ai-predictions.tsx
    └── ai-feedback.tsx

lib/
├── supabase.ts
├── auth.ts
├── types.ts
└── utils.ts

scripts/
└── 01-schema.sql
\`\`\`

## Features in Detail

### Color-Coded Grade System
- **A (Green)**: 80% and above - Excellent
- **B (Blue)**: 70-79% - Good
- **C (Yellow)**: 60-69% - Average
- **D (Orange)**: 50-59% - Below Average
- **F (Red)**: Below 50% - Fail

### Notification Triggers
- Results Published
- Poor Performance Alert (D or F grades)
- Top Performer Recognition
- Badge Earned Notifications

### Badge Types
- **Top Performer**: Achieve grade A in all subjects
- **Most Improved**: Improve by 15% or more
- **Consistent Achiever**: Maintain grade A for 3 consecutive exams

## Mobile Optimization

- Responsive sidebar (collapses to hamburger menu on mobile)
- Touch-friendly buttons and inputs
- Optimized table layouts for small screens
- Vertical stacking of components on mobile
- Fast loading times with lazy loading

## API Endpoints

### Authentication
- `POST /api/auth/admin/login`
- `POST /api/auth/admin/register`
- `POST /api/auth/student/login`

### Student Management
- `GET /api/students?adminId=...`
- `POST /api/students`
- `DELETE /api/students/[id]`

### Exams
- `GET /api/exams?adminId=...`
- `POST /api/exams`
- `POST /api/exams/[id]/publish`

### Results
- `GET /api/student-results/[id]`
- `POST /api/results`

### AI Features
- `GET /api/ai/grade-predictions/[studentId]`
- `GET /api/ai/feedback/[studentId]`

### Notifications
- `POST /api/notifications`

### Verification
- `GET /api/verify/[examId]`

## Future Enhancements

- WhatsApp/Email/SMS integration with real service providers
- Advanced analytics and trends
- Parent portal for monitoring
- Offline mode for mobile app
- Multi-language support
- Advanced filtering and search
- Bulk result upload via CSV
- Custom report builder

## License

MIT License

## Support

For issues and support, please contact: support@smartresult.com
