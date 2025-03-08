import { formateInput } from "../utils/helpers";
import { useEffect } from "react";
import Cursor from "./ui/cursor";

export const Typing = ({
  words,
  className,
  input,
  setInput,
}: {
  words: string;
  className?: string;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}) => {
  useEffect(() => {
    const wordsArray: Array<string> = words.split("");
    const inputArray: Array<string> = input.split("");

    // Reset all characters to default color first
    inputArray.forEach((_, index) => {
      const char = document.getElementById(`${index}`);
      if (char) char.className = " text-slate-500";
    });

    inputArray.forEach((inputChar, index) => {
      const char = document.getElementById(`${index}`);
      if (char) {
        // console.log(
        //   `inputChar: ${inputChar}, wordsArray[index]: ${wordsArray[index]} ${
        //     inputChar === wordsArray[index]
        //   }`
        // );
        if (inputChar === wordsArray[index]) {
          char.classList.replace("text-slate-500", "text-yellow-500");
        } else {
          char.classList.replace("text-slate-500", "text-red-500");
        }
      }
    });
  }, [input, words]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      formateInput(e, setInput);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setInput]);
  return (
    <div className={className}>
      {input.split("").map((char, index) => {
        return (
          <span id={index.toString()} key={index} className=" text-slate-500">
            {words[index]}
          </span>
        );
      })}
      <Cursor />
     </div>
  );
};
