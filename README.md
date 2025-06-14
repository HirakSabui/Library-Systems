# KRR Library Management System

A modern, full-stack library management system built with Next.js, Firebase Authentication, and Supabase database.

## Features

- **Dashboard**: Overview with statistics cards, recent additions, and quick actions
- **Books Management**: Add, view, search, and filter books with cover images
- **Members Management**: View and manage library members
- **Authentication**: Secure admin login with Firebase Auth
- **Database**: PostgreSQL database with Supabase for data persistence
- **Export**: CSV export functionality for books data
- **Responsive Design**: Mobile-friendly interface with collapsible sidebar

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **UI Components**: ShadCN UI components
- **Authentication**: Firebase Auth
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel-ready deployment

## Setup Instructions

### 1. Clone and Install

\`\`\`bash
git clone <repository-url>
cd library-management-system
npm install
\`\`\`

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

\`\`\`bash
cp .env.example .env.local
\`\`\`

### 3. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication with Email/Password provider
3. Copy your Firebase config to `.env.local`
4. Create an admin user in Firebase Authentication

### 4. Supabase Setup

1. Create a new project at [Supabase](https://supabase.com)
2. Copy your project URL and anon key to `.env.local`
3. Run the SQL schema script in Supabase SQL Editor:
   - Go to SQL Editor in your Supabase dashboard
   - Copy and run the contents of `scripts/supabase-schema.sql`

### 5. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` and login with your Firebase admin credentials.

## Database Schema

### Books Table
- `id`: UUID primary key
- `title`: Book title
- `author`: Author name
- `category`: Book category
- `image_url`: Cover image URL (optional)
- `status`: 'available' or 'checked-out'
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Members Table
- `id`: UUID primary key
- `name`: Member name
- `email`: Member email (unique)
- `joined_at`: Join date

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to set all environment variables in your Vercel dashboard:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Usage

1. **Login**: Use your Firebase admin credentials
2. **Dashboard**: View library statistics and recent additions
3. **Add Books**: Use the "Add New Book" button or sidebar action
4. **Manage Books**: View, search, and filter books in the Books page
5. **View Members**: See registered members in the Members page
6. **Export Data**: Use the "Export Books" button to download CSV

## Features Overview

- ✅ Firebase Authentication
- ✅ Supabase PostgreSQL database
- ✅ Responsive dashboard design
- ✅ Book CRUD operations
- ✅ Member management
- ✅ Search and filtering
- ✅ CSV export
- ✅ Real-time data updates
- ✅ Mobile-friendly interface
- ✅ Toast notifications
- ✅ Loading states

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
