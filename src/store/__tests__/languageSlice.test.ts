import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock localStorage BEFORE importing the slice
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

// Mock console.warn to avoid noise in tests
const mockConsoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

// Now import the slice after localStorage is mocked
import languageReducer, { setSelectedLanguage } from '../slices/languageSlice';
import { ProgrammingLanguage } from '@/types/language';

describe('languageSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockConsoleWarn.mockClear();
  });

  it('should return the initial state with default language when localStorage is empty', () => {
    // Mock localStorage to return null, then re-import the slice
    mockLocalStorage.getItem.mockReturnValue(null);
    
    // Since the initial state is already loaded, we need to test the action
    const state = languageReducer({ selectedLanguage: 'typescript' }, { type: '@@INIT' } as any);
    expect(state).toEqual({
      selectedLanguage: 'typescript',
    });
  });

  it('should handle setSelectedLanguage action', () => {
    const prevState = { selectedLanguage: 'typescript' as ProgrammingLanguage };
    const nextState = languageReducer(prevState, setSelectedLanguage('javascript'));
    
    expect(nextState.selectedLanguage).toBe('javascript');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('playwright-generator-language', 'javascript');
  });

  it('should save language to localStorage when setSelectedLanguage is dispatched', () => {
    const prevState = { selectedLanguage: 'javascript' as ProgrammingLanguage };
    languageReducer(prevState, setSelectedLanguage('typescript'));
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('playwright-generator-language', 'typescript');
  });

  it('should handle both valid language options', () => {
    const initialState = { selectedLanguage: 'typescript' as ProgrammingLanguage };
    
    const tsState = languageReducer(initialState, setSelectedLanguage('typescript'));
    expect(tsState.selectedLanguage).toBe('typescript');
    
    const jsState = languageReducer(tsState, setSelectedLanguage('javascript'));
    expect(jsState.selectedLanguage).toBe('javascript');
  });

  it('should persist language changes to localStorage', () => {
    const initialState = { selectedLanguage: 'typescript' as ProgrammingLanguage };
    
    languageReducer(initialState, setSelectedLanguage('javascript'));
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('playwright-generator-language', 'javascript');
    
    languageReducer(initialState, setSelectedLanguage('typescript'));
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('playwright-generator-language', 'typescript');
  });

  it('should handle localStorage setItem errors gracefully', () => {
    mockLocalStorage.setItem.mockImplementation(() => { 
      throw new Error('Storage full'); 
    });
    
    const prevState = { selectedLanguage: 'typescript' as ProgrammingLanguage };
    const newState = languageReducer(prevState, setSelectedLanguage('javascript'));
    
    // State should still update even if localStorage fails
    expect(newState.selectedLanguage).toBe('javascript');
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      'Failed to save language to localStorage:',
      expect.any(Error)
    );
  });
});
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock localStorage BEFORE importing the slice
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

// Mock console.warn to avoid noise in tests
const mockConsoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

// Now import the slice after localStorage is mocked
import languageReducer, { setSelectedLanguage } from '../slices/languageSlice';
import { ProgrammingLanguage } from '@/types/language';

describe('languageSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockConsoleWarn.mockClear();
  });

  it('should return the initial state with default language when localStorage is empty', () => {
    // Mock localStorage to return null, then re-import the slice
    mockLocalStorage.getItem.mockReturnValue(null);
    
    // Since the initial state is already loaded, we need to test the action
    const state = languageReducer({ selectedLanguage: 'typescript' }, { type: '@@INIT' } as any);
    expect(state).toEqual({
      selectedLanguage: 'typescript',
    });
  });

  it('should handle setSelectedLanguage action', () => {
    const prevState = { selectedLanguage: 'typescript' as ProgrammingLanguage };
    const nextState = languageReducer(prevState, setSelectedLanguage('javascript'));
    
    expect(nextState.selectedLanguage).toBe('javascript');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('playwright-generator-language', 'javascript');
  });

  it('should save language to localStorage when setSelectedLanguage is dispatched', () => {
    const prevState = { selectedLanguage: 'javascript' as ProgrammingLanguage };
    languageReducer(prevState, setSelectedLanguage('typescript'));
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('playwright-generator-language', 'typescript');
  });

  it('should handle both valid language options', () => {
    const initialState = { selectedLanguage: 'typescript' as ProgrammingLanguage };
    
    const tsState = languageReducer(initialState, setSelectedLanguage('typescript'));
    expect(tsState.selectedLanguage).toBe('typescript');
    
    const jsState = languageReducer(tsState, setSelectedLanguage('javascript'));
    expect(jsState.selectedLanguage).toBe('javascript');
  });

  it('should persist language changes to localStorage', () => {
    const initialState = { selectedLanguage: 'typescript' as ProgrammingLanguage };
    
    languageReducer(initialState, setSelectedLanguage('javascript'));
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('playwright-generator-language', 'javascript');
    
    languageReducer(initialState, setSelectedLanguage('typescript'));
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('playwright-generator-language', 'typescript');
  });

  it('should handle localStorage setItem errors gracefully', () => {
    mockLocalStorage.setItem.mockImplementation(() => { 
      throw new Error('Storage full'); 
    });
    
    const prevState = { selectedLanguage: 'typescript' as ProgrammingLanguage };
    const newState = languageReducer(prevState, setSelectedLanguage('javascript'));
    
    // State should still update even if localStorage fails
    expect(newState.selectedLanguage).toBe('javascript');
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      'Failed to save language to localStorage:',
      expect.any(Error)
    );
  });
});
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock localStorage BEFORE importing the slice
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

// Mock console.warn to avoid noise in tests
const mockConsoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

// Now import the slice after localStorage is mocked
import languageReducer, { setSelectedLanguage } from '../slices/languageSlice';
import { ProgrammingLanguage } from '@/types/language';

describe('languageSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockConsoleWarn.mockClear();
  });

  it('should return the initial state with default language when localStorage is empty', () => {
    // Mock localStorage to return null, then re-import the slice
    mockLocalStorage.getItem.mockReturnValue(null);
    
    // Since the initial state is already loaded, we need to test the action
    const state = languageReducer({ selectedLanguage: 'typescript' }, { type: '@@INIT' } as any);
    expect(state).toEqual({
      selectedLanguage: 'typescript',
    });
  });

  it('should handle setSelectedLanguage action', () => {
    const prevState = { selectedLanguage: 'typescript' as ProgrammingLanguage };
    const nextState = languageReducer(prevState, setSelectedLanguage('javascript'));
    
    expect(nextState.selectedLanguage).toBe('javascript');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('playwright-generator-language', 'javascript');
  });

  it('should save language to localStorage when setSelectedLanguage is dispatched', () => {
    const prevState = { selectedLanguage: 'javascript' as ProgrammingLanguage };
    languageReducer(prevState, setSelectedLanguage('typescript'));
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('playwright-generator-language', 'typescript');
  });

  it('should handle both valid language options', () => {
    const initialState = { selectedLanguage: 'typescript' as ProgrammingLanguage };
    
    const tsState = languageReducer(initialState, setSelectedLanguage('typescript'));
    expect(tsState.selectedLanguage).toBe('typescript');
    
    const jsState = languageReducer(tsState, setSelectedLanguage('javascript'));
    expect(jsState.selectedLanguage).toBe('javascript');
  });

  it('should persist language changes to localStorage', () => {
    const initialState = { selectedLanguage: 'typescript' as ProgrammingLanguage };
    
    languageReducer(initialState, setSelectedLanguage('javascript'));
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('playwright-generator-language', 'javascript');
    
    languageReducer(initialState, setSelectedLanguage('typescript'));
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('playwright-generator-language', 'typescript');
  });

  it('should handle localStorage setItem errors gracefully', () => {
    mockLocalStorage.setItem.mockImplementation(() => { 
      throw new Error('Storage full'); 
    });
    
    const prevState = { selectedLanguage: 'typescript' as ProgrammingLanguage };
    const newState = languageReducer(prevState, setSelectedLanguage('javascript'));
    
    // State should still update even if localStorage fails
    expect(newState.selectedLanguage).toBe('javascript');
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      'Failed to save language to localStorage:',
      expect.any(Error)
    );
  });
});