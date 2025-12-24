import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Admin Panel',
  description: 'Sign in to your admin account',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
