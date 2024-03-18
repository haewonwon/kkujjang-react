import React, { useState, useEffect, useCallback } from "react";
import { useRecoilValue } from "recoil";
import { avatarUrlState } from "../../recoil/userState";
import io from "socket.io-client";
import { Cookies } from "react-cookie";
import { SOCKET_URL } from "@/services/const";

import GameHeader from "@/components/Game/Shared/GameHeader";
import { ContentWrapper, WideContent, Main, Box } from "@/styles/CommonStyle";
import Ranking from "@/components/Game/Lobby/Ranking";
import Profile from "@/components/Game/Shared/Profile";
import LobbyRoomList from "@/components/Game/Lobby/LobbyRoomList";
import { Tab } from "@/components/Game/Shared/Tab";
import { Button } from "@/components/Game/Shared/Button";
import Footer from "@/components/Web/Shared/Layout/Footer";
import Modal from "@/components/Game/Shared/GameModal";
import {
  SideContentWrapper,
  MainContentWrapper,
  SpacingWrapper
} from "@/components/Game/Shared/Layout";
import {
  initSocket,
  disconnectSocket,
  loadRoomList,
  onLoadNewRoom,
  onDestroyRoom,
  onUpdateCurrentPlayerCount,
  onUpdateRoomConfig
} from "@/services/socket";
import { getCurrentUserInfo } from "@/services/user";

const Lobby = () => {
  const [rooms, setRooms] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [socket, setSocket] = useState();

  let isMounted = false;

  useEffect(() => {
    if (!isMounted) {
      loadRoomList(setRooms);

      onLoadNewRoom((newRoom) => {
        setRooms((prev) => [newRoom, ...prev]);
      });

      onDestroyRoom((roomId) => {
        setRooms((prev) => prev.filter((room) => room.id !== roomId));
      });

      onUpdateCurrentPlayerCount((data) => {
        const { roomId, currentPlayerCount } = data;
        setRooms((prev) =>
          prev.map((room) =>
            room.id === roomId ? { ...room, currentPlayerCount } : room
          )
        );
      });

      onUpdateRoomConfig((newRoom) => {
        setRooms((prev) =>
          prev.map((room) => (room.id === newRoom.id ? { ...room, ...newRoom } : room))
        );
      });
      //   },
      //   (error) => {
      //     setModalType("error");
      //     setErrorMessage(error);
      //     setIsModalOpen(true);
      //     return;
      //   }
      // );
    }

    isMounted = true;
  }, []);

  useEffect(() => {
    const storedRoomInfoList = localStorage.getItem("roomInfoList");
    const bgVolume = localStorage.getItem("bgVolume");
    const fxVolume = localStorage.getItem("fxVolume");

    // 볼륨 조절
    // Audio.volume = bgVolume
    // Audio.volume = fxVolume
  }, []);

  const getUserInfo = useCallback(async () => {
    const userInfo = await getCurrentUserInfo();
    debugger;
    if (userInfo.avatarUrl === null) {
      setModalType(null);
      setIsModalOpen(false);
    }
  }, []);

  return (
    <ContentWrapper row="center" col="center">
      {isModalOpen && (
        <Modal
          type={modalType}
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          height="14rem"
        >
          {modalType === "error" && errorMessage}
        </Modal>
      )}
      <WideContent dir="col">
        <GameHeader />
        <Main>
          <Box>
            <SideContentWrapper dir="col">
              <Tab type="ranking">랭킹</Tab>
              <Ranking />
              <Profile />
            </SideContentWrapper>
            <MainContentWrapper dir="col">
              <SpacingWrapper row="between" col="end">
                <SpacingWrapper spacingX="5px">
                  <Tab type="list">방 목록</Tab>
                  <Tab type="create">방 만들기</Tab>
                  <Tab type="enter" rooms={rooms}>
                    바로 입장
                  </Tab>
                </SpacingWrapper>
                <div>
                  <Button type="help" />
                  <Button type="setting" />
                </div>
              </SpacingWrapper>
              <LobbyRoomList rooms={rooms} roomId={null} />
            </MainContentWrapper>
          </Box>
        </Main>
        <Footer />
      </WideContent>
    </ContentWrapper>
  );
};

export default Lobby;
