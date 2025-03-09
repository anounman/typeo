import { generateWords } from "@/utils/helpers";
import { useState, useCallback } from "react";





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