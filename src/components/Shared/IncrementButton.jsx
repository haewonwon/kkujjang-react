import React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons";

const IncrementButton = () => {
  const [count, setCount] = useState(0);

  const handleIncrease = () => {
    setCount(count + 1);
  };

  // 증감소 버튼 style CommonStyle에 있는지
  return (
    <button onClick={handleIncrease}>
      <FontAwesomeIcon icon={faCaretUp} />
    </button>
  );
};

export default IncrementButton;
