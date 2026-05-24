import { test, expect } from "@playwright/test";

const URL = "https://demo.playwright.dev/todomvc/#/";
const todos = () => page.locator(".todo-list li");

test.beforeEach(async ({ page }) => {
  await page.goto(URL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("should add todos and show correct count", { tag: ["@smoke"] }, async ({ page }) => {
  const input = page.getByPlaceholder("What needs to be done?");
  await input.fill("Buy groceries");
  await input.press("Enter");
  await input.fill("Walk the dog");
  await input.press("Enter");

  await expect(page.locator(".todo-list li")).toHaveCount(2);
  await expect.soft(page.getByText("2 items left")).toBeVisible();
  await expect.soft(page.getByRole("button", { name: "Clear completed" })).not.toBeVisible();

  await page.screenshot({ path: "screenshots/test1.png" });
});

test("should filter completed todos", { tag: ["@filter"] }, async ({ page }) => {
  test.slow();

  const input = page.getByPlaceholder("What needs to be done?");
  await input.fill("Task A");
  await input.press("Enter");
  await input.fill("Task B");
  await input.press("Enter");

  await page.locator(".todo-list li").first().getByRole("checkbox").check();
  await expect(page.locator(".todo-list li").first()).toHaveClass(/completed/);

  await page.getByRole("link", { name: "Completed" }).click();
  await expect(page.locator(".todo-list li")).toHaveCount(1);
  await expect(page.getByText("Task A")).toBeVisible();

  expect(page.url()).toContain("completed");

  await page.screenshot({ path: "screenshots/test2.png" });
});

test("should edit a todo item", { tag: ["@edit"] }, async ({ page }) => {
  const input = page.getByPlaceholder("What needs to be done?");
  await input.fill("Original text");
  await input.press("Enter");

  await page.locator(".todo-list li").first().dblclick();

  const editField = page.locator(".todo-list li .edit");
  await expect(editField).toHaveValue("Original text");

  await editField.fill("Updated text");
  await editField.press("Enter");

  await expect(page.getByText("Updated text")).toBeVisible();
  await expect(page.getByText("Original text")).not.toBeVisible();

  await page.screenshot({ path: "screenshots/test3.png" });
});

test("should delete a todo", { tag: ["@delete"] }, async ({ page }) => {
  test.fixme(false, "Hover-reveal destroy button may break if CSS changes");

  const input = page.getByPlaceholder("What needs to be done?");
  await input.fill("Keep me");
  await input.press("Enter");
  await input.fill("Delete me");
  await input.press("Enter");

  const secondItem = page.locator(".todo-list li").nth(1);
  await secondItem.hover();
  await secondItem.locator(".destroy").click();

  await expect(page.locator(".todo-list li")).toHaveCount(1);

  const remaining = await page.locator(".todo-list li").first().innerText();
  expect(remaining).toBe("Keep me");

  await page.screenshot({ path: "screenshots/test4.png", fullPage: true });
});

test("should toggle all todos", { tag: ["@toggle", "@smoke"] }, async ({ page }) => {
  test.fail(false, "Known flake on slow networks");

  const input = page.getByPlaceholder("What needs to be done?");
  await input.fill("Item 1");
  await input.press("Enter");
  await input.fill("Item 2");
  await input.press("Enter");

  const toggleAll = page.getByLabel("Mark all as complete");
  await page.evaluate(() => {
    (document.querySelector("#toggle-all") as HTMLElement).click();
  });

  await expect(page.locator(".todo-list li").nth(0)).toHaveClass(/completed/);
  await expect(page.locator(".todo-list li").nth(1)).toHaveClass(/completed/);

  const clearBtn = page.locator("//button[contains(@class,'clear-completed')]");
  await expect(clearBtn).toBeVisible();

  await page.reload();
  await page.waitForSelector(".todo-list li");
  await expect(page.locator(".todo-list li")).toHaveCount(2);

  await page.screenshot({ path: "screenshots/test5.png" });
});