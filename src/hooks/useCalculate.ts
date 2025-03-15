import { useCallback, useEffect, useState } from "react";

export const useCalculate = (input: string, originalWrod: string, total_time: number) => {

    const [error, setError] = useState<number>(0);
    const calculateWords = useCallback(() => {
        let count: number = 0;

        input.split(" ").map((char) => {
            if (char !== " ") {
                count++;
            }
        });
        return count - 1;
    }, [input]);


    useEffect(() => {
        // Recalculate errors from scratch on each input change
        let currentErrors = 0;
        for (let index = 0; index < input.length; index++) {
            if (input[index] !== originalWrod[index]) {
                currentErrors++;
            }
        }
        setError(currentErrors);
    }, [input, originalWrod]);


    const calculateAccuracy = useCallback(() => {
        const totalCharacters = input.length;
        if (totalCharacters === 0) return 100;
        const accuracy = ((totalCharacters - error) / totalCharacters) * 100;
        return Math.max(0, Math.min(100, accuracy)); // Ensuring value is between 0 and 100
    }, [input, error]);


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
        // This function now just returns the current error count
        // since we're calculating it in the useEffect
        return error;
    }, [error]);


    return { calculateWords, calculateAccuracy, calculateWPM, calculateRawWords, calculateTheErros, error, setError };
}