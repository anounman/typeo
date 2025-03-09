import { useCursorTracking } from "@/hooks/useCursorTracking";
import { CursorOverlay } from "./ui/cursor-overlay";

export const Typing = ({
  words,
  className,
  input,
  totalTime,
  timeLeft,
}: {
  words: string;
  className?: string;
  input: string;
  totalTime: number;
  timeLeft: number;
}) => {
  const { allCursors } = useCursorTracking(input, words, totalTime - timeLeft);

  return (
    <div className={`${className}`}>
      {input.split("").map((_char, index) => {
        return (
          <span id={index.toString()} key={index} className="text-slate-500">
            {words.split("")[index]}
          </span>
        );
      })}
      {/* <Cursor /> */}
      <CursorOverlay cursors={allCursors} />
    </div>
  );
};
