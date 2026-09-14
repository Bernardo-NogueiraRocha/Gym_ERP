import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-blue-500">
            Gym ERP
          </h1>
          <p className="text-sm text-slate-400">
            Management & Subscription System
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}