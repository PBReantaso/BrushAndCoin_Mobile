# Brush&Coin Web Application

This is the web version of the Brush&Coin creative marketplace, built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Authentication**: Login and registration with form validation
- **Dashboard**: User dashboard with statistics and recent activity
- **Responsive Design**: Mobile-first design that works on all devices
- **State Management**: Redux Toolkit for predictable state management
- **Real-time Features**: WebSocket support for messaging and notifications
- **Payment Integration**: Stripe, PayPal, GCash, and PayMaya support

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp env.example .env.local
   ```

3. Update `.env.local` with your API endpoints and keys:
   ```env
   NEXT_PUBLIC_API_URL=https://api.brushandcoin.com/api/v1
   NEXT_PUBLIC_WS_URL=wss://api.brushandcoin.com/ws
   NEXT_PUBLIC_STRIPE_KEY=your_stripe_publishable_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Dashboard pages
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── auth/          # Authentication components
│   ├── layout/        # Layout components
│   └── ui/            # Reusable UI components
├── lib/               # Utility libraries
├── services/          # API and business logic
└── store/             # Redux store and slices
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on every push

### Other Platforms

Build the application:
```bash
npm run build
```

The built application will be in the `.next` directory.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | API base URL | Yes |
| `NEXT_PUBLIC_WS_URL` | WebSocket URL | Yes |
| `NEXT_PUBLIC_STRIPE_KEY` | Stripe publishable key | No |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | PayPal client ID | No |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
