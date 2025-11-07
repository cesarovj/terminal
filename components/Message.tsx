'use client'
import React from "react";

type MessageProps = {
  inputRef: React.RefObject<HTMLInputElement | null>;
};
const Message = (props: MessageProps) => {
  const bannerRef = React.useRef<HTMLDivElement>(null);

  return (
    <div ref={bannerRef} className="terminal-welcome-message">
      Type <span className="terminal-glow">'help'</span> to view a list of available commmands. You can type a few letters and press <span className="terminal-glow">[tab]</span> to autocomplete.
    </div>
  );
};

export default Message;
