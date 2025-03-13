import Cursor from "./ui/cursor";

export const Typing = ({
  words,
  className,
  input,
  cursorColor,
}: {
  words: string;
  className?: string;
  input: string;
  cursorColor?: string;
}) => {
  return (
    <div className={`${className}`}>
      {input.split("").map((_char, index) => {
        return (
          <span id={index.toString()} key={index} className="text-slate-500">
            {words.split("")[index]}
          </span>
        );
      })}
      <Cursor color={cursorColor}/>
    </div>
  );
};
