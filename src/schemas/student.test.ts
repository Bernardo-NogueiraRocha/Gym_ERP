import test from 'node:test';
import assert from 'node:assert/strict';

import { registerStudentSchema } from './student';

const validStudent = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  password: 'password123',
  cpf: '529.982.247-25',
};

test('accepts a valid registration and normalizes CPF and email', () => {
  const result = registerStudentSchema.safeParse({
    ...validStudent,
    email: '  ADA@Example.com ',
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.cpf, '52998224725');
    assert.equal(result.data.email, 'ada@example.com');
  }
});

test('treats an empty phone as not provided', () => {
  const result = registerStudentSchema.safeParse({
    ...validStudent,
    phone: '',
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.phone, undefined);
  }
});

test('accepts an omitted phone', () => {
  assert.equal(registerStudentSchema.safeParse(validStudent).success, true);
});

test('still validates a provided phone', () => {
  const result = registerStudentSchema.safeParse({
    ...validStudent,
    phone: '(11) 99999-9999',
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.phone, '11999999999');
  }
});

test('rejects an invalid phone', () => {
  const result = registerStudentSchema.safeParse({
    ...validStudent,
    phone: '119999',
  });

  assert.equal(result.success, false);
  if (!result.success) {
    assert.ok(result.error.flatten().fieldErrors.phone?.length);
  }
});

test('rejects an invalid CPF', () => {
  const result = registerStudentSchema.safeParse({
    ...validStudent,
    cpf: '111.111.111-11',
  });

  assert.equal(result.success, false);
  if (!result.success) {
    assert.ok(result.error.flatten().fieldErrors.cpf?.length);
  }
});

test('rejects a short password and a malformed email', () => {
  const result = registerStudentSchema.safeParse({
    ...validStudent,
    password: 'short',
    email: 'not-an-email',
  });

  assert.equal(result.success, false);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    assert.ok(errors.password?.length);
    assert.ok(errors.email?.length);
  }
});
