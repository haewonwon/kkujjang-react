import { createGlobalStyle } from "styled-components";
import { PUBLIC_URL } from "@/services/const";

const GlobalStyle = createGlobalStyle`
  
  // 노토 산스
  @font-face {
    font-family: 'Noto Sans KR';
    src: url('${PUBLIC_URL}/fonts/NotoSansKR-VariableFont_wght.woff2') format('woff2');
    font-weight: 100 900;
  }

  // 프리텐다드
  @font-face {
    font-family: 'Pretendard Variable';
    src: url('${PUBLIC_URL}/fonts/PretendardVariable.woff2') format('woff2');
    font-weight: 100 900;
  }

  // 구기체
  @font-face {
    font-family: 'Gugi';
    src: url('${PUBLIC_URL}/fonts/Gugi-Regular.woff2') format('woff2');
    font-weight: 400;
  }

  // 던전앤파이터 비트비트체
  @font-face {
    font-family: 'DNFBitBitv2';
    src: url('${PUBLIC_URL}/fonts/DNFBitBitv2.woff2') format('woff2');
    font-weight: 100 900;
  }

  // 배달의민족 한나체
  @font-face {
    font-family: 'Hanna';
    src: url('${PUBLIC_URL}/fonts/BMHANNA_11yrs.woff2') format('woff2');
  }

  // 배달의민족 한나체 Air
  @font-face {
    font-family: 'BMHANNAAir';
    src: url('${PUBLIC_URL}/fonts/BMHANNAAir.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
  }

  // Alfa Slab One
  @font-face {
    font-family: 'AlfaSlabOne';
    src: url('${PUBLIC_URL}/fonts/AlfaSlabOne-Regular.woff2') format('woff2');
  }

  // Zen Dots
  @font-face {
    font-family: 'ZenDots';
    src: url('${PUBLIC_URL}/fonts/ZenDots-Regular.woff2') format('woff2');
  }

  // Poller One
  @font-face {
    font-family: 'PollerOne';
    src: url('${PUBLIC_URL}/fonts/PollerOne-Regular.woff2') format('woff2');
  }

  * {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    font-family: 'Noto Sans KR', 'Pretendard Variable', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, 'FontAwesome';
  }

  body {
    margin: 0;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text.main};
    cursor: auto;
  }

  form {
    margin: 0;
  }

  table {
    border-collapse: collapse;
  }

  input, select {
    background-color: #fff;
    outline: 0;
  }

  textarea {
    outline: 0;
    resize: none;
  }

  button {
    border-width: 0;
  }

  ul, ol {
    list-style-type: none;
    margin: 0;
    padding-inline-start: 0;
  }
  
  p {
    margin: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  a:hover, button:hover, input[type="submit"] {
    cursor: pointer;
  }

  // text editor
  .ql-editor {
    font-size: 18px;
  }

  .ql-snow .ql-picker {
    font-size: 15px;
  }

  .ql-snow .ql-editor .ql-syntax {
    font-family: "Consolas";
    font-size: 16px;
  }

  .ql-clipboard {
    display: none !important;
  }
`;

export default GlobalStyle;
