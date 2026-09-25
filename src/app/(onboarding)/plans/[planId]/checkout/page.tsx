import { getDb } from "@/db";
import { plans } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { CheckoutForm } from "@/components/plans/checkout-form";

export default async function CheckoutPage({
  params,
  userId,
}: {
  params: Promise<{ planId: string }>;
  userId: string;
}) {
  const { planId } = await params;

  const [selectedPlan] = await getDb()
    .select()
    .from(plans)
    .where(eq(plans.id, planId))
    .limit(1);

  if (!selectedPlan) {
    notFound();
  }

  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
      <header className="border-b pb-4">
        <h1 className="text-2xl font-bold">Complete Your Enrollment</h1>
        <p className="text-zinc-400">
          Selected Plan: <strong>{selectedPlan.name}</strong> (${selectedPlan.basePrice}/{selectedPlan.billingCycle})
        </p>
      </header>

      {/* Client Component handling CPF, Phone, Address validation */}
      <CheckoutForm planId={selectedPlan.id} userId={userId} />
    </div>
  );
}