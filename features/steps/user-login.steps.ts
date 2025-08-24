import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('I am on the login page', async function () {
  await this.page.goto('/login');
});

When('I enter my valid username and password', async function () {
  await this.page.fill('#username', process.env.VALID_USERNAME || 'validUser');
  await this.page.fill('#password', process.env.VALID_PASSWORD || 'validPass');
});

When('I enter {string} and {string}', async function (username: string, password: string) {
  await this.page.fill('#username', username);
  await this.page.fill('#password', password);
});

When('I click the {string} button', async function (buttonText: string) {
  await this.page.click(`button:has-text("${buttonText}")`);
});

Then('I should be redirected to my dashboard', async function () {
  await this.page.waitForURL('/dashboard');
  expect(this.page.url()).toContain('/dashboard');
});

Then('I should see an error message {string}', async function (errorMessage: string) {
  const error = await this.page.locator('.error-message');
  await expect(error).toHaveText(errorMessage);
});
