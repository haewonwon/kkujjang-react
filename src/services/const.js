export const PUBLIC_URL = process.env.PUBLIC_URL;
export const BASE_URL = process.env.REACT_APP_BASE_URL;
export const SOCKET_PATH = process.env.REACT_APP_SOCKET_PATH;

const KAKAO_CLIENT_ID = process.env.REACT_APP_KAKAO_CLIENT_ID;
const REDIRECT_URI = `${PUBLIC_URL}/member/kakao`;
export const KAKAO_LOGIN_LINK = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;

// 프록시
export const PROXY_URL = "https://proxy.cors.sh";
export const CORS_API_KEY = "temp_6100291d60beafafefc8a0c0f68d40b4";
