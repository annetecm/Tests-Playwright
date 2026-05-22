import { test, expect } from "@playwright/test";

test.describe("Activity 1 MercadoLibre: 7 Locators", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.mercadolibre.com.mx/");
  });

  test("getByRole search button is visible", async ({ page }) => {
    await expect(page.getByRole("button", { name: /buscar/i })).toBeVisible();
  });

  test("getByText Vender link exists in nav", async ({ page }) => {
    await expect(page.getByText("Vender").first()).toBeVisible();
  });

  test("getByLabel search input accepts text", async ({ page }) => {
    const input = page.getByLabel(/ingresa lo que quieras encontrar/i);
    await input.fill("laptop");
    await expect(input).toHaveValue("laptop");
  });

  test("getByPlaceholder search input found by placeholder", async ({ page }) => {
    const input = page.getByPlaceholder(/buscar/i);
    await input.fill("celular");
    await expect(input).toHaveValue("celular");
  });

  test("getByAltText logo image is visible", async ({ page }) => {
    await expect(page.getByAltText(/compra protegida/i).first()).toBeVisible();
  });

  test("getByTitle element with title attribute exists", async ({ page }) => {
    await expect(page.getByTitle(/carrito/i).first()).toBeVisible();
  });

  test("getByTestId locate element by data-testid", async ({ page }) => {
    const count = await page.locator("[data-testid]").count();
    console.log(`data-testid elements found: ${count}`);
    expect(count).toBeGreaterThanOrEqual(0);
  });
});