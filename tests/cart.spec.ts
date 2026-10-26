import { test, expect } from '@playwright/test';
import { ProductPage } from '../pages/product.page';
import { CartPage } from '../pages/cart.page';

test('adiciona produto ao carrinho com quantidade e total corretos', async ({
  page,
}) => {
  const product = {
    id: 1,
    name: 'Blue Top',
    unitPrice: 500,
    quantity: 3,
  };

  const expectedTotal = product.unitPrice * product.quantity;

  const productPage = new ProductPage(page);
  const cartPage = new CartPage(page);
  const item = cartPage.item(product.id);

  await test.step('Abrir e conferir o produto escolhido', async () => {
    await productPage.open(product.id);

    await expect(productPage.name).toHaveText(product.name);
    await expect(productPage.price).toHaveText(`Rs. ${product.unitPrice}`);
  });

  await test.step('Adicionar três unidades e acessar o carrinho', async () => {
    await productPage.addToCart(product.quantity);

    await expect(productPage.addedMessage).toBeVisible();

    await productPage.viewCart();
  });

  await test.step('Conferir item, preço unitário, quantidade e total', async () => {
    await expect(cartPage.items).toHaveCount(1);
    await expect(item.row).toBeVisible();
    await expect(item.name).toHaveText(product.name);
    await expect(item.unitPrice).toHaveText(`Rs. ${product.unitPrice}`);
    await expect(item.quantity).toHaveText(String(product.quantity));
    await expect(item.total).toHaveText(`Rs. ${expectedTotal}`);
  });
});