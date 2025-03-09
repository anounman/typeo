export const TOTAL_TIME_KEY = 'typeo_total_time';
export const WORDS_LENGTH_KEY = 'typeo_words_length';

// Default values
export const DEFAULT_TOTAL_TIME = 30;
export const DEFAULT_WORDS_LENGTH = 10;

// Get values from localStorage or use defaults
export const getTotalTime = (): number => {
    const stored = localStorage.getItem(TOTAL_TIME_KEY);
    return stored ? parseInt(stored, 10) : DEFAULT_TOTAL_TIME;
};

export const getWordsLength = (): number => {
    const stored = localStorage.getItem(WORDS_LENGTH_KEY);
    return stored ? parseInt(stored, 10) : DEFAULT_WORDS_LENGTH;
};

// Set values to localStorage
export const setTotalTimeOnLocalStorage = (time: number): void => {
    localStorage.setItem(TOTAL_TIME_KEY, time.toString());
};

export const setWordsLengthOnLocalStorage = (length: number): void => {
    localStorage.setItem(WORDS_LENGTH_KEY, length.toString());
};

// For convenience, export current values
export const TOTAL_TIME = getTotalTime();
export const BASE_WORDS_LENGTH = getWordsLength();