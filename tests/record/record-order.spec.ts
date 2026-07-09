import { test } from '@playwright/test';

test('запись HAR для оформления заказа', async ({ page }) => {
  await page.routeFromHAR('./tests/hars/order-user.har', {
    url: '**/api/auth/user',
    update: true,
  })
  await page.routeFromHAR('./tests/hars/order-orders.har', {
    url: '**/api/orders',
    update: true,
  });

  await page.goto('/login');

  await page.locator('input[name="email"]').fill('testingapp@gmail.ru');
  await page.locator('input[name="password"]').fill('TestTest');

  await page.getByTestId('submit-container').getByRole('button').click();

  await page.waitForURL('/');

  const userResponsePromise = page.waitForResponse(
    (res) => res.url().includes('/api/auth/user') && res.status() === 200
  );
  await page.reload();
  await userResponsePromise;

  const ingredientBun = page.getByTestId('ingredient-643d69a5c3f7b9001cfa093c');
  const ingredientMain = page.getByTestId('ingredient-643d69a5c3f7b9001cfa0941');
  const ingredientSauce = page.getByTestId('ingredient-643d69a5c3f7b9001cfa0943');

  await ingredientBun.getByRole('button', { name: 'Добавить' }).click();
  await ingredientMain.getByRole('button', { name: 'Добавить' }).click();
  await ingredientSauce.getByRole('button', { name: 'Добавить' }).click();

  const orderResponsePromise = page.waitForResponse(
    (res) => res.url().includes('/api/orders') && res.request().method() === 'POST' && res.status() === 200
  );

  await page.getByTestId('order-submit-button').getByRole('button').click();
  const orderResponse = await orderResponsePromise;
  await orderResponse.body();
})
