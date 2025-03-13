import { Room } from "@/types/type";
import { useState } from "react";

// Make the hook generic to accept any function type
const useSocket = <P extends unknown[], R extends Promise<void | Room>>(
    callBack: (...args: P) => R
) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Create a wrapper function that accepts the same parameters
    const fn = async (...args: P): Promise<void | Room> => {
        setLoading(true);
        setError(null);

        try {
            const result = await callBack(...args);
            setError(null);
            return result;
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : String(error));
        } finally {
            setLoading(false);
        }
    };

    return { fn, loading, error };
};

export default useSocket;