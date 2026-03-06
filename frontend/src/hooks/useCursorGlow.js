import { useEffect } from "react";

export function useCursorGlow() {

  useEffect(() => {

    const glow = document.querySelector(".dashboard-cursor-glow");

    function handleMove(e) {

      if (!glow) return;

      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";

    }

    window.addEventListener("mousemove", handleMove);

    return () => {

      window.removeEventListener("mousemove", handleMove);

    };

  }, []);

}