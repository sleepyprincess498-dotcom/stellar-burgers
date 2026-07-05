import { test } from '@playwright/test';

test('запись HAR ингредиентов', async ({ page }) => {
  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: true,
  });

  const responsePromise = page.waitForResponse(
    (res) => res.url().includes('/api/ingredients') && res.status() === 200
  );

  await page.goto('/');

  await responsePromise; // дожидаемся реального успешного ответа перед завершением теста
});
