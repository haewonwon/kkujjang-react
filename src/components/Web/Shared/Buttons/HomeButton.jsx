import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { useCookies } from "react-cookie";
import { Link as RouterLink } from "react-router-dom";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faComment } from "@fortawesome/free-solid-svg-icons";
import FlexBox from "@/styles/FlexStyle";
import { Span } from "../../../Game/Shared/Layout";
import { LevelBadge } from "../../../Game/Shared/Player";
import { KAKAO_LOGIN_LINK } from "@/services/const";
import { userInfoState } from "@/recoil/userState";
import useAxios from "@/hooks/useAxios";
import { Container } from "@/styles/StyledComponents";

const HomeButton = ({ type }) => {
  const [user, setUser] = useRecoilState(userInfoState);
  const [cookies, , removeCookie] = useCookies(["sessionId"]);
  const { response, loading, error, fetchData } = useAxios(
    {
      method: "get",
      url: "/user/signout",
      headers: {
        sessionId: cookies.sessionId
      }
    },
    false
  );

  useEffect(() => {
    if (response !== null) {
      setUser(null);
      removeCookie("sessionId", { path: "/" });
      if (cookies?.userRole) {
        removeCookie("userRole", { path: "/" });
      }
    }
  }, [response]);

  return (
    <Container
      $display="flex"
      $dir="col"
      $height="14rem"
      $width="19.75rem"
      $margin="1rem 6rem 0 0"
      $alignSelf="center"
    >
      {type === "guest" ? (
        <>
          <Link to="/member/login" flex="1">
            <FlexBox
              as="button"
              row="center"
              col="center"
              flex="1"
              padding="15px 0 0"
              bgColor="rgba(0,0,0, 0.7)"
              shadow=" 0 4px 10px 0 rgba(0, 0, 0, 0.25)"
              borderRadius="30px 30px 0 0"
            >
              <Span
                font="Pretendard Variable"
                fontSize="54px"
                fontWeight="800"
                color="#fff"
              >
                로그인
              </Span>
            </FlexBox>
          </Link>
          <a href={KAKAO_LOGIN_LINK}>
            <FlexBox
              as="button"
              row="center"
              col="center"
              width="100%"
              height="4rem"
              bgColor="#FFDE00"
              shadow=" 0 4px 10px 0 rgba(0, 0, 0, 0.25)"
              borderRadius="0 0 30px 30px"
            >
              <FontAwesomeIcon icon={faComment} size="lg" />
              <Span fontSize="1.375rem" margin="0 5px">
                카카오로 로그인하기
              </Span>
            </FlexBox>
          </a>
        </>
      ) : (
        <>
          <Link to="/game" flex="1">
            <FlexBox
              as="button"
              row="center"
              col="center"
              flex="1"
              padding="15px 0 0"
              bgColor="rgb(255 252 129)"
              shadow=" 0 4px 10px 0 rgba(0, 0, 0, 0.25)"
              borderRadius="30px 30px 0 0"
            >
              <Span font="Pretendard Variable" fontSize="54px" fontWeight="800">
                게임 시작
              </Span>
            </FlexBox>
          </Link>
          <FlexBox row="between" col="center" height="4rem">
            {/* User Info */}
            <FlexBox
              col="center"
              flex="1"
              height="100%"
              padding="0 18px"
              bgColor="#E6E6E6"
              shadow=" 0 4px 10px 0 rgba(0, 0, 0, 0.25)"
              borderRadius="0 0  0 30px"
            >
              <LevelBadge>{user?.level}</LevelBadge>
              <Span font="Noto Sans KR" fontSize="1.2rem" fontWeight="700">
                {user?.nickname}
              </Span>
            </FlexBox>
            {/* logout */}
            <FlexBox
              as="button"
              row="center"
              col="center"
              width="5rem"
              height="100%"
              bgColor="#FBFBFB"
              shadow=" 3px 4px 10px 0 rgba(0, 0, 0, 0.25)"
              borderRadius="0 0 30px 0"
              onClick={() => fetchData()}
            >
              <FontAwesomeIcon icon={faArrowRightFromBracket} size="xl" />
            </FlexBox>
          </FlexBox>
        </>
      )}
    </Container>
  );
};

HomeButton.propTypes = {
  type: PropTypes.string.isRequired
};

const Link = styled(RouterLink)`
  display: flex;
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  flex: ${({ flex }) => flex};

  &:hover {
  }
`;

export default HomeButton;
