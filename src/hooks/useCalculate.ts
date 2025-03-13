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
        let correct = 0;
        for (let i = 0; i < input.length; i++) {
            if (input[i] === originalWrod[i]) correct++;
        }
        return input.length > 0 ? (correct / input.length) * 100 : 100;
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


    const calculateTheErros = useCallback(() => {
        let count: number = 0;
        for (let index = 0; index < input.length; index++) {
            if (input[index] !== originalWrod[index]) {
                count++;
            }
        }
        return count;
    }, [input, originalWrod]);


    return { calculateWords, calculateAccuracy, calculateWPM, calculateRawWords, calculateTheErros };
}