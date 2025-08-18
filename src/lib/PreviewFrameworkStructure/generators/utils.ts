import { ProjectFile, PreviewConfiguration } from '../types';

interface UtilGenerationResult {
  files: ProjectFile[];
  dependencies: string[];
}

/**
 * Generates utility files
 */
export function generateUtilityFiles(config: PreviewConfiguration): UtilGenerationResult {
  const files: ProjectFile[] = [];
  const dependencies: string[] = [];

  // Base utility helpers
  const helpersFile = generateHelpersFile(config);
  files.push(helpersFile);

  // Wait utilities
  const waitUtils = generateWaitUtils(config);
  files.push(waitUtils);

  // String utilities
  const stringUtils = generateStringUtils(config);
  files.push(stringUtils);

  // Date utilities
  const dateUtils = generateDateUtils(config);
  files.push(dateUtils);

  if (config.integrations.includes('faker')) {
    const fakerUtils = generateFakerUtils(config);
    files.push(fakerUtils);
    dependencies.push('@faker-js/faker');
  }

  return {
    files,
    dependencies,
  };
}

function generateHelpersFile(config: PreviewConfiguration): ProjectFile {
  const ext = config.language === 'typescript' ? 'ts' : 'js';
  const typeImports = config.language === 'typescript' 
    ? "import { Page, Locator } from '@playwright/test';"
    : "";

  const content = `${typeImports}

/**
 * General helper functions for test automation
 */

/**
 * Retry function with exponential backoff
 */
export async function retry${config.language === 'typescript' ? '<T>' : ''}(
  fn${config.language === 'typescript' ? ': () => Promise<T>' : ''},
  maxAttempts${config.language === 'typescript' ? ': number' : ''} = 3,
  delay${config.language === 'typescript' ? ': number' : ''} = 1000
)${config.language === 'typescript' ? ': Promise<T>' : ''} {
  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxAttempts) {
        break;
      }
      
      const backoffDelay = delay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }
  
  throw lastError;
}

/**
 * Wait for condition to be true
 */
export async function waitForCondition(
  condition${config.language === 'typescript' ? ': () => Promise<boolean> | boolean' : ''},
  options${config.language === 'typescript' ? ': { timeout?: number; interval?: number; message?: string }' : ''} = {}
) {
  const { timeout = 10000, interval = 500, message = 'Condition not met' } = options;
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const result = await condition();
    if (result) {
      return;
    }
    
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  throw new Error(\`\${message} within \${timeout}ms\`);
}

/**
 * Generate random string
 */
export function generateRandomString(length${config.language === 'typescript' ? ': number' : ''} = 10)${config.language === 'typescript' ? ': string' : ''} {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}

/**
 * Generate random email
 */
export function generateRandomEmail(domain${config.language === 'typescript' ? ': string' : ''} = 'example.com')${config.language === 'typescript' ? ': string' : ''} {
  const username = generateRandomString(8).toLowerCase();
  return \`\${username}@\${domain}\`;
}

/**
 * Generate random number in range
 */
export function generateRandomNumber(min${config.language === 'typescript' ? ': number' : ''}, max${config.language === 'typescript' ? ': number' : ''})${config.language === 'typescript' ? ': number' : ''} {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Deep merge objects
 */
export function deepMerge${config.language === 'typescript' ? '<T extends object>' : ''}(target${config.language === 'typescript' ? ': T' : ''}, source${config.language === 'typescript' ? ': Partial<T>' : ''})${config.language === 'typescript' ? ': T' : ''} {
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      const targetValue = result[key];
      
      if (
        typeof sourceValue === 'object' &&
        sourceValue !== null &&
        !Array.isArray(sourceValue) &&
        typeof targetValue === 'object' &&
        targetValue !== null &&
        !Array.isArray(targetValue)
      ) {
        result[key] = deepMerge(targetValue, sourceValue);
      } else {
        result[key] = sourceValue${config.language === 'typescript' ? ' as T[Extract<keyof T, string>]' : ''};
      }
    }
  }
  
  return result;
}

/**
 * Sanitize string for file names
 */
export function sanitizeFileName(fileName${config.language === 'typescript' ? ': string' : ''})${config.language === 'typescript' ? ': string' : ''} {
  return fileName
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase();
}

/**
 * Format currency
 */
export function formatCurrency(amount${config.language === 'typescript' ? ': number' : ''}, currency${config.language === 'typescript' ? ': string' : ''} = 'USD')${config.language === 'typescript' ? ': string' : ''} {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Parse environment variables
 */
export function getEnvVar(key${config.language === 'typescript' ? ': string' : ''}, defaultValue${config.language === 'typescript' ? ': string' : ''} = '')${config.language === 'typescript' ? ': string' : ''} {
  return process.env[key] || defaultValue;
}

/**
 * Log with timestamp
 */
export function logWithTimestamp(message${config.language === 'typescript' ? ': string' : ''}, level${config.language === 'typescript' ? ': string' : ''} = 'INFO') {
  const timestamp = new Date().toISOString();
  console.log(\`[\${timestamp}] [\${level}] \${message}\`);
}

/**
 * Sleep/delay function
 */
export function sleep(ms${config.language === 'typescript' ? ': number' : ''})${config.language === 'typescript' ? ': Promise<void>' : ''} {
  return new Promise(resolve => setTimeout(resolve, ms));
}
`;

  return {
    path: `tests/utils/helpers.${ext}`,
    content,
    description: 'General helper functions for test automation',
    category: 'util',
    language: config.language,
  };
}

function generateWaitUtils(config: PreviewConfiguration): ProjectFile {
  const ext = config.language === 'typescript' ? 'ts' : 'js';
  const typeImports = config.language === 'typescript' 
    ? "import { Page, Locator } from '@playwright/test';"
    : "";

  const content = `${typeImports}

/**
 * Wait utility functions for test automation
 */

/**
 * Wait for element to appear
 */
export async function waitForElement(
  page${config.language === 'typescript' ? ': Page' : ''}, 
  selector${config.language === 'typescript' ? ': string' : ''}, 
  options${config.language === 'typescript' ? ': { timeout?: number; state?: string }' : ''} = {}
) {
  const { timeout = 10000, state = 'visible' } = options;
  await page.waitForSelector(selector, { state, timeout });
}

/**
 * Wait for element to disappear
 */
export async function waitForElementToDisappear(
  page${config.language === 'typescript' ? ': Page' : ''}, 
  selector${config.language === 'typescript' ? ': string' : ''}, 
  timeout${config.language === 'typescript' ? ': number' : ''} = 10000
) {
  await page.waitForSelector(selector, { state: 'hidden', timeout });
}

/**
 * Wait for text to appear
 */
export async function waitForText(
  page${config.language === 'typescript' ? ': Page' : ''}, 
  text${config.language === 'typescript' ? ': string' : ''}, 
  timeout${config.language === 'typescript' ? ': number' : ''} = 10000
) {
  await page.waitForSelector(\`text=\${text}\`, { timeout });
}

/**
 * Wait for URL change
 */
export async function waitForUrlChange(
  page${config.language === 'typescript' ? ': Page' : ''}, 
  expectedUrl${config.language === 'typescript' ? ': string | RegExp' : ''}, 
  timeout${config.language === 'typescript' ? ': number' : ''} = 10000
) {
  await page.waitForURL(expectedUrl, { timeout });
}

/**
 * Wait for network idle
 */
export async function waitForNetworkIdle(
  page${config.language === 'typescript' ? ': Page' : ''}, 
  timeout${config.language === 'typescript' ? ': number' : ''} = 10000
) {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Wait for page load
 */
export async function waitForPageLoad(
  page${config.language === 'typescript' ? ': Page' : ''}, 
  timeout${config.language === 'typescript' ? ': number' : ''} = 30000
) {
  await Promise.all([
    page.waitForLoadState('networkidle', { timeout }),
    page.waitForLoadState('domcontentloaded', { timeout })
  ]);
}

/**
 * Wait for API response
 */
export async function waitForApiResponse(
  page${config.language === 'typescript' ? ': Page' : ''}, 
  urlPattern${config.language === 'typescript' ? ': string | RegExp' : ''}, 
  timeout${config.language === 'typescript' ? ': number' : ''} = 10000
) {
  return await page.waitForResponse(response => 
    response.url().includes(urlPattern) && response.status() === 200, 
    { timeout }
  );
}

/**
 * Wait with custom condition
 */
export async function waitUntil(
  condition${config.language === 'typescript' ? ': () => Promise<boolean> | boolean' : ''}, 
  options${config.language === 'typescript' ? ': { timeout?: number; interval?: number; message?: string }' : ''} = {}
) {
  const { timeout = 10000, interval = 500, message = 'Condition not met' } = options;
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const result = await condition();
    if (result) {
      return;
    }
    
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  throw new Error(\`\${message} within \${timeout}ms\`);
}`;

  return {
    path: `tests/utils/waitUtils.${ext}`,
    content,
    description: 'Wait utility functions for test automation',
    category: 'util',
    language: config.language,
  };
}

function generateStringUtils(config: PreviewConfiguration): ProjectFile {
  const ext = config.language === 'typescript' ? 'ts' : 'js';

  const content = `/**
 * String utility functions for test automation
 */

/**
 * Generate random string
 */
export function randomString(length${config.language === 'typescript' ? ': number' : ''} = 10)${config.language === 'typescript' ? ': string' : ''} {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate random email
 */
export function randomEmail(domain${config.language === 'typescript' ? ': string' : ''} = 'example.com')${config.language === 'typescript' ? ': string' : ''} {
  return \`\${randomString(8).toLowerCase()}@\${domain}\`;
}

/**
 * Generate random phone number
 */
export function randomPhoneNumber(countryCode${config.language === 'typescript' ? ': string' : ''} = '+1')${config.language === 'typescript' ? ': string' : ''} {
  const number = Math.floor(Math.random() * 9000000000) + 1000000000;
  return \`\${countryCode}\${number}\`;
}

/**
 * Normalize whitespace
 */
export function normalizeWhitespace(text${config.language === 'typescript' ? ': string' : ''})${config.language === 'typescript' ? ': string' : ''} {
  return text.replace(/\\s+/g, ' ').trim();
}

/**
 * Extract numbers from string
 */
export function extractNumbers(text${config.language === 'typescript' ? ': string' : ''})${config.language === 'typescript' ? ': number[]' : ''} {
  const matches = text.match(/\\d+(\\.\\d+)?/g);
  return matches ? matches.map(Number) : [];
}

/**
 * Format currency string
 */
export function formatCurrency(amount${config.language === 'typescript' ? ': number' : ''}, currency${config.language === 'typescript' ? ': string' : ''} = 'USD')${config.language === 'typescript' ? ': string' : ''} {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Parse currency string
 */
export function parseCurrency(currencyString${config.language === 'typescript' ? ': string' : ''})${config.language === 'typescript' ? ': number' : ''} {
  const match = currencyString.match(/([\\d,]+\\.?\\d*)/);
  return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
}

/**
 * Slugify string
 */
export function slugify(text${config.language === 'typescript' ? ': string' : ''})${config.language === 'typescript' ? ': string' : ''} {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Capitalize first letter
 */
export function capitalize(text${config.language === 'typescript' ? ': string' : ''})${config.language === 'typescript' ? ': string' : ''} {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Truncate string
 */
export function truncate(text${config.language === 'typescript' ? ': string' : ''}, maxLength${config.language === 'typescript' ? ': number' : ''}, suffix${config.language === 'typescript' ? ': string' : ''} = '...')${config.language === 'typescript' ? ': string' : ''} {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}`;

  return {
    path: `tests/utils/stringUtils.${ext}`,
    content,
    description: 'String utility functions for test automation',
    category: 'util',
    language: config.language,
  };
}

function generateDateUtils(config: PreviewConfiguration): ProjectFile {
  const ext = config.language === 'typescript' ? 'ts' : 'js';

  const content = `/**
 * Date utility functions for test automation
 */

/**
 * Format date for input fields
 */
export function formatDateForInput(date${config.language === 'typescript' ? ': Date' : ''})${config.language === 'typescript' ? ': string' : ''} {
  return date.toISOString().split('T')[0];
}

/**
 * Format datetime for input fields
 */
export function formatDateTimeForInput(date${config.language === 'typescript' ? ': Date' : ''})${config.language === 'typescript' ? ': string' : ''} {
  return date.toISOString().slice(0, 16);
}

/**
 * Get date relative to today
 */
export function getRelativeDate(daysOffset${config.language === 'typescript' ? ': number' : ''})${config.language === 'typescript' ? ': Date' : ''} {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date;
}

/**
 * Get yesterday's date
 */
export function getYesterday()${config.language === 'typescript' ? ': Date' : ''} {
  return getRelativeDate(-1);
}

/**
 * Get tomorrow's date
 */
export function getTomorrow()${config.language === 'typescript' ? ': Date' : ''} {
  return getRelativeDate(1);
}

/**
 * Get random date in range
 */
export function getRandomDate(start${config.language === 'typescript' ? ': Date' : ''}, end${config.language === 'typescript' ? ': Date' : ''})${config.language === 'typescript' ? ': Date' : ''} {
  const startTime = start.getTime();
  const endTime = end.getTime();
  const randomTime = startTime + Math.random() * (endTime - startTime);
  return new Date(randomTime);
}

/**
 * Format date for display
 */
export function formatDate(date${config.language === 'typescript' ? ': Date' : ''}, locale${config.language === 'typescript' ? ': string' : ''} = 'en-US')${config.language === 'typescript' ? ': string' : ''} {
  return date.toLocaleDateString(locale);
}

/**
 * Format time for display
 */
export function formatTime(date${config.language === 'typescript' ? ': Date' : ''}, locale${config.language === 'typescript' ? ': string' : ''} = 'en-US')${config.language === 'typescript' ? ': string' : ''} {
  return date.toLocaleTimeString(locale);
}

/**
 * Format datetime for display
 */
export function formatDateTime(date${config.language === 'typescript' ? ': Date' : ''}, locale${config.language === 'typescript' ? ': string' : ''} = 'en-US')${config.language === 'typescript' ? ': string' : ''} {
  return date.toLocaleString(locale);
}

/**
 * Check if date is today
 */
export function isToday(date${config.language === 'typescript' ? ': Date' : ''})${config.language === 'typescript' ? ': boolean' : ''} {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

/**
 * Check if date is weekend
 */
export function isWeekend(date${config.language === 'typescript' ? ': Date' : ''})${config.language === 'typescript' ? ': boolean' : ''} {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

/**
 * Get age from birthdate
 */
export function getAge(birthDate${config.language === 'typescript' ? ': Date' : ''})${config.language === 'typescript' ? ': number' : ''} {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}`;

  return {
    path: `tests/utils/dateUtils.${ext}`,
    content,
    description: 'Date utility functions for test automation',
    category: 'util',
    language: config.language,
  };
}

function generateFakerUtils(config: PreviewConfiguration): ProjectFile {
  const ext = config.language === 'typescript' ? 'ts' : 'js';
  const importStatement = config.language === 'typescript'
    ? "import { faker } from '@faker-js/faker';"
    : "const { faker } = require('@faker-js/faker');";

  const content = `${importStatement}

/**
 * Faker utility functions for generating test data
 */

/**
 * Generate fake user data
 */
export function generateFakeUser() {
  return {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    phone: faker.phone.number(),
    avatar: faker.image.avatar(),
    birthDate: faker.date.birthdate(),
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: faker.location.country(),
    }
  };
}

/**
 * Generate fake product data
 */
export function generateFakeProduct() {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    category: faker.commerce.department(),
    brand: faker.company.name(),
    sku: faker.string.alphanumeric(8).toUpperCase(),
    inStock: faker.datatype.boolean(),
    rating: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
    reviews: faker.number.int({ min: 0, max: 1000 }),
    image: faker.image.url(),
  };
}

/**
 * Generate fake company data
 */
export function generateFakeCompany() {
  return {
    id: faker.string.uuid(),
    name: faker.company.name(),
    description: faker.company.catchPhrase(),
    website: faker.internet.url(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: faker.location.country(),
    },
    industry: faker.company.buzzNoun(),
  };
}

/**
 * Generate fake blog post data
 */
export function generateFakeBlogPost() {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(3),
    excerpt: faker.lorem.paragraph(),
    author: faker.person.fullName(),
    publishDate: faker.date.recent(),
    tags: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.lorem.word()),
    slug: faker.lorem.slug(),
    image: faker.image.url(),
  };
}

/**
 * Generate fake order data
 */
export function generateFakeOrder() {
  const itemCount = faker.number.int({ min: 1, max: 5 });
  const items = Array.from({ length: itemCount }, () => ({
    productId: faker.string.uuid(),
    name: faker.commerce.productName(),
    price: parseFloat(faker.commerce.price()),
    quantity: faker.number.int({ min: 1, max: 3 }),
  }));
  
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const shipping = 9.99;
  const total = subtotal + tax + shipping;

  return {
    id: faker.string.uuid(),
    orderNumber: faker.string.alphanumeric(8).toUpperCase(),
    customerId: faker.string.uuid(),
    status: faker.helpers.arrayElement(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
    items,
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    shipping: shipping,
    total: parseFloat(total.toFixed(2)),
    orderDate: faker.date.recent(),
    shippingAddress: {
      name: faker.person.fullName(),
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
    }
  };
}

/**
 * Generate fake credit card data (for testing only)
 */
export function generateFakeCreditCard() {
  return {
    number: faker.finance.creditCardNumber(),
    cvv: faker.finance.creditCardCVV(),
    issuer: faker.finance.creditCardIssuer(),
    expiryMonth: faker.date.future().getMonth() + 1,
    expiryYear: faker.date.future().getFullYear(),
  };
}

/**
 * Generate multiple fake records
 */
export function generateMultiple${config.language === 'typescript' ? '<T>' : ''}(generator${config.language === 'typescript' ? ': () => T' : ''}, count${config.language === 'typescript' ? ': number' : ''})${config.language === 'typescript' ? ': T[]' : ''} {
  return Array.from({ length: count }, generator);
}

/**
 * Seed faker for consistent test data
 */
export function seedFaker(seed${config.language === 'typescript' ? ': number' : ''} = 12345) {
  faker.seed(seed);
}`;

  return {
    path: `tests/utils/fakerUtils.${ext}`,
    content,
    description: 'Faker utility functions for generating test data',
    category: 'util',
    language: config.language,
  };
}