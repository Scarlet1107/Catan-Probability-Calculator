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
        } absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-gray-800 text-white text-center rounded py-2 transition-opacity duration-300 pointer-events-none tooltip`}
      >
        {tooltipText}
        <span className="tooltip-arrow"></span>
      </span>
    </span>
  );
};

export default InfoTooltip;
