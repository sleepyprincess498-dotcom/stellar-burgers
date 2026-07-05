import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  page.on('request', req => console.log('→', req.method(), req.url()));

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
  await expect(page.getByTestId('constructor-main')).toBeVisible();
})

test('диалоговое окно должно открываться и закрываться по клику на крестик', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('ingredient-643d69a5c3f7b9001cfa0941').getByRole('link').click();
  await expect(page.getByTestId('dialog')).toBeVisible();

  await page.getByTestId('close-button-modal').click()
  await expect(page.getByTestId('dialog')).not.toBeVisible();

});

test('создание заказа', async ({ page }) => {
  await page.route('**/api/auth/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        user: {
          email: 'test@example.com',
          name: 'Тестовый пользователь',
        },
      }),
    })
  });

  await page.route('**/api/orders', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        name: 'Space бургер',
        order: {
          number: 123456,
        },
      }),
    });
  });

  await page.route('**/api/auth/token', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        accessToken: 'Bearer fake-access-token',
        refreshToken: 'fake-refresh-token',
      }),
    });
  });

  await page.goto('/');

  const ingredientBun = page.getByTestId('ingredient-643d69a5c3f7b9001cfa093c');
  const ingredientMain = page.getByTestId('ingredient-643d69a5c3f7b9001cfa0941');
  const ingredientSauce = page.getByTestId('ingredient-643d69a5c3f7b9001cfa0943');

  await ingredientBun.getByRole('button', { name: 'Добавить' }).click();
  await ingredientMain.getByRole('button', { name: 'Добавить' }).click();
  await ingredientSauce.getByRole('button', { name: 'Добавить' }).click();

  await page.getByTestId('order-submit-button').getByRole('button').click()
  await expect(page.getByTestId('dialog')).toBeVisible();
  await expect(page.getByTestId('dialog')).toContainText('123456');

  await page.getByTestId('close-button-modal').click();
  await expect(page.getByTestId('dialog')).not.toBeVisible();
  await expect(page.getByTestId('constructor-bun')).not.toBeVisible();
  await expect(page.getByTestId('constructor-main')).not.toBeVisible();
})
