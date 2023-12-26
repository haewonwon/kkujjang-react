import React from "react";
import { useState, useEffect } from "react";

import ExitMiniCircle from "../styles/CommonStyle";
import ModalWrapper from "./ModalStyle.jsx";
import ModalHeader from "./ModalStyle.jsx";
// import ModalContent from "./ModalStyle.jsx";
import ModalMessage from "./ModalStyle.jsx";

const [alertMessage, setAlertMessage] = useState("");

useEffect(() => {
  // 백엔드 통신 코드가 작성될 부분
  // 임시 데이터
  const data = { alertMessage: "회원 정보를 확인해 주세요." };
  setAlertMessage(data.alertMessage);
});

const Modal = (props) => {
  const { onClick } = props;

  return (
    <ModalWrapper onClick={onClick}>
      <ModalHeader>
        <ExitMiniCircle></ExitMiniCircle>
      </ModalHeader>
      <ModalMessage>{alertMessage}</ModalMessage>
    </ModalWrapper>
  );
};

export default Modal;
