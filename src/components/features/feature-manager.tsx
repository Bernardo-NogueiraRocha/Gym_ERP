'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteFeatureAction, saveFeatureAction } from '@/app/actions/features';
import type { features, plans } from '@/db/schema';

type Feature = typeof features.$inferSelect;
type Plan = typeof plans.$inferSelect;

export function FeatureManager({
    plans: planList,
    features: featureList,
    assignedPlanIdsByFeature,
}: {
    plans: Plan[];
    features: Feature[];
    assignedPlanIdsByFeature: Record<string, string[]>;
}) {
    const router = useRouter();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([]);
    const [message, setMessage] = useState('');
    const [isPending, startTransition] = useTransition();

    function resetForm() {
        setEditingId(null);
        setName('');
        setDescription('');
        setSelectedPlanIds([]);
        setMessage('');
    }

    function editFeature(feature: Feature) {
        setEditingId(feature.id);
        setName(feature.name);
        setDescription(feature.description ?? '');
        setSelectedPlanIds(assignedPlanIdsByFeature[feature.id] ?? []);
        setMessage('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function togglePlan(planId: string) {
        setSelectedPlanIds((current) => current.includes(planId)
            ? current.filter((id) => id !== planId)
            : [...current, planId]);
    }

    function submitFeature(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage('');
        startTransition(async () => {
            const result = await saveFeatureAction({ id: editingId ?? undefined, name, description, planIds: selectedPlanIds });
            if (!result.success) {
                setMessage(result.error ?? 'Unable to save feature.');
                return;
            }
            resetForm();
            setMessage(editingId ? 'Feature updated.' : 'Feature created.');
            router.refresh();
        });
    }

    function deleteFeature(id: string) {
        if (!window.confirm('Delete this feature and its plan assignments?')) return;
        startTransition(async () => {
            const result = await deleteFeatureAction(id);
            setMessage(result.success ? 'Feature deleted.' : result.error ?? 'Unable to delete feature.');
            if (editingId === id) resetForm();
            router.refresh();
        });
    }

    return (
        <main className="mx-auto max-w-5xl space-y-8 px-5 py-10 sm:px-8">
            <header>
                <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Administration</p>
                <h1 className="mt-2 text-3xl font-bold">Plan features</h1>
                <p className="mt-2 text-muted-foreground">Create and update features, then choose which plans include each one.</p>
            </header>

            <form onSubmit={submitFeature} className="space-y-5 rounded-xl border bg-card p-6">
                <h2 className="text-xl font-semibold">{editingId ? 'Edit feature' : 'Register a feature'}</h2>
                <label className="block space-y-2">
                    <span className="text-sm font-medium">Name</span>
                    <input required 
                        maxLength={150} 
                        value={name} 
                        onChange={(event) => setName(event.target.value)} 
                        className="w-full rounded-md border bg-background px-3 py-2" 
                        placeholder="e.g. Group classes" />
                </label>
                <label className="block space-y-2">
                    <span className="text-sm font-medium">
                        Description 
                        <span className="font-normal text-muted-foreground">(optional)</span>
                    </span>
                    <textarea 
                        maxLength={5000} 
                        rows={3} 
                        value={description} 
                        onChange={(event) => setDescription(event.target.value)} 
                        className="w-full rounded-md border bg-background px-3 py-2" 
                        placeholder="Describe what this feature includes" />
                </label>
                <fieldset className="space-y-3">
                    <legend className="text-sm font-medium">
                        Included in plans
                    </legend>
                    {planList.length ? <div className="grid gap-3 sm:grid-cols-2">
                        {planList.map((plan) => (
                            <label key={plan.id} className="flex cursor-pointer items-center gap-3 rounded-md border p-3">
                                <input 
                                    type="checkbox" 
                                    checked={selectedPlanIds.includes(plan.id)} 
                                    onChange={() => togglePlan(plan.id)} 
                                    className="size-4 accent-primary" />
                                <span>{plan.name}</span>
                            </label>
                        ))}
                    </div> : <p className="text-sm text-muted-foreground">Create a plan before assigning features.</p>}
                </fieldset>
                {message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}
                <div className="flex flex-wrap gap-3">
                    <button 
                        disabled={isPending} 
                        className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground disabled:opacity-50" 
                        type="submit">
                            {isPending ? 'Saving…' : editingId ? 'Save changes' : 'Create feature'}    
                        </button>
                    {editingId && <button type="button" onClick={resetForm} className="rounded-md border px-4 py-2">Cancel edit</button>}
                </div>
            </form>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">
                    Registered features 
                    <span className="text-base font-normal text-muted-foreground">({featureList.length})</span>
                </h2>
                {featureList.length === 0 ? <p className="rounded-xl border p-6 text-muted-foreground">No features registered yet.</p> : featureList.map((feature) => {
                    const includedPlans = planList.filter((plan) => (assignedPlanIdsByFeature[feature.id] ?? []).includes(plan.id));
                    return <article 
                        key={feature.id} 
                        className="flex flex-col gap-4 rounded-xl border bg-card p-5 sm:flex-row sm:items-start sm:justify-between">
                        
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">{feature.name}</h3>
                            {feature.description && <p className="text-sm text-muted-foreground">{feature.description}</p>}
                            <p className="text-sm">
                                <span className="font-medium">
                                    Plans: 
                                </span>
                                {includedPlans.length ? includedPlans.map((plan) => plan.name).join(', ') : 'Not included in any plan'}</p>
                        </div>
                        
                        <div className="flex shrink-0 gap-2">
                            <button 
                                type="button" 
                                onClick={() => editFeature(feature)} 
                                className="rounded-md border px-3 py-2 text-sm">
                                    Edit
                            </button>
                            
                            <button 
                                type="button"
                                disabled={isPending} 
                                onClick={() => deleteFeature(feature.id)} 
                                className="rounded-md border border-destructive/40 px-3 py-2 text-sm text-destructive disabled:opacity-50">
                                    Delete
                            </button>
                        </div>
                    </article>;
                })}
            </section>
        </main>
    );
}
