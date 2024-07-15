import io from "socket.io-client";
import { Cookies } from "react-cookie";
import { PUBLIC_URL, SOCKET_PATH } from "./const";

const cookies = new Cookies();

const connectSocket = () => {
  return io(PUBLIC_URL, {
    path: SOCKET_PATH,
    // transports: ["websocket"],
    reconnection: false,
    extraHeaders: {
      sessionId: cookies.get("sessionId")
    }
  });
};

let client = connectSocket();

// ====== 소켓 초기화 ======
export const initSocket = (errorCallBack) => {
  client.on("connect", () => {
    console.log(`[log] Connect to the Server...`);
  });

  client.on("error", (error) => {
    console.error(`[Error]: ${error}`);
    if (!!errorCallBack) errorCallBack(error);
  });
};

// ====== 방 목록 조회 ======
export const loadRoomList = (callBack) => {
  client.emit("load room list");

  client.off("complete load room list");
  client.on("complete load room list", (roomList) => {
    console.log("[log] Complete Load Room List: ", roomList);
    callBack(roomList);
  });
};

// ====== 방 목록 갱신: 추가 ======
export const onLoadNewRoom = (callBack) => {
  client.on("load new room", (newRoom) => {
    console.log("[log] Load New Room: ", newRoom);
    callBack(newRoom);
  });
};

// ====== 방 목록 갱신: 삭제 ======
export const onDestroyRoom = (callBack) => {
  client.on("destroy room", (roomId) => {
    console.log("[log] Destroy Room: ", roomId);
    callBack(roomId);
  });
};

// ====== 방 목록 갱신: 참여 인원 변경 ======
export const onUpdateCurrentPlayerCount = (callBack) => {
  client.on("update room member count", (data) => {
    console.log("[log] update room member count: ", data);
    callBack(data);
  });
};

// ====== 방 목록 갱신: 방 설정 변경 ======
export const onUpdateRoomConfig = (callBack) => {
  client.on("update room config", (newRoom) => {
    console.log("[log] update room config: ", newRoom);
    callBack(newRoom);
  });
};

// ====== 방 생성 ======
export const createRoom = (roomData, callBack, errorCallBack) => {
  client.emit("create room", roomData);

  // 소켓 서버 무응답 대처
  let timeout = setTimeout(() => {
    errorCallBack(new Error("서버와의 연결 시간이 초과되었습니다."));
  }, 2000);

  client.off("complete create room");
  client.on("complete create room", () => {
    clearTimeout(timeout);
    console.log("[log] complete create room...");
    callBack();
  });

  client.on("error", (error) => {
    clearTimeout(timeout);
    errorCallBack(error);
  });
};

// ====== 방 수정 ======
export const changeRoomConfig = (roomData, callBack, errorCallBack) => {
  client.emit("change room config", roomData);

  // 소켓 서버 무응답 대처
  let timeout = setTimeout(() => {
    errorCallBack(new Error("서버와의 연결 시간이 초과되었습니다."));
  }, 2000);

  client.off("complete change room config");
  client.on("complete change room config", (room) => {
    clearTimeout(timeout);
    console.log("[log] complete change room config: ", room);
    callBack(room);
  });

  client.on("error", (error) => {
    clearTimeout(timeout);
    errorCallBack(error);
  });
};

export const onChangeRoomConfig = (callBack) => {
  client.on("complete change room config", (room) => {
    console.log("[log] complete change room config: ", room);
    callBack(room);
  });
};

// ====== 방 참가 ======
export const joinRoom = (authorization, callBack, errorCallBack) => {
  client.emit("join room", authorization);

  client.off("complete join room");
  client.on("complete join room", () => {
    console.log("[log] complete join room... ");
    callBack();
  });

  client.off("error");
  client.on("error", (error) => {
    console.error(`[Error]: ${error}`);
    if (!!errorCallBack) errorCallBack(error);
  });
};

// 다른 유저 참가 알림
export const onUserJoinRoom = (callBack) => {
  client.on("some user join room", (userId) => {
    console.log("[log] some user join room: ", userId);
    callBack(userId);
  });
};

// ====== 방 조회 ======
export const loadRoom = (callBack, errorCallBack) => {
  client.emit("load room");

  client.off("complete load room");
  client.on("complete load room", (room) => {
    console.log("[log] complete load room: ", room);
    if (!!callBack) callBack(room);
  });

  client.off("error");
  client.on("error", (error) => {
    console.error(`[Error]: ${error}`);
    if (!!errorCallBack) errorCallBack(error);
  });
};

export const onLoadRoom = (callBack, errorCallBack) => {
  client.off("complete load room");
  client.on("complete load room", (room) => {
    console.log("[log] complete load room: ", room);
    callBack(room);
  });

  client.off("error");
  client.on("error", (error) => {
    console.error(`[Error]: ${error}`);
    if (errorCallBack) errorCallBack(error);
  });
};

// ====== 방 퇴장 ======
export const leaveRoom = (callBack, errorCallBack) => {
  client.emit("leave room");

  // 소켓 서버 무응답 대처
  let timeout = setTimeout(() => {
    errorCallBack(new Error("서버와의 연결 시간이 초과되었습니다."));
  }, 2000);

  client.off("complete leave room");
  client.on("complete leave room", () => {
    clearTimeout(timeout);
    console.log("[log] complete leave room... ");
    callBack();
  });

  client.off("error");
  client.on("error", (error) => {
    clearTimeout(timeout);
    console.error(`[Error]: ${error}`);
    if (errorCallBack) errorCallBack(error);
  });
};

// 다른 유저 퇴장 알림
export const onUserLeaveRoom = (callBack) => {
  client.off("some user leave room");
  client.on("some user leave room", (roomStatus) => {
    console.log("[log] some user leave room, userId: ", roomStatus);
    callBack(roomStatus);
  });
};

// 방장 변경
export const onChangeRoomOwner = (callBack) => {
  client.on("change room owner", (newOwnerIdx) => {
    console.log("[log] change room owner, newOwnerIdx: ", newOwnerIdx);
    callBack(newOwnerIdx);
  });
};

// ====== 준비 요청 ======
export const switchReadyState = (newState, callBack, errorCallBack) => {
  client.emit("switch ready state", newState);

  client.off("complete switch ready state");
  client.on("complete switch ready state", (data) => {
    console.log("[log] complete switch ready state, data: ", data);
    callBack(data);
  });

  client.off("error");
  client.on("error", (error) => {
    console.error(`[Error]: ${error}`);
    if (!!errorCallBack) errorCallBack(error);
  });
};

export const onSwitchReadyState = (callBack) => {
  client.on("complete switch ready state", (data) => {
    console.log("[log] complete switch ready state, data: ", data);
    callBack(data);
  });
};

// ====== 게임 시작 ======
export const gameStart = () => {
  client.emit("game start");
};

export const onGameStart = (callBack, errorCallBack) => {
  client.off("complete game start");
  client.on("complete game start", (room) => {
    console.log("[log] complete game start, room", room);
    callBack(room);
  });

  client.off("error");
  client.on("error", (error) => {
    console.log("[Error] error: ", error);
    errorCallBack(error);
  });
};

// ====== 라운드 시작 요청 ======
export const roundStart = () => {
  client.emit("round start");
};

export const onRoundStart = (callBack) => {
  client.off("complete round start");
  client.on("complete round start", (gameStatus) => {
    console.log("[log] complete round start, room: ", gameStatus);
    callBack(gameStatus);
  });
};

// ====== 턴 시작 요청 ======
export const turnStart = () => {
  client.emit("turn start");
};

export const onTurnStart = (callBack, errorCallBack) => {
  client.off("complete turn start");
  client.on("complete turn start", (gameStatus) => {
    console.log("[log] complete turn start, room: ", gameStatus);
    callBack(gameStatus);
  });

  client.off("error");
  client.on("error", (error) => {
    console.log("[Error]: ", error);
    errorCallBack(error);
  });
};

// ====== 채팅 ======
export const sendMessage = (message) => {
  if (client.connected) {
    client.emit("chat", message);
  }
};

export const receiveMessage = (callBack) => {
  client.off("chat");
  client.on("chat", (data) => {
    console.log("[log] chat, chatData: ", data);
    callBack(data);
  });
};

export const receiveSayWordFail = (callBack) => {
  client.off("say word fail");
  client.on("say word fail", (word) => {
    console.log("[log] say word fail: ", word);
    callBack(word);
  });
};

export const receiveSayWordSucceed = (callBack) => {
  client.off("say word succeed");
  client.on("say word succeed", (data) => {
    console.log("[log] say word succeed: ", data);
    callBack(data);
  });
};

// ====== 타이머 ======
export const onTimer = (callBack) => {
  client.off("timer");
  client.on("timer", (data) => {
    console.log("[log] timer: ", data);
    callBack(data);
  });
};

// ====== 턴 종료 ======
export const onTurnEnd = (callBack) => {
  client.on("turn end", () => {
    console.log("[log] turn end... ");
    callBack();
  });
};

// ====== 라운드 종료 ======
export const onRoundEnd = (callBack) => {
  client.off("round end");
  client.on("round end", (roundResult) => {
    console.log("[log] round end... roundResult: ", roundResult);
    callBack(roundResult);
  });
};

// ====== 게임 종료 ======
export const onGameEnd = (callBack) => {
  client.on("game end", (ranking) => {
    console.log(`[log] game end...: ${JSON.stringify(ranking)}`);
    callBack(ranking);
  });
};

// ====== 소켓 연결 종료 ======
export const disconnectSocket = () => {
  if (client.connected) {
    client.disconnect(() => {
      console.log("[log] Disconnected from the Server...");
    });
  }
};

export const onBanned = (callBack) => {
  client.on("banned", (bannedData) => {
    console.log("[log] bannedData: ", bannedData);
    callBack(bannedData);
  });
};

export const onError = (callBack) => {
  client.on("error", (error) => {
    console.trace(`[Error]: ${error}`);
    if (callBack) callBack(error);
  });
};
