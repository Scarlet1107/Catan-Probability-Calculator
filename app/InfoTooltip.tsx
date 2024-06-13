import React, { useState } from 'react';

interface InfoTooltipProps {
  text: string;
  tooltipText: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ text, tooltipText }) => {
  const [visible, setVisible] = useState(false);

  const handleToggle = () => {
    setVisible(!visible);
  };

  return (
    <span className="relative inline-block cursor-pointer text-blue-500" onClick={handleToggle}>
      {text}
      <span
        className={`${
          visible ? 'opacity-100' : 'opacity-0'
        } absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-black text-white text-center rounded py-2 transition-opacity duration-300 pointer-events-none`}
      >
        {tooltipText}
      </span>
    </span>
  );
};

export default InfoTooltip;
