import test from 'node:test';
import assert from 'node:assert/strict';

import { completeRegistrationSchema } from './registration';

test('accepts a student registration and normalizes CPF and phone', () => {
  const result = completeRegistrationSchema.safeParse({
    role: 'student',
    cpf: '529.982.247-25',
    phone: '(11) 99999-9999',
  });

  assert.equal(result.success, true);
  if (result.success && result.data.role === 'student') {
    assert.equal(result.data.role, 'student');
    assert.equal(result.data.cpf, '52998224725');
    assert.equal(result.data.phone, '11999999999');
  }
});

test('treats an empty student phone as not provided', () => {
  const result = completeRegistrationSchema.safeParse({
    role: 'student',
    cpf: '529.982.247-25',
    phone: '',
  });

  assert.equal(result.success, true);
  if (result.success && result.data.role === 'student') {
    assert.equal(result.data.phone, undefined);
  }
});

test('rejects an invalid student CPF', () => {
  const result = completeRegistrationSchema.safeParse({
    role: 'student',
    cpf: '111.111.111-11',
  });

  assert.equal(result.success, false);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const cpfErrors = 'cpf' in errors ? errors.cpf : undefined;
    assert.ok(cpfErrors?.length);
  }
});

test('accepts a professional registration and trims free text', () => {
  const result = completeRegistrationSchema.safeParse({
    role: 'professional',
    cref: '  012345678/G-SP  ',
    specialty: '  Strength training  ',
  });

  assert.equal(result.success, true);
  if (result.success && result.data.role === 'professional') {
    assert.equal(result.data.role, 'professional');
    assert.equal(result.data.cref, '012345678/G-SP');
    assert.equal(result.data.specialty, 'Strength training');
  }
});

test('requires CREF and specialty for professionals', () => {
  const result = completeRegistrationSchema.safeParse({
    role: 'professional',
    cref: '   ',
    specialty: '',
  });

  assert.equal(result.success, false);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const crefErrors = 'cref' in errors ? errors.cref : undefined;
    const specialtyErrors = 'specialty' in errors ? errors.specialty : undefined;
    assert.ok(crefErrors?.length);
    assert.ok(specialtyErrors?.length);
  }
});

test('never accepts the administrator role', () => {
  const result = completeRegistrationSchema.safeParse({
    role: 'admin',
  });

  assert.equal(result.success, false);
});
