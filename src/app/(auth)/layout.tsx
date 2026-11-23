import { Metadata } from 'next/dist/lib/metadata/types/metadata-interface';
import React from 'react';

export const metadata: Metadata = {
  title: 'Sign-Up | GYM_ERP',
  description: 'Register into GYM_ERP.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">
            Gym ERP
          </h1>
          <p className="text-sm text-muted-foreground">
            Management & Subscription System
          </p>
        </div>

        {/* Card Container */}
        <div className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
}