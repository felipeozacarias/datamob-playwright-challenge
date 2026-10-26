import { randomUUID } from 'node:crypto';
import { test as base, expect } from '@playwright/test';

type Account = {
  name: string;
  email: string;
  password: string;
};

export const test = base.extend<{ account: Account }>({
  account: async ({ request }, use) => {
    const id = randomUUID();

    const account: Account = {
      name: `Datamob QA ${id.slice(0, 8)}`,
      email: `datamob-${id}@example.com`,
      password: randomUUID(),
    };

    let created = false;

    try {
      await base.step('Preparar conta exclusiva por API', async () => {
        const response = await request.post('/api/createAccount', {
          timeout: 20_000,
          form: {
            ...account,
            title: 'Mr',
            birth_date: '1',
            birth_month: '1',
            birth_year: '1990',
            firstname: 'QA',
            lastname: 'Synthetic',
            company: 'Test Only',
            address1: 'Synthetic test address',
            address2: '',
            country: 'Canada',
            zipcode: '00000',
            state: 'Test',
            city: 'Test',
            mobile_number: '0000000000',
          },
        });

        const body = await response.json();

        created = body.responseCode === 201;

        expect(response.ok(), 'Sucesso HTTP na criação').toBeTruthy();
        expect(body.responseCode, 'Conta criada pela API').toBe(201);
      });

      await use(account);
    } finally {
      await base.step('Excluir a conta deste teste por API', async () => {
        const response = await request.delete('/api/deleteAccount', {
          timeout: 20_000,
          form: {
            email: account.email,
            password: account.password,
          },
        });

        const body = await response.json();

        expect(response.ok(), 'Sucesso HTTP na limpeza').toBeTruthy();

        const expectedCodes = created ? [200] : [200, 404];

        expect(
          expectedCodes,
          'Conta excluída ou ausente após criação não confirmada',
        ).toContain(body.responseCode);
      });
    }
  },
});

export { expect } from '@playwright/test';