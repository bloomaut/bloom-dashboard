import { useEffect, useRef } from "react";

export const useCloseDrop = (setOpen: (status: boolean) => void) => {
  const tagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeDrop = (e: MouseEvent) => {
      if (tagRef.current && !tagRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", closeDrop);

    return () => {
      window.removeEventListener("mousedown", closeDrop);
    };
  }, [setOpen]);

  return { tagRef };
};
