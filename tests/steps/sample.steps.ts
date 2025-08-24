import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('I open the application', async function () {
    await this.page.goto('https://example.com');
});

When('I enter username {string}', async function (username: string) {
    await this.page.fill('input#username', username);
});

When('I enter password {string}', async function (password: string) {
    await this.page.fill('input#password', password);
});

When('I click on the login button', async function () {
    await this.page.click('button#login');
});

Then('I should see the dashboard', async function () {
    // Assuming the feature file says: Then I should see the dashboard
    // This checks that the dashboard header is visible
    await expect(this.page.locator('h1')).toHaveText('Dashboard');
});
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';


When('I enter username {string}', async function (username: string) {
    await this.page.fill('input#username', username);
});

When('I enter password {string}', async function (password: string) {
    await this.page.fill('input#password', password);
});


Then('I should see the dashboard', async function () {
    // Assuming the feature file says: Then I should see the dashboard
    // This checks that the dashboard header is visible
    await expect(this.page.locator('h1')).toHaveText('Dashboard');
});