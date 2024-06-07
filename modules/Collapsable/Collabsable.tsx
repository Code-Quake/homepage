import React, { useEffect, useState, FC, PropsWithChildren, useRef } from "react";

export const Collapse: FC<PropsWithChildren<{ isExpanded: boolean }>> = ({
  isExpanded,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setContentHeight(ref.current.clientHeight);
    }
  }, [children]);

  return (
    <div
      className="collapse"
      style={{
        height: isExpanded ? contentHeight : 0,
      }}
    >
      <div ref={ref}>
        {children}
      </div>
    </div>
  );
};