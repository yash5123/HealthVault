import { useEffect, useState } from "react";

export default function useAnimatedCounter(target, duration = 800) {

  const [value, setValue] = useState(0);

  useEffect(() => {

    let start = 0;

    const increment = target / (duration / 16);

    const interval = setInterval(() => {

      start += increment;

      if (start >= target) {

        setValue(target);
        clearInterval(interval);

      } else {

        setValue(Math.floor(start));

      }

    }, 16);

    return () => clearInterval(interval);

  }, [target, duration]);

  return value;

}