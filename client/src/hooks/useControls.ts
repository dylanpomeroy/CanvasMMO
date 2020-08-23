import { useRef, useEffect } from "react";

export const useControls = () => {
  const leftDown = useRef<boolean>(false);
  const rightDown = useRef<boolean>(false);
  const upDown = useRef<boolean>(false);
  const downDown = useRef<boolean>(false);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  });

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.keyCode === 39) {
      rightDown.current = true;
    } else if (event.keyCode === 38) {
      upDown.current = true;
    } else if (event.keyCode === 37) {
      leftDown.current = true;
    } else if (event.keyCode === 40) {
      downDown.current = true;
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.keyCode === 39) {
      rightDown.current = false;
    } else if (event.keyCode === 38) {
      upDown.current = false;
    } else if (event.keyCode === 37) {
      leftDown.current = false;
    } else if (event.keyCode === 40) {
      downDown.current = false;
    }
  };

  return {
    left: leftDown,
    right: rightDown,
    up: upDown,
    down: downDown,
  };
};
