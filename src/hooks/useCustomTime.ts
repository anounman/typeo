
export const useCustomTime = () => {
    const [time, setTime] = useState<number>(30);
    
    return { time, setTime };
};