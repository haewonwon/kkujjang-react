import { useRecoilState, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Header from "@/components/Web/Shared/Layout/Header";
import NoticeManagementList from "@/components/Web/Admin/NoticeManagementList";
import InquiryManagementList from "@/components/Web/Admin/InquiryManagementList";
import ReportManagementList from "@/components/Web/Admin/ReportManagementList";
import UserManagementList from "@/components/Web/Admin/UserManagementList";
import { FlexBox } from "@/styles/FlexStyle";
import { Main } from "@/components/Game/Shared/Layout";
import { ContentWrapper, WideContent } from "@/styles/CommonStyle";
import { isAnswerCompletedState } from "@/recoil/boardState";
import { itemIdState, selectedBoardItemIdState } from "@/recoil/boardState";
import { useEffect } from "react";

const HomeAdmin = () => {
  const setItemId = useSetRecoilState(itemIdState);
  const setSelectedBoardItemId = useSetRecoilState(selectedBoardItemIdState);
  const [isAnswerCompleted, setIsAnswerCompleted] =
    useRecoilState(isAnswerCompletedState);
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedBoardItemId(null);
  }, []);

  const onSideOpen = (page, id) => {
    setItemId(id);

    switch (page) {
      case "notice":
        navigate("/admin/notice");
        break;
      case "inquiry":
        navigate("/admin/inquiry");
        break;
      case "report":
        navigate("/admin/report");
        break;
      case "user":
        navigate("/admin/user");
        break;
      default:
        break;
    }
  };

  return (
    <ContentWrapper row="center" col="center">
      <WideContent width="114rem" dir="col">
        <Header type="admin" />
        <Main width="100%" margin="8.8rem 0 0">
          <ListWrapper row="between">
            <NoticeManagementList
              type="home"
              onDetailOpen={(id) => onSideOpen("notice", id)}
            />
            <InquiryManagementList
              type="home"
              isAnswerCompleted={isAnswerCompleted}
              setIsAnswerCompleted={setIsAnswerCompleted}
              onThreadOpen={(id) => onSideOpen("inquiry", id)}
            />
            <ReportManagementList
              type="home"
              onSideOpen={(id) => onSideOpen("report", id)}
            />
            <UserManagementList type="home" onSideOpen={(id) => onSideOpen("user", id)} />
          </ListWrapper>
        </Main>
      </WideContent>
    </ContentWrapper>
  );
};

const ListWrapper = styled(FlexBox)``;

export default HomeAdmin;
