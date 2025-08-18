import { ProjectFile, PreviewConfiguration } from '../types';

interface PageGenerationResult {
  files: ProjectFile[];
}

/**
 * Generates page object files
 */
export function generatePageObjects(config: PreviewConfiguration): PageGenerationResult {
  const files: ProjectFile[] = [];

  // Base page object
  const basePage = generateBasePage(config);
  files.push(basePage);

  // Example page objects
  const homePage = generateHomePage(config);
  files.push(homePage);

  const loginPage = generateLoginPage(config);
  files.push(loginPage);

  if (config.capabilities.includes('ecommerce')) {
    const productPage = generateProductPage(config);
    files.push(productPage);
  }

  return {
    files,
  };
}

function generateBasePage(config: PreviewConfiguration): ProjectFile {
  const ext = config.language === 'typescript' ? 'ts' : 'js';
  const typeAnnotations = config.language === 'typescript' ? ': Page' : '';
  const importStatement = config.language === 'typescript'
    ? "import { Page, Locator } from '@playwright/test';"
    : "const { Page } = require('@playwright/test');";

  const content = `${importStatement}

/**
 * Base Page Object containing common functionality for all pages
 */
export class BasePage {
  readonly page${typeAnnotations};

  constructor(page${typeAnnotations}) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   */
  async goto(url${config.language === 'typescript' ? ': string' : ''}) {
    await this.page.goto(url);
    await this.waitForPageLoad();
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get page title
   */
  async getTitle()${config.language === 'typescript' ? ': Promise<string>' : ''} {
    return await this.page.title();
  }

  /**
   * Take a screenshot
   */
  async takeScreenshot(name${config.language === 'typescript' ? ': string' : ''}) {
    await this.page.screenshot({ 
      path: \`screenshots/\${name}.png\`,
      fullPage: true 
    });
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(selector${config.language === 'typescript' ? ': string' : ''}) {
    await this.page.waitForSelector(selector, { state: 'visible' });
  }

  /**
   * Click element with retry logic
   */
  async clickWithRetry(selector${config.language === 'typescript' ? ': string' : ''}, maxRetries${config.language === 'typescript' ? ': number' : ''} = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await this.page.click(selector);
        break;
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await this.page.waitForTimeout(1000);
      }
    }
  }

  /**
   * Fill input with clear
   */
  async fillInput(selector${config.language === 'typescript' ? ': string' : ''}, value${config.language === 'typescript' ? ': string' : ''}) {
    await this.page.fill(selector, '');
    await this.page.fill(selector, value);
  }

  /**
   * Get element text
   */
  async getElementText(selector${config.language === 'typescript' ? ': string' : ''})${config.language === 'typescript' ? ': Promise<string>' : ''} {
    return await this.page.locator(selector).textContent() || '';
  }

  /**
   * Check if element exists
   */
  async elementExists(selector${config.language === 'typescript' ? ': string' : ''})${config.language === 'typescript' ? ': Promise<boolean>' : ''} {
    try {
      await this.page.waitForSelector(selector, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Scroll to element
   */
  async scrollToElement(selector${config.language === 'typescript' ? ': string' : ''}) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Handle alert dialogs
   */
  async handleAlert(accept${config.language === 'typescript' ? ': boolean' : ''} = true) {
    this.page.on('dialog', async dialog => {
      if (accept) {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });
  }
}`;

  return {
    path: `tests/pages/BasePage.${ext}`,
    content,
    description: 'Base page object with common functionality',
    category: 'page',
    language: config.language,
  };
}

function generateHomePage(config: PreviewConfiguration): ProjectFile {
  const ext = config.language === 'typescript' ? 'ts' : 'js';
  const typeAnnotations = config.language === 'typescript' ? ': Page' : '';
  const locatorType = config.language === 'typescript' ? ': Locator' : '';
  const importStatement = config.language === 'typescript'
    ? "import { Page, Locator } from '@playwright/test';\nimport { BasePage } from './BasePage';"
    : "const { BasePage } = require('./BasePage');";

  const content = `${importStatement}

/**
 * Home Page Object
 */
export class HomePage extends BasePage {
  // Locators
  readonly header${locatorType};
  readonly navigation${locatorType};
  readonly heroSection${locatorType};
  readonly featuresSection${locatorType};
  readonly footer${locatorType};
  readonly searchBox${locatorType};
  readonly loginButton${locatorType};
  readonly signupButton${locatorType};

  constructor(page${typeAnnotations}) {
    super(page);
    this.header = page.locator('header');
    this.navigation = page.locator('nav');
    this.heroSection = page.locator('[data-testid="hero-section"]');
    this.featuresSection = page.locator('[data-testid="features-section"]');
    this.footer = page.locator('footer');
    this.searchBox = page.locator('[data-testid="search-input"]');
    this.loginButton = page.locator('[data-testid="login-button"]');
    this.signupButton = page.locator('[data-testid="signup-button"]');
  }

  /**
   * Navigate to home page
   */
  async navigateToHome() {
    await this.goto('/');
    await this.waitForHomePageLoad();
  }

  /**
   * Wait for home page specific elements
   */
  async waitForHomePageLoad() {
    await this.heroSection.waitFor({ state: 'visible' });
    await this.navigation.waitFor({ state: 'visible' });
  }

  /**
   * Search for content
   */
  async search(query${config.language === 'typescript' ? ': string' : ''}) {
    await this.searchBox.fill(query);
    await this.searchBox.press('Enter');
    await this.page.waitForURL(/.*search.*/);
  }

  /**
   * Navigate to login page
   */
  async goToLogin() {
    await this.loginButton.click();
    await this.page.waitForURL(/.*login.*/);
  }

  /**
   * Navigate to signup page
   */
  async goToSignup() {
    await this.signupButton.click();
    await this.page.waitForURL(/.*signup.*/);
  }

  /**
   * Get feature cards
   */
  async getFeatureCards() {
    return await this.featuresSection.locator('.feature-card').all();
  }

  /**
   * Click on specific feature
   */
  async clickFeature(featureName${config.language === 'typescript' ? ': string' : ''}) {
    await this.featuresSection
      .locator('.feature-card')
      .filter({ hasText: featureName })
      .click();
  }

  /**
   * Check if user is logged in
   */
  async isUserLoggedIn()${config.language === 'typescript' ? ': Promise<boolean>' : ''} {
    return await this.page.locator('[data-testid="user-menu"]').isVisible();
  }

  /**
   * Get navigation links
   */
  async getNavigationLinks() {
    return await this.navigation.locator('a').all();
  }

  /**
   * Navigate using menu
   */
  async navigateToSection(sectionName${config.language === 'typescript' ? ': string' : ''}) {
    await this.navigation
      .locator('a')
      .filter({ hasText: sectionName })
      .click();
  }

  /**
   * Verify page elements
   */
  async verifyPageElements() {
    const elements = [
      this.header,
      this.navigation,
      this.heroSection,
      this.footer
    ];

    for (const element of elements) {
      await element.waitFor({ state: 'visible' });
    }
  }
}`;

  return {
    path: `tests/pages/HomePage.${ext}`,
    content,
    description: 'Home page object with specific functionality',
    category: 'page',
    language: config.language,
  };
}

function generateLoginPage(config: PreviewConfiguration): ProjectFile {
  const ext = config.language === 'typescript' ? 'ts' : 'js';
  const typeAnnotations = config.language === 'typescript' ? ': Page' : '';
  const locatorType = config.language === 'typescript' ? ': Locator' : '';
  const importStatement = config.language === 'typescript'
    ? "import { Page, Locator } from '@playwright/test';\nimport { BasePage } from './BasePage';"
    : "const { BasePage } = require('./BasePage');";

  const content = `${importStatement}

/**
 * Login Page Object
 */
export class LoginPage extends BasePage {
  // Locators
  readonly emailInput${locatorType};
  readonly passwordInput${locatorType};
  readonly loginButton${locatorType};
  readonly forgotPasswordLink${locatorType};
  readonly signupLink${locatorType};
  readonly errorMessage${locatorType};
  readonly successMessage${locatorType};
  readonly rememberMeCheckbox${locatorType};

  constructor(page${typeAnnotations}) {
    super(page);
    this.emailInput = page.locator('[data-testid="email-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.loginButton = page.locator('[data-testid="login-submit"]');
    this.forgotPasswordLink = page.locator('[data-testid="forgot-password"]');
    this.signupLink = page.locator('[data-testid="signup-link"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.successMessage = page.locator('[data-testid="success-message"]');
    this.rememberMeCheckbox = page.locator('[data-testid="remember-me"]');
  }

  /**
   * Navigate to login page
   */
  async navigateToLogin() {
    await this.goto('/login');
    await this.waitForLoginPageLoad();
  }

  /**
   * Wait for login page to load
   */
  async waitForLoginPageLoad() {
    await this.emailInput.waitFor({ state: 'visible' });
    await this.passwordInput.waitFor({ state: 'visible' });
    await this.loginButton.waitFor({ state: 'visible' });
  }

  /**
   * Perform login
   */
  async login(email${config.language === 'typescript' ? ': string' : ''}, password${config.language === 'typescript' ? ': string' : ''}) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  /**
   * Fill email field
   */
  async fillEmail(email${config.language === 'typescript' ? ': string' : ''}) {
    await this.emailInput.fill(email);
  }

  /**
   * Fill password field
   */
  async fillPassword(password${config.language === 'typescript' ? ': string' : ''}) {
    await this.passwordInput.fill(password);
  }

  /**
   * Click login button
   */
  async clickLogin() {
    await this.loginButton.click();
  }

  /**
   * Click forgot password
   */
  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
    await this.page.waitForURL(/.*forgot-password.*/);
  }

  /**
   * Click signup link
   */
  async clickSignup() {
    await this.signupLink.click();
    await this.page.waitForURL(/.*signup.*/);
  }

  /**
   * Toggle remember me
   */
  async toggleRememberMe() {
    await this.rememberMeCheckbox.click();
  }

  /**
   * Get error message text
   */
  async getErrorMessage()${config.language === 'typescript' ? ': Promise<string>' : ''} {
    await this.errorMessage.waitFor({ state: 'visible' });
    return await this.errorMessage.textContent() || '';
  }

  /**
   * Get success message text
   */
  async getSuccessMessage()${config.language === 'typescript' ? ': Promise<string>' : ''} {
    await this.successMessage.waitFor({ state: 'visible' });
    return await this.successMessage.textContent() || '';
  }

  /**
   * Check if login was successful
   */
  async isLoginSuccessful()${config.language === 'typescript' ? ': Promise<boolean>' : ''} {
    try {
      await this.page.waitForURL(/.*dashboard.*/, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate form fields
   */
  async validateRequiredFields() {
    await this.clickLogin();
    
    const emailError = await this.page.locator('[data-testid="email-error"]').isVisible();
    const passwordError = await this.page.locator('[data-testid="password-error"]').isVisible();
    
    return { emailError, passwordError };
  }

  /**
   * Login with valid credentials
   */
  async loginWithValidCredentials() {
    const email = process.env.TEST_EMAIL || 'test@example.com';
    const password = process.env.TEST_PASSWORD || 'testpass123';
    await this.login(email, password);
  }

  /**
   * Login with invalid credentials
   */
  async loginWithInvalidCredentials() {
    await this.login('invalid@email.com', 'wrongpassword');
    await this.waitForElement('[data-testid="error-message"]');
  }
}`;

  return {
    path: `tests/pages/LoginPage.${ext}`,
    content,
    description: 'Login page object with authentication functionality',
    category: 'page',
    language: config.language,
  };
}

function generateProductPage(config: PreviewConfiguration): ProjectFile {
  const ext = config.language === 'typescript' ? 'ts' : 'js';
  const typeAnnotations = config.language === 'typescript' ? ': Page' : '';
  const locatorType = config.language === 'typescript' ? ': Locator' : '';
  const importStatement = config.language === 'typescript'
    ? "import { Page, Locator } from '@playwright/test';\nimport { BasePage } from './BasePage';"
    : "const { BasePage } = require('./BasePage');";

  const content = `${importStatement}

/**
 * Product Page Object for E-commerce functionality
 */
export class ProductPage extends BasePage {
  // Locators
  readonly productTitle${locatorType};
  readonly productPrice${locatorType};
  readonly productDescription${locatorType};
  readonly productImages${locatorType};
  readonly quantitySelector${locatorType};
  readonly addToCartButton${locatorType};
  readonly buyNowButton${locatorType};
  readonly wishlistButton${locatorType};
  readonly reviewsSection${locatorType};
  readonly ratingStars${locatorType};
  readonly sizeSelector${locatorType};
  readonly colorSelector${locatorType};

  constructor(page${typeAnnotations}) {
    super(page);
    this.productTitle = page.locator('[data-testid="product-title"]');
    this.productPrice = page.locator('[data-testid="product-price"]');
    this.productDescription = page.locator('[data-testid="product-description"]');
    this.productImages = page.locator('[data-testid="product-images"]');
    this.quantitySelector = page.locator('[data-testid="quantity-selector"]');
    this.addToCartButton = page.locator('[data-testid="add-to-cart"]');
    this.buyNowButton = page.locator('[data-testid="buy-now"]');
    this.wishlistButton = page.locator('[data-testid="wishlist-button"]');
    this.reviewsSection = page.locator('[data-testid="reviews-section"]');
    this.ratingStars = page.locator('[data-testid="rating-stars"]');
    this.sizeSelector = page.locator('[data-testid="size-selector"]');
    this.colorSelector = page.locator('[data-testid="color-selector"]');
  }

  /**
   * Navigate to product page
   */
  async navigateToProduct(productId${config.language === 'typescript' ? ': string' : ''}) {
    await this.goto(\`/product/\${productId}\`);
    await this.waitForProductPageLoad();
  }

  /**
   * Wait for product page to load
   */
  async waitForProductPageLoad() {
    await this.productTitle.waitFor({ state: 'visible' });
    await this.productPrice.waitFor({ state: 'visible' });
    await this.addToCartButton.waitFor({ state: 'visible' });
  }

  /**
   * Get product information
   */
  async getProductInfo() {
    const title = await this.productTitle.textContent();
    const price = await this.productPrice.textContent();
    const description = await this.productDescription.textContent();
    
    return { title, price, description };
  }

  /**
   * Select product quantity
   */
  async selectQuantity(quantity${config.language === 'typescript' ? ': number' : ''}) {
    await this.quantitySelector.selectOption(quantity.toString());
  }

  /**
   * Select product size
   */
  async selectSize(size${config.language === 'typescript' ? ': string' : ''}) {
    await this.sizeSelector.selectOption(size);
  }

  /**
   * Select product color
   */
  async selectColor(color${config.language === 'typescript' ? ': string' : ''}) {
    await this.colorSelector.locator(\`[data-color="\${color}"]\`).click();
  }

  /**
   * Add product to cart
   */
  async addToCart() {
    await this.addToCartButton.click();
    await this.page.waitForSelector('[data-testid="cart-success-message"]');
  }

  /**
   * Buy product now
   */
  async buyNow() {
    await this.buyNowButton.click();
    await this.page.waitForURL(/.*checkout.*/);
  }

  /**
   * Add to wishlist
   */
  async addToWishlist() {
    await this.wishlistButton.click();
    await this.page.waitForSelector('[data-testid="wishlist-success-message"]');
  }

  /**
   * View product images
   */
  async viewImage(imageIndex${config.language === 'typescript' ? ': number' : ''}) {
    const images = await this.productImages.locator('img').all();
    if (images[imageIndex]) {
      await images[imageIndex].click();
    }
  }

  /**
   * Get product rating
   */
  async getProductRating()${config.language === 'typescript' ? ': Promise<number>' : ''} {
    const ratingText = await this.ratingStars.getAttribute('data-rating');
    return parseFloat(ratingText || '0');
  }

  /**
   * Read reviews
   */
  async getReviews() {
    const reviewElements = await this.reviewsSection.locator('.review-item').all();
    const reviews = [];
    
    for (const review of reviewElements) {
      const rating = await review.locator('.review-rating').textContent();
      const text = await review.locator('.review-text').textContent();
      const author = await review.locator('.review-author').textContent();
      
      reviews.push({ rating, text, author });
    }
    
    return reviews;
  }

  /**
   * Submit product review
   */
  async submitReview(rating${config.language === 'typescript' ? ': number' : ''}, reviewText${config.language === 'typescript' ? ': string' : ''}) {
    await this.page.locator(\`[data-testid="star-\${rating}"]\`).click();
    await this.page.locator('[data-testid="review-text"]').fill(reviewText);
    await this.page.locator('[data-testid="submit-review"]').click();
  }

  /**
   * Check product availability
   */
  async isProductInStock()${config.language === 'typescript' ? ': Promise<boolean>' : ''} {
    const stockStatus = await this.page.locator('[data-testid="stock-status"]').textContent();
    return !stockStatus?.includes('Out of Stock');
  }

  /**
   * Get available sizes
   */
  async getAvailableSizes() {
    const sizeOptions = await this.sizeSelector.locator('option').all();
    const sizes = [];
    
    for (const option of sizeOptions) {
      const value = await option.getAttribute('value');
      if (value) sizes.push(value);
    }
    
    return sizes;
  }
}`;

  return {
    path: `tests/pages/ProductPage.${ext}`,
    content,
    description: 'Product page object for e-commerce functionality',
    category: 'page',
    language: config.language,
  };
}