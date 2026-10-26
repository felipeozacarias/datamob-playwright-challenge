import type { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly heading: Locator;
  readonly logoutLink: Locator;
  readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', {
      name: 'Login to your account',
      exact: true,
    });

    this.logoutLink = page.getByRole('link', {
      name: /Logout/,
    });

    this.errorMessage = page.getByText(
      'Your email or password is incorrect!',
      { exact: true },
    );
  }

  async open(): Promise<void> {
    await this.page.goto('/login', {
      waitUntil: 'domcontentloaded',
    });
  }

  async login(email: string, password: string): Promise<void> {
    await this.page.getByTestId('login-email').fill(email);
    await this.page.getByTestId('login-password').fill(password);

    await this.page.getByRole('button', {
      name: 'Login',
      exact: true,
    }).click();
  }

  loggedInAs(name: string): Locator {
    return this.page.getByText(`Logged in as ${name}`, {
      exact: true,
    });
  }
}