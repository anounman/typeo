import { useState, useCallback } from "react";



const generateWords = (wordsCount: number) => {
    const nouns: Array<string> = ["bird", "clock", "boy", "plastic", "duck", "teacher", "old lady", "professor", "hamster", "dog"];
    const verbs: Array<string> = ["kicked", "ran", "flew", "dodged", "sliced", "rolled", "died", "breathed", "slept", "killed"];
    const adjectives: Array<string> = ["beautiful", "lazy", "professional", "lovely", "dumb", "rough", "soft", "hot", "vibrating", "slimy"];
    const adverbs: Array<string> = ["slowly", "elegantly", "precisely", "quickly", "sadly", "humbly", "proudly", "shockingly", "calmly", "passionately"];
    const preposition: Array<string> = ["down", "into", "up", "on", "upon", "below", "above", "through", "across", "towards"];


    const rand1 = Math.floor(Math.random() * (wordsCount));
    const rand3 = Math.floor(Math.random() * (wordsCount));
    const rand4 = Math.floor(Math.random() * (wordsCount));
    const rand2 = Math.floor(Math.random() * (wordsCount));
    const rand5 = Math.floor(Math.random() * (wordsCount));
    const rand6 = Math.floor(Math.random() * (wordsCount));
    //                const randCol = [rand1,rand2,rand3,rand4,rand5];
    //                const i = randGen();
    const content: string = "The " + adjectives[rand1] + " " + nouns[rand2] + " " + adverbs[rand3] + " " + verbs[rand4] + " because some " + nouns[rand1] + " " + adverbs[rand1] + " " + verbs[rand1] + " " + preposition[rand1] + " a " + adjectives[rand2] + " " + nouns[rand5] + " which, became a " + adjectives[rand3] + ", " + adjectives[rand4] + " " + nouns[rand6] + ".";
    return content;



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