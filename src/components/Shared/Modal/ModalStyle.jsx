import styled from "styled-components";

export const ModalWrapper = styled.div`
  width: ${(props) => props.width || "36.375rem"};
  height: ${(props) => props.height || "20.0625rem"};
  border-radius: ${(props) => props.borderRadius || null};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const ModalHeader = styled.header`
  width: ${(props) => props.width || "36.375rem"};
  height: ${(props) => props.height || "2.25rem"};
  background-color: ${({ theme }) => theme.colors.gray200};
`;

export const ModalMessage = styled.p`
  width: ${(props) => props.width || "fit-content"};
  height: ${(props) => props.height || "fit-content"};
  text-align: center;
`;

// export const ModalContent = styled.div``;
