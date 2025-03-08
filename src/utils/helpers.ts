
export const formateInput = (e:KeyboardEvent , setInput : React.Dispatch<React.SetStateAction<string>>) => {      
    if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey && e.key !== 'Shift') {
        setInput((prev: string) => prev + e.key);
      }
      if(e.key === 'Backspace'){
        setInput((prev: string) => prev.slice(0, -1));
      }
}