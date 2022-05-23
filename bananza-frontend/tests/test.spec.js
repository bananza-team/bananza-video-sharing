// @ts-check
let { test, expect } = require('@playwright/test');


test.describe('test', async ()=>{
let page;

    test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  let user = {
      username:"Claudiu",
      password:"parola",
  }

      test("should allow me to log in", async ()=>{
        await page.goto("localhost:3000");
        await page.locator("#username").fill(user.username);
        await page.locator("#password").fill(user.password);
        await page.locator("button").press('Enter');

        await expect(page.locator("nav")).toHaveCount(1); // navigation is only present when the user is logged in
      });

      test("should go to the homepage when logging out", async ()=>{        
      await page.goto("localhost:3000");
      await page.locator("#username").fill(user.username);
      await page.locator("#password").fill(user.password);
      await page.locator("button").press('Enter');
      await page.locator('text=Logout').click();
      await expect(page.locator("nav")).toHaveCount(0);
      })
    })