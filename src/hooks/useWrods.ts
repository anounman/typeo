import { faker } from "@faker-js/faker";
import { useState, useCallback } from "react";

const generateWords = (wordsCount: number) => {
    return faker.lorem.words(wordsCount);
}

export const useWords = (wordsCount: number) => {
    const [words, setWords] = useState<string>(generateWords(wordsCount));

    const updateWords = useCallback(() => {
        setWords(generateWords(wordsCount));
    }, [wordsCount]);

    const updateGeneratedWords = useCallback((newWords: string) => {
        setWords((prev) => prev + " " + newWords);
    }, []);

    return { words, updateWords, updateGeneratedWords };
};