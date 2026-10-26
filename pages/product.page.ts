import type { Locator, Page } from '@playwright/test';

export class ProductPage {
  readonly name: Locator;
  readonly price: Locator;
  readonly addedMessage: Locator;

  constructor(private readonly page: Page) {
    const information = page.locator('.product-information');

    this.name = information.getByRole('heading', { level: 2 });
    this.price = information.getByText(/^Rs\.\s*\d+$/);

    this.addedMessage = page.locator('#cartModal').getByText(
      'Your product has been added to cart.',
      { exact: true },
    );
  }

  async open(id: number): Promise<void> {
    await this.page.goto(`/product_details/${id}`, {
      waitUntil: 'domcontentloaded',
    });
  }

  async addToCart(quantity: number): Promise<void> {
    await this.page.locator('#quantity').fill(String(quantity));

    await this.page.getByRole('button', {
      name: /Add to cart/,
    }).click();
  }

  async viewCart(): Promise<void> {
    await this.page.locator('#cartModal').getByRole('link', {
      name: 'View Cart',
      exact: true,
    }).click();
  }
}