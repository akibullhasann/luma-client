# Luma Frontend

This is the frontend for **Luma**, a salon appointment booking platform I built to make booking salon services feel simple, clean, and reliable. It covers both sides of the experience — customers can browse services, book appointments, and pay online, while admins can manage services, appointments, users, and transactions from their own dashboard.

## Live Site

- **Production:** [luma-frontend-kohl.vercel.app](https://luma-frontend-kohl.vercel.app)

## What’s Inside

### For Customers
- **Home page** with a hero section, featured services, service categories, and a “Why Choose Us” section.
- **Browse Services** where you can search by name, filter by category, and sort by price.
- **Service details page** with full service info and a booking form.
- **Sign up / Sign in** with email & password or Google.
- **Profile photo upload** during sign-up (ImageBB).
- **Customer dashboard** to see overview stats, manage appointments, and update profile details.
- **Stripe payments** for appointments, with proper success and cancel handling.

### For Admins
- **Dashboard overview** with stats scoped to the logged-in admin’s own data.
- **Manage Services** — add, edit, delete, and toggle active/inactive services.
- **Manage Appointments** — review bookings and update their status.
- **Manage Users** — view customers and block/unblock patrons (with toast confirmation).
- **Transactions** — view paid transactions related to that admin’s services.
- **Profile page** to update name and phone number.

### A Few Things I Cared About
- Keeping the UI consistent and responsive across desktop, tablet, and mobile.
- Making sure the redesign didn’t break existing functionality, routes, or API integrations.
- Adding proper loading, empty, and error states so the app feels polished.

## Built With

- **[Next.js 16](https://nextjs.org/)** (App Router, Turbopack)
- **[React 19](https://react.dev/)** + **TypeScript**
- **[Tailwind CSS 4](https://tailwindcss.com/)**
- **[shadcn/ui](https://ui.shadcn.com/)** + Base UI
- **[Better Auth](https://www.better-auth.com/)** for authentication
- **[Stripe](https://stripe.com/)** for payments
- **[Sonner](https://sonner.emilkowal.ski/)** for toast notifications
- **[Lucide React](https://lucide.dev/)** for icons
- **ImageBB** for image uploads

## Project Structure

```text
Luma-frontend/
├── app/                  # App Router pages, layouts, and routes
│   ├── (auth)/           # Sign in / Sign up pages
│   ├── checkout/         # Checkout, success, and cancel pages
│   ├── dashboard/        # Admin and patron dashboard pages
│   ├── services/         # Browse services and service details
│   └── ...
├── components/           # Shared UI components
├── lib/                  # Auth, API clients, server actions, utilities
├── public/               # Static assets
└── ...
```

## Getting Started

### What You’ll Need

- Node.js 20+ 
- npm
- The Luma backend running locally (or a deployed backend URL)
- MongoDB connection for Better Auth
- Stripe, Google OAuth, and ImageBB credentials if you want those features working

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env` file in the `Luma-frontend` folder:

```env
BETTER_AUTH_SECRET=your_secret
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_DB_URI=your_mongodb_connection_string

NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_IMAGEBB_API_KEY=your_imagebb_key

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

> Keep your `.env` file private — don’t commit real secrets.

### 3. Run the app

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
npm run dev     # Start the development server
npm run build   # Create a production build
npm run start   # Run the production build
npm run lint    # Check for lint issues
```

## Deployment

The frontend is deployed on [Vercel](https://vercel.com/). If you’re deploying your own copy:

1. Push the frontend to GitHub.
2. Import the `Luma-frontend` project in Vercel.
3. Add the environment variables in Vercel project settings.
4. Deploy.

## Notes

- Admin overview and transactions are scoped to the logged-in admin, so admins only see their own data.
- Protected backend requests go through the app’s authenticated server-side flow.
- Payment confirmation is handled carefully so the same Stripe session doesn’t get processed twice.

## Author

Built by **Akibullah Hasan**.  
If you run into issues or have suggestions, feel free to open an issue or reach out.
