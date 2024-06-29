import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import PropTypes from "prop-types";

import {
  userInfoState,
  waitingPlayerListState,
  playingPlayerListState
} from "@/recoil/userState";
import { roomIdState, roomInfoListState, roomInfoState } from "@/recoil/roomState";
import { bgVolumeState, fxVolumeState } from "@/recoil/soundState";
import { remoteApiConfigState } from "@/recoil/boardState";
import VolumeControl from "./VolumeControl";
import Profile from "./Profile";
import ValidationMessage from "@/components/Web/Shared/Form/ValidationMessage";
import {
  GameModalBackground,
  GameModalContent,
  GameModalHeader,
  GameModalBody,
  GameModalMessage,
  GameModalLongMessage,
  GameModalButton,
  GameModalSelect,
  GameModalInputWrapper,
  GameModalInput,
  ArrowIconImage,
  ExitMiniCircle,
  Table,
  Tbody,
  Tr,
  TdLabel,
  TdContent,
  ButtonWrapper,
  Label,
  Textarea
} from "./GameModalStyle";
import leftArrow from "@/assets/images/left-arrow.png";
import rightArrow from "@/assets/images/right-arrow.png";
import avatar from "@/assets/images/avatar.png";
import AvatarCanvas from "../Shared/AvatarCanvas";
import {
  createRoom,
  changeRoomConfig,
  leaveRoom,
  joinRoom,
  loadRoom
} from "@/services/socket";
import useAxios from "@/hooks/useAxios";
import { updateCurrentUserAvatar } from "@/services/user";
import { NICKNAME_REGEX, SPECIAL_CHARACTERS_REGEX } from "@/services/regexp";

const GameModal = ({
  type,
  setType,
  isOpen,
  setIsOpen,
  setIsPlaying,
  userId,
  roomId,
  height = "",
  children
}) => {
  // ====== room ======
  const [roomInfoList, setRoomInfoList] = useRecoilState(roomInfoListState);
  const [roomInfo, setRoomInfo] = useRecoilState(roomInfoState);
  const setRoomId = useSetRecoilState(roomIdState);
  const setWaitingPlayerList = useSetRecoilState(waitingPlayerListState);
  const [playingPlayerList, setPlayingPlayerList] =
    useRecoilState(playingPlayerListState);
  const setRemoteApiConfig = useSetRecoilState(remoteApiConfigState);
  const [roomNumber, setRoomNumber] = useState(null);

  const [bgCurrVolume, setBgCurrVolume] = useRecoilState(bgVolumeState);
  const [fxCurrVolume, setFxCurrVolume] = useRecoilState(fxVolumeState);
  const [user, setUser] = useRecoilState(userInfoState);
  const [isTitleEmpty, setIsTitleEmpty] = useState(false);
  const [password, setPassword] = useState("");
  const [isCorrectPassword, setIsCorrectPassword] = useState(true);
  const [avatarImage, setAvatarImage] = useState(null);
  const [currAvatar, setCurrAvatar] = useState(0);
  const [isProfileEditMode, setIsProfileEditMode] = useState(null);

  const [errorSource, setErrorSource] = useState(null);
  const [modalMessage, setModalMessage] = useState("");

  const [cookies, setCookie] = useCookies(["sessionId", "userId"]);
  const [apiConfig, setApiConfig] = useState(null);
  const { response, loading, error, fetchData } = useAxios(apiConfig, false);

  // router
  const navigate = useNavigate();
  const { pathname } = useLocation();
  let titleText = "";

  switch (type) {
    case "alert":
      titleText = "경고";
      height !== "" ? height : "14rem";
      break;
    case "alarm":
      titleText = "안내";
      height = "14rem";
      break;
    case "avatar":
      titleText = "아바타 설정하기";
      height = "21rem";
      break;
    case "password":
      height = "17.75rem";
      break;
    case "room":
      titleText = !roomId ? "방 만들기" : "방 설정";
      height = "28rem";
      break;
    case "profile":
      titleText = !isProfileEditMode ? "프로필" : "프로필 수정";
      height = "15rem";
      break;
    case "report":
      titleText = "신고하기";
      height = "29.9rem";
      break;
    case "setting":
      titleText = "환경설정";
      height = "19rem";
      break;
    case "help":
      titleText = "도움말";
      height = "25.625rem";
      break;
    case "result":
      titleText = "게임 결과";
      height = "20rem";
      break;
    case "error":
      titleText = "오류";
      height !== "" ? height : "18rem";
      break;
  }

  const accessories = [
    "",
    "emo1",
    "emo2",
    "eye1",
    "eye2",
    "eye3",
    "head1",
    "head2",
    "fx1",
    "fx2"
  ];

  useEffect(() => {
    if (type === "room" && !roomId) {
      setRoomInfo({
        title: "",
        password: "",
        maxUserCount: 8,
        maxRound: 5,
        roundTimeLimit: 90000
      });
    }
  }, []);

  useEffect(() => {
    if (apiConfig !== null) {
      fetchData();
    }
  }, [apiConfig]);

  useEffect(() => {
    if (response !== null) {
      if (type === "report") {
        setType("alarm");
        setModalMessage("신고가 등록되었습니다.");
      }
    }
  }, [response]);

  // roomInfo -> roomInfoList
  useEffect(() => {
    if (roomInfo?.id) {
      if (roomInfoList.some((room) => room.id === roomInfo.id)) {
        // 방 정보 PUT API 호출
        setRoomInfoList((prev) =>
          prev.map((room) => (room.id === roomInfo.id ? { ...room, ...roomInfo } : room))
        );
      } else {
        // 방 정보 POST API 호출
        setRoomInfoList((prev) => [...prev, { ...roomInfo }]);
      }
    }
  }, [roomInfo]);

  useEffect(() => {
    if (roomNumber !== null) {
      setIsOpen(false);
      navigate(`/game/${roomNumber}`);
    }
  }, [roomNumber]);

  useEffect(() => {
    if (roomId && roomId !== roomInfo?.id) {
      setRoomInfo({
        title: "",
        password: "",
        currentUserCount: 1,
        maxUserCount: 8,
        maxRound: 5,
        roundTimeLimit: 90,
        state: "preparing"
      });
    }
  }, [roomId, roomInfo?.id]);

  const onConfirmAvatarUrl = async () => {
    if (
      user.nickname === "" ||
      user.avatarUrl === "" ||
      !NICKNAME_REGEX.test(user.nickname)
    )
      return;

    const res = await updateCurrentUserAvatar(user.avatarUrl, user.nickname);

    if (res) {
      setUser((prev) => ({
        ...prev,
        avatarUrl: user.avatarUrl,
        nickname: user.nickname
      }));
      setRemoteApiConfig({
        method: "get",
        url: "/user/me",
        headers: { sessionId: cookies.sessionId }
      });
      setIsOpen(false);
    }
  };

  // ====== report ======
  const onReportSubmit = (e) => {
    e.preventDefault();

    setApiConfig({
      method: "post",
      url: "/report",
      headers: {
        sessionId: cookies.sessionId
      },
      data: {
        nickname: user.nickname,
        isOffensive: e.target.isOffensive.checked,
        isPoorManner: e.target.isPoorManner.checked,
        isCheating: e.target.isCheating.checked,
        note: e.target.note.value,
        reporteeId: userId
      }
    });
  };

  // ====== room ======
  const onValidateChange = (e) => {
    const t = e.target;
    let v = parseInt(t.value);

    if (isNaN(parseInt(v))) {
      return;
    }

    if (SPECIAL_CHARACTERS_REGEX.test(v)) {
      return;
    }

    if (v < parseInt(t.min)) {
      v = parseInt(t.min);
    } else if (v > parseInt(t.max)) {
      v = parseInt(t.max);
    }

    setRoomInfo({
      ...roomInfo,
      [t.name]: v
    });
  };

  const onValidateSubmit = (e) => {
    e.preventDefault();

    if (!roomInfo.title) {
      setIsTitleEmpty(true);
      return;
    }

    if (roomInfoList.some((room) => room.id === roomId)) {
      // 방 설정 변경
      let { title, password, maxUserCount, maxRound, roundTimeLimit } = roomInfo;
      password = password || "";
      changeRoomConfig(
        { title, password, maxUserCount, maxRound, roundTimeLimit },
        (room) => {
          setRoomInfo(room);
          setIsOpen(false);
        },
        (err) => {
          setType("error");
          let message = err.message;
          if (message?.startsWith("Error")) message = message.slice(7);
          setModalMessage(message ? message : err);
          setErrorSource("room");
        }
      );
      setRoomInfoList((prev) =>
        prev.map((room) =>
          room.id === roomId ? { ...room, ...roomInfo, id: roomId } : room
        )
      );
    } else {
      // 방 생성
      createRoom(
        roomInfo,
        () => {
          loadRoom((room) => {
            setRoomNumber(room.roomNumber);
            setRoomId(room.id);
            setRoomInfo(room);
            setCookie("userId", room.roomOwnerUserId, { path: "/" });
            setUser((prev) => ({ userId: room.roomOwnerUserId, ...prev }));
          });
        },
        (err) => {
          setType("error");
          let message = err.message;
          if (message?.startsWith("Error")) message = message.slice(7);
          setModalMessage(message ? message : err);
          setErrorSource("room");
        }
      );
    }
  };

  // ====== password ======
  const onCheckSamePassword = () => {
    const authorization = { roomId, password };
    joinRoom(
      authorization,
      () => {
        loadRoom((room) => {
          setRoomNumber(room.roomNumber);
          setRoomId(room.id);
          setRoomInfo(room);
          setCookie("userId", room.userList[room.userList.length - 1].userId, {
            path: "/"
          });
          setUser((prev) => ({
            userId: room.userList[room.userList.length - 1].userId,
            ...prev
          }));
        });
      },
      (error) => {
        console.log(`[Error]: ${error}`);
        setIsCorrectPassword(false);
        return;
      }
    );
  };

  // ====== exit ======
  const onExitRouteBack = () => {
    if (pathname !== "/game") {
      leaveRoom(
        () => {
          setWaitingPlayerList(null);
          setIsOpen(false);
          navigate("/game");
        },
        (err) => {
          setType("error");
          let message = err.message;
          if (message?.startsWith("Error")) message = message.slice(7);
          setModalMessage(message ? message : err);
          setErrorSource("room");
        }
      );
    } else {
      setIsOpen(false);
      navigate("/");
    }
  };

  const onSaveVolume = () => {
    localStorage.setItem("bgVolume", bgCurrVolume.toString());
    localStorage.setItem("fxVolume", fxCurrVolume.toString());
    setIsOpen(false);
  };

  // ====== error ======
  const onErrorHandler = () => {
    setIsOpen(false);
    if (errorSource === "room") {
      navigate("/game");
    } else {
      navigate("/");
    }
  };

  return (
    isOpen && (
      <>
        <GameModalBackground />
        <GameModalContent dir="col" col="center" height={height}>
          <GameModalHeader row={titleText !== "" ? "between" : "end"} col="center">
            {titleText !== "" && <span>{titleText}</span>}
            {!["result", "error"].includes(type) && (
              <ExitMiniCircle onClick={() => setIsOpen(false)} />
            )}
          </GameModalHeader>

          {/* 아바타 설정 modal */}
          {type === "avatar" && (
            <GameModalBody top="0" marginTop="0">
              <ButtonWrapper row="start" col="center" margin="9px 0 0">
                <GameModalMessage fontSize="22px">캐릭터</GameModalMessage>
              </ButtonWrapper>
              <ButtonWrapper row="center" col="center" margin="0">
                <ArrowIconImage src={leftArrow} onClick={onAvatarLeftClick} />
                <AvatarCanvas
                  avatar={avatar}
                  item={accessories[currAvatar]}
                  setAvatarImage={setAvatarImage}
                />
                <ArrowIconImage src={rightArrow} onClick={onAvatarRightClick} />
              </ButtonWrapper>
              <ButtonWrapper row="center" col="center" margin="10px 0 0">
                <GameModalButton onClick={onConfirmAvatarUrl}>확인</GameModalButton>
              </ButtonWrapper>
            </GameModalBody>
          )}

          {/* 비밀번호 입력 modal */}
          {type === "password" && (
            <GameModalBody top="0">
              <GameModalInputWrapper paddingTop="25px" paddingBottom="15px">
                <GameModalMessage paddingBottom="15px">
                  비밀번호를 입력하세요.
                </GameModalMessage>
                <GameModalInput
                  marginBottom="10px"
                  maxLength={30}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {!isCorrectPassword && (
                  <ValidationMessage message="비밀번호가 일치하지 않습니다." />
                )}
              </GameModalInputWrapper>
              <ButtonWrapper row="center" col="center">
                <GameModalButton onClick={onCheckSamePassword}>확인</GameModalButton>
              </ButtonWrapper>
            </GameModalBody>
          )}

          {/* 방 만들기 modal */}
          {type === "room" && (
            <form onSubmit={onValidateSubmit}>
              <Table>
                <Tbody>
                  <Tr col="center">
                    <TdLabel>
                      <GameModalMessage>방 제목</GameModalMessage>
                    </TdLabel>
                    <TdContent>
                      <GameModalInput
                        type="text"
                        placeholder="방 제목"
                        maxLength={20}
                        name="title"
                        value={roomInfo?.title}
                        onChange={(e) =>
                          setRoomInfo({ ...roomInfo, title: e.target.value })
                        }
                      />
                    </TdContent>
                  </Tr>
                  {isTitleEmpty && (
                    <Tr col="center">
                      <TdLabel />
                      <TdContent>
                        <ValidationMessage message="제목을 입력하세요." fontSize="14px" />
                      </TdContent>
                    </Tr>
                  )}
                  <Tr col="center">
                    <TdLabel>
                      <GameModalMessage>비밀번호</GameModalMessage>
                    </TdLabel>
                    <TdContent>
                      <GameModalInput
                        type="text"
                        placeholder="비밀번호"
                        maxLength={30}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setRoomInfo({ ...roomInfo, password: e.target.value });
                        }}
                      />
                    </TdContent>
                  </Tr>
                  <Tr col="center">
                    <TdLabel>
                      <GameModalMessage>플레이어 수</GameModalMessage>
                    </TdLabel>
                    <TdContent>
                      <GameModalInput
                        type="number"
                        max={8}
                        min={2}
                        step={1}
                        name="maxUserCount"
                        value={roomInfo?.maxUserCount}
                        onChange={(e) => onValidateChange(e)}
                      />
                    </TdContent>
                  </Tr>
                  <Tr col="center">
                    <TdLabel>
                      <GameModalMessage>라운드 수</GameModalMessage>
                    </TdLabel>
                    <TdContent>
                      <GameModalInput
                        type="number"
                        max={8}
                        min={2}
                        step={1}
                        name="maxRound"
                        value={roomInfo?.maxRound}
                        onChange={(e) => onValidateChange(e)}
                      />
                    </TdContent>
                  </Tr>
                  <Tr col="center">
                    <TdLabel>
                      <GameModalMessage>라운드 시간</GameModalMessage>
                    </TdLabel>
                    <TdContent>
                      <GameModalSelect
                        name="roundTimeLimit"
                        value={roomInfo?.roundTimeLimit}
                        onChange={(e) => onValidateChange(e)}
                      >
                        <option value={60000}>60초</option>
                        <option value={90000}>90초</option>
                        <option value={120000}>120초</option>
                        <option value={150000}>150초</option>
                      </GameModalSelect>
                    </TdContent>
                  </Tr>
                </Tbody>
              </Table>
              <ButtonWrapper
                row="center"
                col="center"
                margin={isTitleEmpty ? "22px 0 0" : "42px 0 0"}
              >
                <GameModalButton type="submit">확인</GameModalButton>
              </ButtonWrapper>
            </form>
          )}

          {/* 환경 설정 modal */}
          {type === "setting" && (
            <GameModalBody>
              <VolumeControl
                label="배경음 조절"
                currVolume={bgCurrVolume}
                setCurrVolume={setBgCurrVolume}
              />
              <VolumeControl
                label="효과음 조절"
                currVolume={fxCurrVolume}
                setCurrVolume={setFxCurrVolume}
              />
              <ButtonWrapper row="center" col="center" margin="30px 0px 20px">
                <GameModalButton onClick={onSaveVolume}>저장</GameModalButton>
              </ButtonWrapper>
            </GameModalBody>
          )}

          {/* 프로필 modal */}
          {type === "profile" && (
            <GameModalBody top="0" padding="0 14px">
              <Profile type="modal" userId={userId} isEditMode={isProfileEditMode} />
              <ButtonWrapper row="end" col="center" margin="0px 0px 18px">
                {userId !== cookies.userId ? (
                  <GameModalButton onClick={() => setType("report")}>
                    신고
                  </GameModalButton>
                ) : !isProfileEditMode ? (
                  <GameModalButton onClick={() => setIsProfileEditMode(true)}>
                    수정
                  </GameModalButton>
                ) : (
                  <GameModalButton onClick={onConfirmAvatarUrl}>저장</GameModalButton>
                )}
              </ButtonWrapper>
            </GameModalBody>
          )}

          {/* 신고 modal */}
          {type === "report" && (
            <GameModalBody top="0" padding="0 14px">
              <form onSubmit={(e) => onReportSubmit(e)}>
                <Table margin="1rem 0">
                  <Tbody>
                    <Tr>
                      <TdLabel>
                        <GameModalMessage>신고 대상</GameModalMessage>
                      </TdLabel>
                      <TdContent row="end" color="#fff" fontSize="19px">
                        {user?.nickname}
                      </TdContent>
                    </Tr>
                    <Tr dir="col" row="start" col="start">
                      <TdLabel>
                        <GameModalMessage>신고 사유</GameModalMessage>
                      </TdLabel>
                      <TdContent dir="col" color="#fff" fontSize="17px">
                        <Label htmlFor="isOffensive" margin="5px 0">
                          <input type="checkbox" id="isOffensive" value="isOffensive" />
                          공격적인 언어 사용 (도배, 욕설, 음담패설, 혐오 표현 사용 등)
                        </Label>
                        <Label htmlFor="isPoorManner">
                          <input type="checkbox" id="isPoorManner" value="isPoorManner" />
                          비매너 행위 (고의적인 게임 진행 방해, 스토킹, 시스템 악용 등)
                        </Label>
                        <Label htmlFor="isCheating">
                          <input type="checkbox" id="isCheating" value="isCheating" />
                          사기 행위 (계정/현금 거래/상업 광고/사기 및 사칭)
                        </Label>
                        <Label htmlFor="note">
                          - 기타 (하단 입력란에 신고 사유를 입력하세요.)
                        </Label>
                        <Textarea
                          margin="0"
                          height="5.4rem"
                          fontSize="15px"
                          id="note"
                          name="note"
                          placeholder="신고하게 된 계기를 자세하게 입력해주세요."
                        />
                      </TdContent>
                    </Tr>
                  </Tbody>
                </Table>
                <ButtonWrapper row="end" col="center" margin="0">
                  <GameModalButton type="submit">신고</GameModalButton>
                </ButtonWrapper>
              </form>
            </GameModalBody>
          )}

          {/* 도움말 modal */}
          {type === "help" && <GameModalLongMessage>{children}</GameModalLongMessage>}

          {/* 경고 modal */}
          {type === "alert" && (
            <GameModalBody top="43px">
              <GameModalMessage fontSize="20px" fontWeight="500">
                {children}
              </GameModalMessage>
              <ButtonWrapper row="center" col="center" margin="40px 0px 0px">
                <GameModalButton onClick={() => setIsOpen(false)}>확인</GameModalButton>
              </ButtonWrapper>
            </GameModalBody>
          )}

          {/* 안내 modal */}
          {type === "alarm" && (
            <GameModalBody top="43px">
              <GameModalMessage fontSize="20px" fontWeight="500">
                {modalMessage}
              </GameModalMessage>
              <ButtonWrapper row="center" col="center" margin="30px 0px 32px">
                <GameModalButton onClick={() => setIsOpen(false)}>확인</GameModalButton>
              </ButtonWrapper>
            </GameModalBody>
          )}

          {/* 퇴장 modal */}
          {type === "exit" && (
            <GameModalBody top="43px">
              <GameModalMessage fontSize="20px" fontWeight="500">
                {children}
              </GameModalMessage>
              <ButtonWrapper row="center" col="center" margin="50px 0px 32px">
                <GameModalButton onClick={onExitRouteBack}>확인</GameModalButton>
              </ButtonWrapper>
            </GameModalBody>
          )}

          {/* 게임 결과 modal */}
          {type === "result" && (
            <GameModalBody row="between">
              <Table>
                <Tbody>
                  {children?.map(({ userId, score }, idx) => (
                    <Tr key={idx} bgColor="#fff" col="center">
                      <TdLabel width="2.5rem" textAlign="center">
                        {idx + 1}
                      </TdLabel>
                      <TdContent flexBasis="18rem" flexGrow="0" padding="0 5px">
                        {userId}
                      </TdContent>
                      <TdContent>{score}점</TdContent>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <ButtonWrapper row="center" col="center" margin="10px 0px 45px">
                <GameModalButton
                  onClick={() => {
                    loadRoom((room) => {
                      setRoomInfo(room);
                      setWaitingPlayerList(room.userList);
                      if (playingPlayerList?.length !== 0) {
                        const newPlayerList = playingPlayerList.map((player) => ({
                          ...player,
                          score: 0
                        }));
                        setPlayingPlayerList(newPlayerList);
                      }
                    });
                    setIsOpen(false);
                    setIsPlaying(false);
                  }}
                >
                  확인
                </GameModalButton>
              </ButtonWrapper>
            </GameModalBody>
          )}

          {/* 에러 modal */}
          {type === "error" && (
            <GameModalBody top="43px">
              <GameModalMessage fontSize="20px" fontWeight="500">
                {modalMessage ? modalMessage : children}
              </GameModalMessage>
              <ButtonWrapper row="center" col="center" margin="50px 0px 32px">
                <GameModalButton onClick={onErrorHandler}>확인</GameModalButton>
              </ButtonWrapper>
            </GameModalBody>
          )}
        </GameModalContent>
      </>
    )
  );
};

GameModal.propTypes = {
  type: PropTypes.oneOf([
    "alert",
    "alarm",
    "password",
    "room",
    "profile",
    "report",
    "setting",
    "help",
    "exit",
    "avatar",
    "error",
    "result"
  ]),
  setType: PropTypes.func,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func,
  setIsPlaying: PropTypes.func,
  userId: PropTypes.number,
  roomId: PropTypes.string,
  height: PropTypes.string,
  children: PropTypes.node
};

export default GameModal;
