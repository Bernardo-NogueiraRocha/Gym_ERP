import { getMembershipUser } from '@/lib/queries/memberships';
import { getPlanById } from '@/lib/queries/plans';
import { getPaymentsByUserId } from '@/lib/queries/payments';

function formatDate(dateInput: string | Date | null | undefined): string {
    if (!dateInput) return '—';

    const date = typeof dateInput === 'string' 
        ? new Date(dateInput.includes('T') ? dateInput : `${dateInput}T00:00:00`) 
        : new Date(dateInput);

    if (isNaN(date.getTime())) return '—';

    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(date);
}

function getStatusColor(status: string) {
    switch (status) {
        case 'completed':
            return 'text-green-600';
        case 'pending':
        case 'overdue':
            return 'text-red-600';
        default:
            return 'text-slate-400';
    }
}

export async function MembershipInfo({ userId }: { userId: string }) {
    const [membership, payments] = await Promise.all([
        getMembershipUser(userId),
        getPaymentsByUserId(userId),
    ]);

    if (!membership) {
        return (
            <section className="mx-10 mt-5 rounded-xl border border-slate-800 bg-background p-6 text-slate-300">
                <h2 className="text-xl font-semibold text-white">Membership</h2>
                <p className="mt-2">You do not have a membership yet.</p>
            </section>
        );
    }

    const plan = await getPlanById(membership.planId);

    return (
        <section className="mx-10 mt-5 rounded-xl border border-slate-800 bg-background p-6 text-slate-300 shadow-lg">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-foreground">Membership</h2>
                    <p className="mt-1 text-lg text-foreground">{plan?.name ?? 'Plan unavailable'}</p>
                    {plan && (
                        <p className="text-sm text-muted-foreground">
                            {plan.billingCycle} · {plan.basePrice} per billing cycle
                        </p>
                    )}
                </div>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-sm capitalize text-slate-200">
                    {membership.status}
                </span>
            </div>

            <dl className="mt-5 grid gap-4 border-t border-slate-800 pt-4 sm:grid-cols-2">
                <div>
                    <dt className="text-sm text-muted-foreground">Start date</dt>
                    <dd className="mt-1 text-foreground">{formatDate(membership.startDate)}</dd>
                </div>
                <div>
                    <dt className="text-sm text-muted-foreground">End date</dt>
                    <dd className="mt-1 text-foreground">{formatDate(membership.endDate)}</dd>
                </div>
            </dl>

            <div className="mt-6 border-t border-slate-800 pt-4">
                <h3 className="font-semibold text-foreground">Membership payments</h3>
                {payments.length === 0 ? (
                    <p className="mt-2 text-sm text-slate-400">No payments have been recorded.</p>
                ) : (
                    <div className="mt-3 overflow-x-auto">
                        <table className="w-full min-w-120 text-left text-sm">
                            <thead className="text-muted-foreground">
                                <tr>
                                    <th className="pb-2 pr-4 font-medium">Due date</th>
                                    <th className="pb-2 pr-4 font-medium">Paid on</th>
                                    <th className="pb-2 pr-4 font-medium">Amount</th>
                                    <th className="pb-2 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((payment) => (
                                    <tr key={payment.id} className="border-t border-slate-800 text-muted-foreground">
                                        <td className="py-3 pr-4">{formatDate(payment.dueDate)}</td>
                                        <td className="py-3 pr-4">{payment.paymentDate ?? '—'}</td>
                                        <td className="py-3 pr-4">{payment.amount}</td>
                                        <td className={`py-3 capitalize ${getStatusColor(payment.status)}`}>
                                            {payment.status}
                                        </td>
                                        
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
}
