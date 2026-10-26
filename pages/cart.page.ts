import type { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly items: Locator;

  constructor(private readonly page: Page) {
    this.items = page.locator('#cart_info_table tbody tr');
  }

  item(productId: number) {
    const row = this.page.locator(`#product-${productId}`);

    return {
      row,
      name: row.getByRole('heading'),
      unitPrice: row.locator('.cart_price'),
      quantity: row.locator('.cart_quantity'),
      total: row.locator('.cart_total'),
    };
  }
}