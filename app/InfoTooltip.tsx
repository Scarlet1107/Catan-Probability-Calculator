// InfoTooltip.tsx

import React, { useState } from "react";

interface InfoTooltipProps {
  text: string;
  tooltipText: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ text, tooltipText }) => {
  const [visible, setVisible] = useState(false);

  const handleMouseEnter = () => {
    setVisible(true);
  };

  const handleMouseLeave = () => {
    setVisible(false);
  };

  return (
    <span
      className="relative inline-block cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {text}
      <span
        className={`${
          visible ? "opacity-100" : "opacity-0"
        } tooltip pointer-events-none absolute left-1/2 top-full mt-2 w-64 -translate-x-1/2 transform rounded bg-gray-800 py-2 text-center text-white transition-opacity duration-300`}
      >
        {tooltipText}
        <span className="tooltip-arrow"></span>
      </span>
    </span>
  );
};

export default InfoTooltip;
