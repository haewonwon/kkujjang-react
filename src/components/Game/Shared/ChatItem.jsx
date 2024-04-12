import styled from "styled-components";
import PropTypes from "prop-types";

import FlexBox from "@/styles/FlexStyle";

const ChatItem = ({ nickname, message, createdAt }) => {
  return (
    <ChatContent>
      <NickName row="start" col="center">
        <span>{nickname}</span>
      </NickName>
      <Message col="center">
        <span>{message}</span>
      </Message>
      {createdAt && (
        <Message marginLeft="auto">
          <span>{createdAt}</span>
        </Message>
      )}
    </ChatContent>
  );
};

const ChatContent = styled(FlexBox)`
  height: 20px;
`;

const NickName = styled(FlexBox)`
  width: 130px;
  height: inherit;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Message = styled(FlexBox)`
  height: inherit;
  margin-left: ${({ marginLeft }) => marginLeft};
`;

ChatItem.propTypes = {
  nickname: PropTypes.string,
  message: PropTypes.string,
  createdAt: PropTypes.string
};

export default ChatItem;
