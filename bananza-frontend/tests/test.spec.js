// @ts-check
let { test, expect } = require('@playwright/test');

    test.beforeEach(async ({ page }) => {
    await page.goto('localhost:3000');
  });

  let user = {
      username:"Claudiu",
      password:"parola",
  }

  test.describe("Login", ()=>{
      test("should allow me to log in", async ({page})=>{
        await page.locator("#username").fill(user.username);
        await page.locator("#password").fill(user.password);
        await page.locator("button").press('Enter');

        await expect(page.locator("nav")).toHaveCount(0);
  })
  })