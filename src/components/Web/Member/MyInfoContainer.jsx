import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FlexBox } from "@/styles/FlexStyle";

// ===== hooks import =====
import useAxios from "@/hooks/useAxios";

// ===== components import ======
import Button from "@/components/Web/Shared/Buttons/Button";
import Avartar from "@/assets/images/avatar.png";
import WebModal from "@/components/Web/Shared/Modal/WebModal";
import { faL, faWon } from "@fortawesome/free-solid-svg-icons";

// ===== style ======
const InfoFlexBox = styled(FlexBox)`
  width: ${(props) => props.width || "fit-content"};
  height: ${(props) => props.height || "fit-content"};
`;
const InfoBox = styled.div`
  width: ${(props) => props.width || "fit-content"};
  height: ${(props) => props.height || "fit-content"};
  border: ${(props) => props.border || null};
  margin-left: ${(props) => props.marginLeft || null};
  margin-right: ${(props) => props.marginRight || null};
`;
const InfoImg = styled.img``;
const InfoLinkButton = styled.a`
  width: ${(props) => props.width || "fit-content"};
  color: ${(props) => props.color || "#929292"};
  font-size: ${(props) => props.fontSize || "18px"};
`;
const InfoText = styled.p`
  color: ${(props) => props.color || "#5C5447"};
  font-size: ${(props) => props.fontSize || "24px"};
  margin-top: 0;
  margin-bottom: 0;
  margin-left: ${(props) => props.marginLeft || "0"};
`;
const InfoInput = styled.input`
  width: ${(props) => props.width || "390px"};
  color: ${(props) => props.color || "#5C5447"};
  font-size: ${(props) => props.fontSize || "24px"};
  margin-left: ${(props) => props.marginLeft || "0"};
  background-color: transparent;
  border: 0;
`;
const Table = styled.table`
  margin-left: ${(props) => props.marginLeft || "0"};
`;

// ===== component ======
const MyInfoContainer = () => {
  // === ref ===
  const inputRef = useRef(null);

  // === cookie ===
  const [cookies, , removeCookie] = useCookies(["sessionId"]);

  // === state ===
  const [editMode, setEditMode] = useState(false); // 수정 버튼 클릭됐는지 state
  const [userData, setUserData] = useState([]); // 백엔드 state
  const [nickname, setNickname] = useState(""); // 닉네임 state
  const [avatarAccessoryIndex, setAvatarAccessoryIndex] = useState(""); // 아바타 인덱스 state
  // (modal 관련)
  const [nicknameModalOpen, setNicknameModalOpen] = useState(false); // 닉네임 변경 실패 modal state
  const [message, setMessage] = useState(""); // 닉네임 modal 의 message 설정 state
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false); // 탈퇴 확인 modal state
  const [failModalOpen, setFailModalOpen] = useState(false); // 통신 실패 modal state
  // (api 관련)
  // 프로필 조회 API 호출
  const [apiConfig, setApiConfig] = useState({
    method: "get",
    url: "/user/me",
    headers: { sessionId: cookies.sessionId }
  });
  const { response, loading, error, fetchData } = useAxios(apiConfig);

  // === navigate ===
  const navigate = useNavigate();

  useEffect(() => {
    if (apiConfig !== null) {
      fetchData();
    }
  }, [apiConfig]);

  useEffect(() => {
    if (response !== null) {
      if (apiConfig?.url.startsWith("/user/me")) {
        // 프로필 조회 성공 시
        setUserData(response.result);
        setNickname(response.result.nickname);
        setAvatarAccessoryIndex(response.result.avatarAccessoryIndex);
      } else if (apiConfig?.url.startsWith("/user")) {
        if (apiConfig?.method === "delete") {
          // 회원 탈퇴 성공 시
          removeCookie("sessionId", { path: "/" });
          if (cookies?.userRole) {
            removeCookie("userRole", { path: "/" });
          }
          if (cookies?.userId) {
            removeCookie("userId", { path: "/" });
          }
          if (cookies?.smsAuthId) {
            removeCookie("smsAuthId", { path: "/" });
          }
          if (cookies?.passwordChangeAuthId) {
            removeCookie("passwordChangeAuthId", { path: "/" });
          }
          // 홈으로 이동
          navigate(`/`);
        } else if (apiConfig?.method === "put") {
          return;
        }
      }
    } else if (error) {
      if (apiConfig?.url.startsWith("/user/me")) {
        setNicknameModalOpen(true);
        setMessage(error);
      } else if (apiConfig?.url.startsWith("/user")) {
        if (apiConfig?.method === "delete") {
          setFailModalOpen(true);
        } else if (apiConfig?.method === "put") {
          setFailModalOpen(true);
        }
      }
    }
  }, [response, error]);

  // 수정 버튼 눌렀을 때
  const handleClickEditButton = () => {
    setEditMode(true);
  };

  // 확인 버튼 눌렀을 때
  const handleClickSaveButton = () => {
    const ninknameRegex = /^[a-zA-Z0-9가-힣]{1,15}$/;

    if (nickname.trim() === "") {
      setNicknameModalOpen(true);
      setMessage("닉네임을 입력해 주세요.");
    } else if (!ninknameRegex.test(nickname)) {
      setNicknameModalOpen(true);
      setMessage("닉네임을 확인해 주세요.");
    } else {
      setEditMode(false);
    }

    // 회원 정보 수정 API 코드
    setApiConfig({
      method: "put",
      url: "/user",
      headers: { sessionId: cookies.sessionId },
      data: {
        avatarAccessoryIndex: avatarAccessoryIndex,
        nickname: nickname
      }
    });
  };

  // 취소 버튼 눌렀을 때
  const handleClickCancelButton = () => {
    const ninknameRegex = /^[a-zA-Z0-9가-힣]{1,15}$/;

    if (nickname.trim() === "") {
      console.log("닉네임 변경 1");
      setNicknameModalOpen(true);
      setMessage("닉네임을 입력해 주세요.");
    } else if (!ninknameRegex.test(nickname)) {
      console.log("닉네임 변경 2");
      setNicknameModalOpen(true);
      setMessage("닉네임을 확인해 주세요.");
    } else {
      setEditMode(false);
    }
  };

  // 탈퇴 버튼 눌렀을 때
  const handleClickWithdrawal = () => {
    // 탈퇴 확인 modal 띄우기
    setWithdrawalModalOpen(true);
  };

  // 수정 상태일 때 input에 focus 주기
  useEffect(() => {
    if (editMode) {
      inputRef.current.focus();
    }
  }, [editMode]);

  // 수정 상태일 때 원래 닉네임 가져오기
  const handleInputChange = (e) => {
    setNickname(e.target.value);
  };

  // modal 관련 이벤트
  const handleModalOpen = () => {
    if (nicknameModalOpen == true) {
      setNicknameModalOpen(false);
    } else {
      setWithdrawalModalOpen(false);
    }
  };

  // modal 내 확인(탈퇴하기) 버튼 눌렀을 때
  // 회원 탈퇴 API 코드
  const handleWithdrawal = () => {
    setApiConfig({
      method: "delete",
      headers: { sessionId: cookies.sessionId },
      url: "/user"
    });
  };

  return (
    <>
      {nicknameModalOpen && (
        <WebModal onClick={handleModalOpen} hasButton={true}>
          {message}
        </WebModal>
      )}

      {withdrawalModalOpen && (
        <WebModal
          onClick={handleModalOpen}
          handleWithdrawal={handleWithdrawal}
          hasButton={true}
          isWithdrawal={true}
        >
          정말 탈퇴하시겠습니까?
        </WebModal>
      )}

      {failModalOpen && (
        <WebModal onClick={handleModal} hasButton={true}>
          요청이 올바르지 않습니다.
        </WebModal>
      )}

      <InfoBox marginLeft="auto" marginRight="auto">
        <InfoFlexBox>
          {/* 아바타 img */}
          <InfoBox border="1px solid #000000">
            <InfoImg src={Avartar} />
          </InfoBox>

          <Table marginLeft="80px">
            <tbody>
              {/* 닉네임 출력부 */}
              <tr>
                <td>
                  <InfoText>닉네임</InfoText>
                </td>
                <td>
                  <>
                    {editMode ? (
                      <InfoInput
                        type="text"
                        value={nickname}
                        onChange={handleInputChange}
                        ref={inputRef}
                        placeholder="1~15자의 영어, 한글, 숫자만 입력 가능"
                        marginLeft="100px"
                      />
                    ) : (
                      <InfoText color="#32250F" marginLeft="100px">
                        {nickname}
                      </InfoText>
                    )}
                  </>
                </td>
              </tr>

              {/* 레벨 출력부 */}
              <tr>
                <td>
                  <InfoText>레벨</InfoText>
                </td>
                <td>
                  <InfoText color="#32250F" marginLeft="100px">
                    {userData.level}
                  </InfoText>
                </td>
              </tr>

              {/* 승률 출력부 */}
              <tr>
                <td>
                  <InfoText>승률</InfoText>
                </td>
                <td>
                  <InfoText color="#32250F" marginLeft="100px">
                    {userData.winRate}
                  </InfoText>
                </td>
              </tr>
            </tbody>
          </Table>
        </InfoFlexBox>
        <InfoFlexBox col="center" row="between" width="1000px">
          <InfoLinkButton onClick={handleClickWithdrawal}>회원 탈퇴</InfoLinkButton>
          {/* 버튼 */}
          {editMode ? (
            <>
              {
                <InfoFlexBox row="between" width="200px">
                  <Button
                    type="smallDark"
                    message="확인"
                    onClick={handleClickSaveButton}
                  />
                  <Button
                    type="smallGray"
                    message="취소"
                    onClick={handleClickCancelButton}
                  />
                </InfoFlexBox>
              }
            </>
          ) : (
            <Button type="smallDark" message="수정" onClick={handleClickEditButton} />
          )}
        </InfoFlexBox>
      </InfoBox>
    </>
  );
};

MyInfoContainer.propTypes = {};

export default MyInfoContainer;
