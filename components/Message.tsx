'use client'
import React, { useEffect } from "react";

type MessageProps = {
  message: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
};
const Message = (props: MessageProps) => {
  const bannerRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (bannerRef.current) {
      // Clear previous text
      bannerRef.current.textContent = "";
    }
    if (props.inputRef.current) {
      props.inputRef.current.disabled = true;
    }
    let index = 0;
    const typeText = setInterval(() => {
      if (!bannerRef.current) {
        return;
      }
      bannerRef.current.insertAdjacentText(
        "beforeend",
        props.message[index++]
      );
      if (index === props.message.length) {
        clearInterval(typeText);
        if (props.inputRef.current) {
          props.inputRef.current.disabled = false;
          props.inputRef.current.focus();
        }
      }
    }, 30);
    return () => clearInterval(typeText); // Cleanup on unmount to prevent overlapping intervals
  }, [props.inputRef, props.message]);
  return (
    <div ref={bannerRef} className="terminal-welcome-message"></div>
  );
};

export default Message;
