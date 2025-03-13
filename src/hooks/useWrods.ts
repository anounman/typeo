import { generateWords } from "@/utils/helpers";
import { useState, useCallback } from "react";




// nedd to pass one of thoes two values
export const useWords = (wordsCount: number, initialWords?: string) => {
    const [words, setWords] = useState<string>(initialWords ?? generateWords(wordsCount));

    const updateWords = useCallback(() => {
        setWords(initialWords ?? generateWords(wordsCount));
    }, [wordsCount, initialWords]);

    const updateGeneratedWords = useCallback((newWords: string) => {
        setWords((prev) => prev + " " + newWords);
    }, []);

    return { words, updateWords, updateGeneratedWords };
};