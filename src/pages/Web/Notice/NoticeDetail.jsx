import React from "react";
import styled from "styled-components";

import { ContentWrapper, WideContent, Main } from "@/styles/CommonStyle";
import Header from "@/components/Web/Shared/Layout/Header";
import NoticeDetailContainer from "@/components/Web/Support/NoticeDetailContainer";

const NoticeDetailMain = styled(Main)`
  background-color: ${({ theme }) => theme.colors.content};
  height: 100vh;
`;

const NoticeDetail = () => {
  return (
    <ContentWrapper row="center" col="center">
      <Header type="detail" />
      <WideContent dir="col" width="100%">
        <NoticeDetailMain>
          <NoticeDetailContainer />
        </NoticeDetailMain>
      </WideContent>
    </ContentWrapper>
  );
};

export default NoticeDetail;
