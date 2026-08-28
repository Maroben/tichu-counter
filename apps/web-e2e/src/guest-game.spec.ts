import { expect, test } from '@playwright/test';

test('starts and restores a local guest game', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /start a game/i }).click();
  await expect(page.getByRole('heading', { name: /start a game/i })).toBeVisible();
  await page.getByRole('button', { name: /start local game/i }).click();
  await expect(page.getByRole('heading', { name: /dragon vs phoenix/i })).toBeVisible();
  await page.getByRole('button', { name: /add round/i }).click();
  await expect(page.getByRole('link', { name: /rounds \(1\)/i })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('link', { name: /rounds \(1\)/i })).toBeVisible();
});

test('drags the score slider with the mouse', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /start a game/i }).click();
  await page.getByRole('button', { name: /start local game/i }).click();

  const slider = page.getByRole('slider');
  await expect(slider).toHaveAttribute('aria-valuenow', '50');

  const frame = page.getByTestId('point-slider-frame');
  const box = await frame.boundingBox();
  if (!box) throw new Error('Slider is not visible.');

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.85, box.y + box.height / 2, { steps: 8 });
  await page.mouse.up();

  await expect.poll(async () => Number(await slider.getAttribute('aria-valuenow'))).toBeGreaterThan(80);
});
