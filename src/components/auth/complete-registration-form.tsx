'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { completeRegistrationAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import type { RegistrationRole } from '@/schemas/registration';
import { formatCPF, formatPhone, isValidCPF, isValidPhone } from '@/schemas/student';

type CompleteRegistrationFormProps = {
  name: string;
  email: string;
  initialRole: RegistrationRole;
};

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;

  return <p className="mt-1 text-xs text-destructive">{messages[0]}</p>;
}

export function CompleteRegistrationForm({
  name,
  email,
  initialRole,
}: CompleteRegistrationFormProps) {
  const router = useRouter();
  const [role, setRole] = useState<RegistrationRole>(initialRole);
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [cref, setCref] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({});

  function clearFieldError(field: string) {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);
    setFieldErrors({});

    const formData = new FormData();
    formData.set('role', role);
    if (role === 'student') {
      formData.set('cpf', cpf);
      formData.set('phone', phone);
    } else {
      formData.set('cref', cref);
      formData.set('specialty', specialty);
    }

    try {
      const result = await completeRegistrationAction(formData);

      if (!result.success) {
        const errors = result.errors ?? {};
        setFieldErrors(errors);

        const hasFieldErrors = Object.values(errors).some((messages) => messages?.length);
        if (!hasFieldErrors) {
          setError(result.error || 'We could not complete your registration.');
        }
        return;
      }

      router.replace(result.role === 'student' ? '/plans' : '/');
      router.refresh();
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Complete your registration</h2>
        <p className="text-xs text-muted-foreground mt-1">
          We need a few more details to finish setting up your account.
        </p>
      </div>

      <div className="rounded-md border border-border bg-muted/50 p-3 text-xs text-foreground">
        <p className="font-medium">{name}</p>
        <p className="text-muted-foreground">{email}</p>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset>
          <legend className="mb-2 block text-xs font-medium text-foreground">
            I am registering as
          </legend>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setRole('student');
                setError(null);
                setFieldErrors({});
              }}
              className={`rounded-md border px-3 py-2 text-sm text-left transition-colors ${
                role === 'student'
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border text-muted-foreground hover:border-ring/60 hover:bg-muted/50'
              }`}
            >
              <span className="block font-medium">Student</span>
              <span className="block text-xs text-muted-foreground">Train with a plan</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('professional');
                setError(null);
                setFieldErrors({});
              }}
              className={`rounded-md border px-3 py-2 text-sm text-left transition-colors ${
                role === 'professional'
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border text-muted-foreground hover:border-ring/60 hover:bg-muted/50'
              }`}
            >
              <span className="block font-medium">Professional</span>
              <span className="block text-xs text-muted-foreground">Coach students</span>
            </button>
          </div>
        </fieldset>

        {role === 'student' ? (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">
                CPF
              </label>
              <input
                type="text"
                required
                maxLength={14}
                value={cpf}
                onChange={(event) => {
                  setCpf(formatCPF(event.target.value));
                  clearFieldError('cpf');
                }}
                placeholder="000.000.000-00"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
              {cpf.replace(/\D/g, '').length === 11 && (
                <p className={`mt-1 text-xs ${isValidCPF(cpf) ? 'text-success' : 'text-destructive'}`}>
                  {isValidCPF(cpf) ? '✓ Valid CPF' : '✕ Invalid CPF'}
                </p>
              )}
              <FieldError messages={fieldErrors.cpf} />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">
                Phone Number <span className="text-muted-foreground">(optional)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(event) => {
                  setPhone(formatPhone(event.target.value));
                  clearFieldError('phone');
                }}
                placeholder="(11) 99999-9999"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
              {phone.replace(/\D/g, '').length === 11 && (
                <p className={`mt-1 text-xs ${isValidPhone(phone) ? 'text-success' : 'text-destructive'}`}>
                  {isValidPhone(phone) ? '✓ Valid phone number' : '✕ Invalid phone number'}
                </p>
              )}
              <FieldError messages={fieldErrors.phone} />
            </div>

            <p className="text-xs text-muted-foreground">
              After this step you can choose a membership plan.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">
                CREF
              </label>
              <input
                type="text"
                required
                maxLength={20}
                value={cref}
                onChange={(event) => {
                  setCref(event.target.value);
                  clearFieldError('cref');
                }}
                placeholder="000000000/G-SP"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
              <FieldError messages={fieldErrors.cref} />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">
                Specialty
              </label>
              <textarea
                required
                maxLength={200}
                value={specialty}
                onChange={(event) => {
                  setSpecialty(event.target.value);
                  clearFieldError('specialty');
                }}
                placeholder="Strength training, rehabilitation, ..."
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
              <FieldError messages={fieldErrors.specialty} />
            </div>

            <p className="text-xs text-muted-foreground">
              Professional accounts must be approved by an administrator before
              you can register workouts for students.
            </p>
          </div>
        )}

        <FieldError messages={fieldErrors.role} />

        <Button
          type="submit"
          size="lg"
          className="mt-2 w-full"
          disabled={loading}
        >
          {loading ? 'Finishing registration...' : 'Finish Registration'}
        </Button>
      </form>

      <div className="border-t border-border pt-2 text-center text-xs text-muted-foreground">
        Wrong account?{' '}
        <Link href="/sign-out" className="text-primary hover:underline">
          Sign out
        </Link>
      </div>
    </div>
  );
}
