import React, { useEffect, useState } from "react";
import { differenceInSeconds, parseISO } from "date-fns";

interface CountdownProps {
  startDate: string;
  endDate: string;
  onExpire?: () => void;
}

const Countdown: React.FC<CountdownProps> = ({
  startDate,
  endDate,
  onExpire,
}) => {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isStarted: false,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      const isStarted = now >= start;
      const targetDate = isStarted ? end : start;
      const timeRemaining = differenceInSeconds(targetDate, now);

      if (timeRemaining < 0) {
        if (onExpire) onExpire();
        return;
      }

      const days = Math.floor(timeRemaining / (60 * 60 * 24));
      const hours = Math.floor((timeRemaining % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((timeRemaining % (60 * 60)) / 60);
      const seconds = timeRemaining % 60;

      setTime({ days, hours, minutes, seconds, isStarted });
    };

    const intervalId = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(intervalId);
  }, [startDate, endDate, onExpire]);

  return (
    <div className="countdown">
      {time.isStarted ? (
        <span>
          Ends in {time.days}d {time.hours}h {time.minutes}m {time.seconds}s
        </span>
      ) : (
        <span>
          Starts in {time.days}d {time.hours}h {time.minutes}m {time.seconds}s
        </span>
      )}
    </div>
  );
};

export default Countdown;
