import { and, desc, eq } from 'drizzle-orm';
import type { Metadata } from 'next';

import { ApproveProfessionalButton } from '@/components/professionals/approve-professional-button';
import { AccessDenied } from '@/components/access-denied';
import { getDb } from '@/db';
import { professionals, user } from '@/db/schema';
import { getSession } from '@/lib/auth-server';
import { getUserData } from '@/lib/queries/user';

export const metadata: Metadata = {
  title: 'Verify Professionals | GYM_ERP',
  description: 'Verify and approve registered professionals to exercise their function.',
};

export const dynamic = 'force-dynamic';

export default async function VerifyProfessionalsPage() {
  const session = await getSession().catch(() => null);

  if (!session) {
    return (
      <AccessDenied message="You are not logged in, please login as admin to access." />
    );
  }

  const userData = await getUserData(session.user.id);

  if (!userData) {
    return <AccessDenied message="User not found" />;
  }

  if (userData.role !== 'admin') {
    return (
      <AccessDenied message="You are not an admin, so you don't have access to this page." />
    );
  }

  const pendingProfessionals = await getDb()
    .select({
      id: professionals.id,
      name: user.name,
      email: user.email,
      cref: professionals.cref,
      specialty: professionals.specialty,
      requestedAt: user.createdAt,
    })
    .from(professionals)
    .innerJoin(user, eq(user.id, professionals.userId))
    .where(and(eq(professionals.approved, false), eq(user.role, 'professional')))
    .orderBy(desc(user.createdAt));

  return (
    <div className="mx-auto mt-6 max-w-4xl space-y-6 px-4 pb-10">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Verify Professionals</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review professional registrations before granting access to student workouts.
        </p>
      </header>

      {pendingProfessionals.length === 0 ? (
        <div className="rounded-xl border border-border bg-muted/40 p-6 text-sm text-muted-foreground">
          There are no professional registrations waiting for approval.
        </div>
      ) : (
        <ul className="space-y-3">
          {pendingProfessionals.map((professional) => (
            <li
              key={professional.id}
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <p className="font-semibold text-foreground">{professional.name}</p>
                <p className="text-sm text-muted-foreground">{professional.email}</p>
                <p className="text-sm text-foreground">
                  CREF: {professional.cref || 'Not provided'}
                </p>
                <p className="text-sm text-foreground">
                  Specialty: {professional.specialty || 'Not provided'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Requested {professional.requestedAt.toLocaleDateString()}
                </p>
              </div>
              <ApproveProfessionalButton professionalId={professional.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
