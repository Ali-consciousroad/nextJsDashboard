# Next.js Dashboard Application

A modern dashboard application built with Next.js 14, featuring authentication, data visualization, and PostgreSQL integration.

## Features

- 🔐 **Authentication**: Secure login system with bcryptjs password hashing
- 📊 **Dashboard**: Interactive dashboard with revenue, invoices, and customer data
- 💰 **Invoices Management**: Create, edit, and delete invoices
- 👥 **Customer Management**: View and manage customer information
- 🎨 **Modern UI**: Built with Tailwind CSS and Heroicons
- 🛡️ **Security**: Parameterized queries to prevent SQL injection
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

- Node.js 18.17.0 or later
- PostgreSQL 14 or later (for local development)
- pnpm package manager
- Vercel account (for deployment)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nextjs-dashboard
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up the database**
   - Install PostgreSQL 14
   - Create a database named `nextjs_dashboard`
   - Create a user named `mcfly` with appropriate permissions
   - Update the `.env` file with your database credentials:
     ```
     POSTGRES_URL="postgres://mcfly@localhost:5432/nextjs_dashboard"
     POSTGRES_PASSWORD="your_password"
     ```

4. **Seed the database**
   ```bash
   pnpm seed
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Visit `http://localhost:3000`

## Test Credentials

- Email: user@nextmail.com
- Password: 123456

## Project Structure

```
nextjs-dashboard/
├── app/                    # Next.js app directory
│   ├── lib/               # Utility functions and database connection
│   ├── ui/                # Reusable UI components
│   └── dashboard/         # Dashboard pages and components
├── scripts/               # Database seeding scripts
└── public/                # Static assets
```

## Database Schema

The application uses the following tables:
- `users`: Stores user authentication data
- `customers`: Stores customer information
- `invoices`: Stores invoice data
- `revenue`: Stores monthly revenue data

## Security Features

- Password hashing with bcryptjs
- Parameterized SQL queries to prevent injection
- Environment variable protection
- Next.js middleware for route protection

## Deployment

### Local Development
The application uses `pg` (node-postgres) for local development.

### Vercel Deployment
1. **Set up Vercel Postgres**
   - Go to your Vercel dashboard
   - Navigate to Storage
   - Create a new Postgres database
   - Copy the connection details

2. **Configure Environment Variables**
   In your Vercel project settings, add these environment variables:
   ```
   POSTGRES_URL=your_vercel_postgres_connection_string
   POSTGRES_USER=your_vercel_postgres_user
   POSTGRES_PASSWORD=your_vercel_postgres_password
   POSTGRES_DATABASE=your_vercel_postgres_database
   ```

3. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Configure the build settings:
     - Framework Preset: Next.js
     - Build Command: `pnpm build`
     - Install Command: `pnpm install`
   - Deploy!

4. **Seed the Production Database**
   After deployment, you'll need to seed your Vercel Postgres database:
   ```bash
   # Update the connection string in your .env file
   POSTGRES_URL=your_vercel_postgres_connection_string
   
   # Run the seed script
   pnpm seed
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [PostgreSQL](https://www.postgresql.org/) - The database
- [Tailwind CSS](https://tailwindcss.com/) - The CSS framework
- [Heroicons](https://heroicons.com/) - The icon set