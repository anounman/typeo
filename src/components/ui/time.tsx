// import { useCustomTime } from "@/hooks/useCustomTime";

import { setTotalTimeOnLocalStorage } from "@/utils/global";

const Time = ({
  totalTime,
  setTotalTime,
}: {
  totalTime: number;
  setTotalTime: React.Dispatch<React.SetStateAction<number>>;
}) => {
  // const { time, setTime } = useCustomTime();
  const times = ["15", "30", "45", "60"];
  return (
    <div className="flex gap-2">
      {times.map((t) => (
        <button
          className={`${
            totalTime === parseInt(t) ? "text-yellow-500" : "text-slate-500"
          }`}
          key={t}
          onClick={() => {
            setTotalTime(parseInt(t));
            setTotalTimeOnLocalStorage(parseInt(t));
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );
};

export default Time;
