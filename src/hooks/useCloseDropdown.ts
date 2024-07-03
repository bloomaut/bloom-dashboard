import { useCallback, useEffect, useRef, RefObject } from "react";

export const useCloseDropdown = (setOpen: (status: boolean) => void, buttonRef?: RefObject<HTMLButtonElement>) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Esc") {
        setOpen(false);
      }
    },
    [setOpen],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        (!buttonRef?.current || !buttonRef.current.contains(event.target as Node))
      ) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [setOpen, handleKeyUp, buttonRef]);

  return { dropdownRef };
};
