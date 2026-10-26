import { test, expect } from '../fixtures/account.fixture';
import { LoginPage } from '../pages/login.page';

test('autentica o usuário com credenciais válidas', async ({
  page,
  account,
}) => {
  const loginPage = new LoginPage(page);

  await test.step('Abrir o formulário de login', async () => {
    await loginPage.open();

    await expect(loginPage.heading).toBeVisible();
  });

  await test.step('Enviar credenciais válidas pela interface', async () => {
    await loginPage.login(account.email, account.password);
  });

  await test.step('Verificar a identidade e o estado autenticado', async () => {
    await expect(loginPage.loggedInAs(account.name)).toBeVisible();
    await expect(loginPage.logoutLink).toBeVisible();
    await expect(loginPage.heading).toBeHidden();
  });
});

test('rejeita o login com senha incorreta', async ({
  page,
  account,
}) => {
  const loginPage = new LoginPage(page);
  const incorrectPassword = `${account.password}-incorrect`;

  await test.step('Abrir o formulário de login', async () => {
    await loginPage.open();

    await expect(loginPage.heading).toBeVisible();
  });

  await test.step('Enviar e-mail válido e senha incorreta', async () => {
    await loginPage.login(account.email, incorrectPassword);
  });

  await test.step('Verificar rejeição e estado não autenticado', async () => {
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.heading).toBeVisible();
    await expect(loginPage.logoutLink).toBeHidden();
    await expect(loginPage.loggedInAs(account.name)).toBeHidden();
  });
});