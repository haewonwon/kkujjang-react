import React, { useEffect, useState } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import PropTypes from "prop-types";

import avatar from "@/assets/images/avatar.png";
import { FlexBox } from "@/styles/FlexStyle";
import useAxios from "@/hooks/useAxios";
import { userInfoState } from "@/recoil/userState";
import Player from "./Player";
import ProfileActiveToggle from "./ProfileActiveToggle";
import GameModal from "./GameModal";
import TitleBar from "./TitleBar";
import AvatarCanvas from "./AvatarCanvas";

const init = {
  avatarUrl: avatar,
  nickname: ["닉네임", "닉네임"],
  level: ["레벨", 0],
  winRate: ["승률", 0],
  exp: ["경험치", "30%"],
  isBanned: "false",
  bannedReson: ""
};

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

const Profile = ({ type = "default", userId, isAdmin, profileInfos = init }) => {
  const [user, setUser] = useRecoilState(userInfoState);
  const [profile, setProfile] = useState(profileInfos);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isIncludingKey, setIsIncludingKey] = useState(false);
  const [isActiveAccount, setIsActiveAccount] = useState(
    profileInfos.isBanned === "true"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [avatarImage, setAvatarImage] = useState(null);
  const [cookies] = useCookies(["sessionId", "userId"]);
  const { response, loading, error, fetchData } = useAxios({
    method: "get",
    url: `/user/${!userId ? "me" : userId}`,
    headers: { sessionId: cookies.sessionId }
  });

  // useEffect(() => {
  //   if (user) {
  //     setProfile({
  //       ...profile,
  //       avatarUrl: user.avatarUrl1
  //     });
  //   }
  // }, [user]);

  useEffect(() => {
    if (response !== null) {
      const data = response.result;
      setProfile({
        nickname: ["닉네임", data.nickname],
        level: ["레벨", data.level],
        winRate: ["승률", data.winRate],
        exp: ["경험치", data.exp],
        avatarUrl: data.avatarAccessoryIndex
      });
      setUser((prev) => ({
        ...prev,
        nickname: data.nickname,
        level: data.level,
        winRate: data.winRate,
        exp: data.exp,
        avatarUrl: data.avatarAccessoryIndex
      }));
    }
  }, [response]);

  return (
    <>
      {isPlaying ? (
        <Player
          avatarUrl={profile.avatarUrl}
          nickname={profile.nickname[1]}
          level={profile.level[1]}
        />
      ) : type === "modal" ? (
        <ProfileWrapper type={type} dir="col">
          <ProfileUpperWrapper type={type}>
            <AvatarCanvas
              avatar={avatar}
              item={accessories[profile.avatarUrl]}
              setAvatarImage={setAvatarImage}
              width="7rem"
            />
            <ProfileInfoWrapper dir="col" row="center">
              {isIncludingKey
                ? Object.entries(profile)?.map(([key, [title, value]], idx) => (
                    <ProfileInfoField row="between" key={key}>
                      <ProfileInfoKey>{title}</ProfileInfoKey>
                      <ProfileInfo>{value}</ProfileInfo>
                    </ProfileInfoField>
                  ))
                : Object.entries(profile)
                    .filter(([key]) => ["nickname", "level", "winRate"].includes(key))
                    ?.map(([key, [title, value]], idx) => (
                      <ProfileInfo key={idx}>
                        {key === "nickname" ? value : `${title} ${value}`}
                      </ProfileInfo>
                    ))}
            </ProfileInfoWrapper>
          </ProfileUpperWrapper>
        </ProfileWrapper>
      ) : (
        <>
          <ProfileWrapper dir="col">
            <TitleBar type="profile" />
            <ProfileUpperWrapper onClick={() => setIsModalOpen(true)}>
              <AvatarCanvas
                avatar={avatar}
                item={accessories[profile.avatarUrl]}
                setAvatarImage={setAvatarImage}
                width="5.4rem"
              />
              <ProfileInfoWrapper dir="col" row="center">
                {isIncludingKey
                  ? Object.entries(profile)?.map(([key, [title, value]], idx) => (
                      <ProfileInfoField row="between" key={idx}>
                        <ProfileInfoKey>{title}</ProfileInfoKey>
                        <ProfileInfo>{value}</ProfileInfo>
                      </ProfileInfoField>
                    ))
                  : Object.entries(profile)
                      .filter(([key]) => ["nickname", "level"].includes(key))
                      ?.map(([key, [title, value]], idx) => (
                        <ProfileInfo key={idx}>
                          {key === "nickname" ? value : `${title} ${value}`}
                        </ProfileInfo>
                      ))}
              </ProfileInfoWrapper>
            </ProfileUpperWrapper>
            {!isIncludingKey && (
              <ExpWrapper row="center" col="center">
                <ExpBar>
                  <ProgressToNextLevel exp={profile?.exp[1]} />
                  <ExpText>{profile?.exp[1]}</ExpText>
                </ExpBar>
              </ExpWrapper>
            )}
          </ProfileWrapper>
          {isModalOpen ? (
            <GameModal
              type="profile"
              isOpen={isModalOpen}
              setIsOpen={setIsModalOpen}
              height="14rem"
            />
          ) : null}
          {isAdmin && (
            <ProfileActiveToggle
              isActiveAccount={isActiveAccount}
              setIsActiveAccount={setIsActiveAccount}
            />
          )}
        </>
      )}
    </>
  );
};

Profile.propTypes = {
  type: PropTypes.string,
  userId: PropTypes.number,
  isAdmin: PropTypes.bool,
  profileInfos: PropTypes.object
};

const ProfileWrapper = styled(FlexBox)`
  padding: 3px 5px;
  background-color: ${({ type }) =>
    type === "modal" ? "transparent" : "rgb(227 227 227)"};
  flex-grow: 1;
  border: ${({ type }) => type !== "modal" && "1px solid #ccc"};
  color: ${({ type }) => type === "modal" && "#fff"};
`;

const ProfileUpperWrapper = styled(FlexBox)`
  min-height: 6rem;
  padding: 8px;

  &:hover {
    cursor: ${({ type }) => type !== "modal" && "pointer"};
  }
`;

const ProfileInfoWrapper = styled(FlexBox)`
  margin-left: 10px;
`;

const ProfileInfoField = styled(FlexBox)`
  width: 31.375rem;
`;

const ProfileInfoKey = styled.span``;

const ProfileInfo = styled.span``;

const AvatarImage = styled(FlexBox).attrs({
  as: "img"
})`
  width: ${(props) => (props.type === "player" ? "7.75rem" : "5.3rem")};
  height: ${(props) => (props.type === "player" ? "auto" : "")};
`;

// ============ Exp ============
const ExpWrapper = styled(FlexBox)`
  width: ${(props) => props.width || "100%"};
  height: 2.625rem;
`;

const ExpBar = styled.div`
  width: 92%;
  height: 100%;
  border: 1px solid ${({ theme }) => theme.colors.gray600};
  border-radius: 15px;
`;

const ProgressToNextLevel = styled.div`
  width: ${({ exp }) => exp};
  height: 100%;
  background-color: ${({ theme }) => theme.colors.gray600};
  border-radius: 13px 0 0 13px;
`;

const ExpText = styled.span`
  position: relative;
  left: 43%;
  bottom: 33px;
  color: #fff;
  font-weight: 700;
`;

export default Profile;
