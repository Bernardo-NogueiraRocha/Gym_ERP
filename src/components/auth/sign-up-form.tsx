'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import {
  registerProfessionalAction,
  registerStudentAction,
} from '@/app/actions/auth';
import { GoogleAuthButton } from '@/components/auth/google-auth-button';
import { Button } from '@/components/ui/button';
import { FieldError } from '@/components/ui/field-error';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { RegistrationRole } from '@/schemas/registration';
import { formatCPF, formatPhone, isValidCPF, isValidPhone } from '@/schemas/student';

type SignUpFormProps = {
  googleEnabled: boolean;
  initialError?: string | null;
};

export function SignUpForm({ googleEnabled, initialError = null }: SignUpFormProps) {
  const router = useRouter();
  const [role, setRole] = useState<RegistrationRole>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cpf: '',
    phone: '',
    cref: '',
    specialty: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "cpf"
          ? formatCPF(value)
          : name === "phone"
            ? formatPhone(value)
            : value,
    }));

    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleRoleChange(nextRole: RegistrationRole) {
    setRole(nextRole);
    setError(null);
    setFieldErrors({});
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const formData = new FormData(e.currentTarget);
      const result = role === 'student'
        ? await registerStudentAction(formData)
        : await registerProfessionalAction(formData);

      if (!result.success) {
        const errors = result.errors ?? {};
        setFieldErrors(errors);

        const hasFieldErrors = Object.values(errors).some((messages) => messages?.length);
        if (!hasFieldErrors) {
          setError(result.error || 'Failed to complete registration.');
        }
      } else {
        // Same destinations as completing a registration: students go pick a
        // plan, professionals land on their dashboard while awaiting approval.
        router.push(role === 'student' ? '/plans' : '/');
        router.refresh();
      }
    } catch {
      // Never surface driver/config error messages to the browser.
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  function describedBy(field: string) {
    return fieldErrors[field]?.length ? `signup-${field}-error` : undefined;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Create account</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Register as a student or professional with email and password, or
          continue with Google
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {googleEnabled && (
        <>
          <GoogleAuthButton
            label="Sign up with Google"
            errorCallbackURL="/sign-up"
            onError={setError}
            disabled={loading}
          />
          <div className="relative text-center">
            <span className="relative z-10 bg-card px-2 text-xs text-muted-foreground">
              or sign up with email
            </span>
            <span className="absolute inset-x-0 top-1/2 border-t border-border" />
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Selection */}
        <fieldset>
          <legend className="mb-2 block text-xs font-medium text-foreground">
            I am registering as
          </legend>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              aria-pressed={role === 'student'}
              onClick={() => handleRoleChange('student')}
              className={`rounded-md border px-3 py-2 text-sm text-left transition-colors focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 ${
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
              aria-pressed={role === 'professional'}
              onClick={() => handleRoleChange('professional')}
              className={`rounded-md border px-3 py-2 text-sm text-left transition-colors focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 ${
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

        {/* Full Name */}
        <div>
          <label htmlFor="signup-name" className="mb-1 block text-xs font-medium text-foreground">
            Full Name
          </label>
          <Input
            id="signup-name"
            type="text"
            name="name"
            required
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            aria-invalid={fieldErrors.name?.length ? true : undefined}
            aria-describedby={describedBy('name')}
          />
          <FieldError id="signup-name-error" messages={fieldErrors.name} />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="signup-email" className="mb-1 block text-xs font-medium text-foreground">
            Email Address
          </label>
          <Input
            id="signup-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            aria-invalid={fieldErrors.email?.length ? true : undefined}
            aria-describedby={describedBy('email')}
          />
          <FieldError id="signup-email-error" messages={fieldErrors.email} />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="signup-password" className="mb-1 block text-xs font-medium text-foreground">
            Password
          </label>
          <Input
            id="signup-password"
            type="password"
            name="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            aria-invalid={fieldErrors.password?.length ? true : undefined}
            aria-describedby={describedBy('password')}
          />
          <FieldError id="signup-password-error" messages={fieldErrors.password} />
        </div>

        {role === 'student' ? (
          /* Domain Data: CPF & Phone Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="signup-cpf" className="mb-1 block text-xs font-medium text-foreground">
                CPF
              </label>

              <Input
                id="signup-cpf"
                type="text"
                name="cpf"
                required
                maxLength={14}
                autoComplete="off"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
                aria-invalid={fieldErrors.cpf?.length ? true : undefined}
                aria-describedby={describedBy('cpf')}
              />

              {formData.cpf.replace(/\D/g, "").length === 11 && (
                <p
                  className={`mt-1 text-xs ${isValidCPF(formData.cpf)
                    ? "text-success"
                    : "text-destructive"
                    }`}
                >
                  {isValidCPF(formData.cpf)
                    ? "✓ Valid CPF"
                    : "✕ Invalid CPF"}
                </p>
              )}
              <FieldError id="signup-cpf-error" messages={fieldErrors.cpf} />
            </div>

            <div>
              <label htmlFor="signup-phone" className="mb-1 block text-xs font-medium text-foreground">
                Phone Number <span className="text-muted-foreground">(optional)</span>
              </label>

              <Input
                id="signup-phone"
                type="tel"
                name="phone"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
                aria-invalid={fieldErrors.phone?.length ? true : undefined}
                aria-describedby={describedBy('phone')}
              />

              {formData.phone.replace(/\D/g, "").length === 11 && (
                <p
                  className={`mt-1 text-xs ${isValidPhone(formData.phone)
                    ? "text-success"
                    : "text-destructive"
                    }`}
                >
                  {isValidPhone(formData.phone)
                    ? "✓ Valid phone number"
                    : "✕ Invalid phone number"}
                </p>
              )}
              <FieldError id="signup-phone-error" messages={fieldErrors.phone} />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label htmlFor="signup-cref" className="mb-1 block text-xs font-medium text-foreground">
                CREF
              </label>
              <Input
                id="signup-cref"
                type="text"
                name="cref"
                required
                maxLength={20}
                autoComplete="off"
                value={formData.cref}
                onChange={handleChange}
                placeholder="000000000/G-SP"
                aria-invalid={fieldErrors.cref?.length ? true : undefined}
                aria-describedby={describedBy('cref')}
              />
              <FieldError id="signup-cref-error" messages={fieldErrors.cref} />
            </div>

            <div>
              <label htmlFor="signup-specialty" className="mb-1 block text-xs font-medium text-foreground">
                Specialty
              </label>
              <Textarea
                id="signup-specialty"
                name="specialty"
                required
                maxLength={200}
                value={formData.specialty}
                onChange={handleChange}
                placeholder="Strength training, rehabilitation, ..."
                rows={3}
                aria-invalid={fieldErrors.specialty?.length ? true : undefined}
                aria-describedby={describedBy('specialty')}
              />
              <FieldError id="signup-specialty-error" messages={fieldErrors.specialty} />
            </div>

            <p className="text-xs text-muted-foreground">
              Professional accounts must be approved by an administrator before
              you can register workouts for students.
            </p>
          </div>
        )}

        <FieldError messages={fieldErrors.role} />

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="mt-2 w-full"
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      {/* Sign-In Navigation Link */}
      <div className="border-t border-border pt-2 text-center text-xs text-muted-foreground">
        Already have an account?{' '}
        <Link href="/sign-in" className="text-primary hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
