import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.beforeEach(async ({ page }) => {
  await page.context().addCookies([
    {
      name: 'accessToken',
      value: 'Bearer fake-access-token',
      url: 'http://localhost:4000',
    },
  ]);

  await page.addInitScript(() => {
    window.localStorage.setItem('refreshToken', 'fake-refresh-token');
  });

  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/api/ingredients',
  });
});

test('в конструктор должны добавиться булка и начинка', async ({ page }) => {
  await page.goto('/');

  const ingredientBun = page.getByTestId('ingredient-643d69a5c3f7b9001cfa093c');
  const ingredientMain = page.getByTestId('ingredient-643d69a5c3f7b9001cfa0941');

  await ingredientBun.getByRole('button', { name: 'Добавить' }).click();
  await ingredientMain.getByRole('button', { name: 'Добавить' }).click();

  await expect(page.getByTestId('constructor-bun')).toBeVisible();
  await expect(page.getByTestId('constructor-main-643d69a5c3f7b9001cfa0941')).toBeVisible();
})

test('диалоговое окно должно открываться и закрываться по клику на крестик', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('ingredient-643d69a5c3f7b9001cfa0941').getByRole('link').click();

  const dialog = page.getByTestId('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Биокотлета из марсианской Магнолии');
  await expect(dialog).toContainText('424');

  await page.getByTestId('close-button-modal').click()
  await expect(page.getByTestId('dialog')).not.toBeVisible();

});

test('создание заказа', async ({ page }) => {
  page.on('response', res => {
    if (res.url().includes('/api/')) {
      console.log('←', res.status(), res.url());
    }
  });

  await page.routeFromHAR('./tests/hars/order-user.har', {
    url: '**/api/auth/user',
  });

  const orderResponseBody = fs.readFileSync(
    path.resolve(__dirname, 'hars', 'aae23d57aca7675ce7076b62d475ef522ad2753e.json'),
    'utf-8'
  );

  await page.route('**/api/orders', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json; charset=utf-8',
        body: orderResponseBody,
      });
    } else {
      await route.continue();
    }
  });

  const userResponsePromise = page.waitForResponse(
    (res) => res.url().includes('/api/auth/user') && res.status() === 200
  );

  await page.goto('/');
  await userResponsePromise;

  const ingredientBun = page.getByTestId('ingredient-643d69a5c3f7b9001cfa093c');
  const ingredientMain = page.getByTestId('ingredient-643d69a5c3f7b9001cfa0941');
  const ingredientSauce = page.getByTestId('ingredient-643d69a5c3f7b9001cfa0943');

  await ingredientBun.getByRole('button', { name: 'Добавить' }).click();
  await ingredientMain.getByRole('button', { name: 'Добавить' }).click();
  await ingredientSauce.getByRole('button', { name: 'Добавить' }).click();

  await expect(page.getByTestId('constructor-bun')).toBeVisible();
  await expect(page.getByTestId('constructor-main-643d69a5c3f7b9001cfa0941')).toBeVisible();
  await expect(page.getByTestId('constructor-main-643d69a5c3f7b9001cfa0943')).toBeVisible();

  const submitButton = page.getByTestId('order-submit-button').getByRole('button');
  await expect(submitButton).toBeEnabled();

  const orderResponsePromise = page.waitForResponse(
    (res) => res.url().includes('/api/orders') && res.request().method() === 'POST',
    { timeout: 10000 }
  );

  await submitButton.click();

  const orderResponse = await orderResponsePromise;
  expect(orderResponse.status()).toBe(200);

  
  await expect(page.getByTestId('dialog')).toBeVisible();
  await expect(page.getByTestId('dialog')).toContainText('107786');

  await page.getByTestId('close-button-modal').click();
  await expect(page.getByTestId('dialog')).not.toBeVisible();
  await expect(page.getByTestId('constructor-bun')).not.toBeVisible();
  await expect(page.getByTestId('constructor-main-643d69a5c3f7b9001cfa0941')).not.toBeVisible();
  await expect(page.getByTestId('constructor-main-643d69a5c3f7b9001cfa0943')).not.toBeVisible();
})
