import { useCallback } from "react";

export const useCalculate = (input: string, originalWrod: string, total_time: number) => {
    const calculateWords = useCallback(() => {
        let count: number = 0;

        input.split(" ").map((char) => {
            if (char !== " ") {
                count++;
            }
        });
        return count - 1;
    }, [input]);


    const calculateAccuracy = useCallback(() => {
        let count: number = 0;
        console.log(`input length : ${input.length}`);

        input.split("").map((word, index) => {
            if (word === originalWrod.split("")[index]) {
                count++;
            }
        });
        const result = (count / input.length) * 100;
        return Number.isNaN(result) ? 0 : result;
    }, [input, originalWrod]);


    const calculateWPM = useCallback(() => {
        const totalAvgWords = (input.length / 5) * 60 / total_time;

        return Number.isNaN(totalAvgWords) ? 0 : totalAvgWords;
    }, [input, total_time]);
    const calculateRawWords = useCallback(() => {
        let count: number = 0;
        input.split(" ").map((word, index) => {
            if (word === originalWrod.split(" ")[index]) {
                count++;
            }
        });
        return count;
    }, [input, originalWrod]);

    return { calculateWords, calculateAccuracy, calculateWPM, calculateRawWords };
}