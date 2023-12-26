import React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

const DecrementButton = () => {
  const [count, setCount] = useState(0);

  const handleDecrease = () => {
    setCount(count - 1);
  };

  // 증감소 버튼 style CommonStyle에 있는지
  return (
    <button onClick={handleDecrease}>
      <FontAwesomeIcon icon={faCaretDown} />
    </button>
  );
};

export default DecrementButton;
