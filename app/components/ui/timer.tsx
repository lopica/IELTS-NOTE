import { useEffect, useState } from "react";
import { formatTime } from "~/lib/utils";

export const Timer = () => {
  const [seconds, setSeconds] = useState(3600);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  let remainingMinute = formatTime(Math.trunc(seconds / 60));
  let remainingSecond = formatTime(seconds % 60);

  return (
    <div className="flex justify-center items-center gap-4 mb-4 text-3xl">
      <span>{remainingMinute}</span>
      <span>:</span>
      <span>{remainingSecond}</span>
    </div>
  );
};
