export default function authHeader() {
  const obj = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SIGNIN_KEY));
  
  if (obj && obj.accessToken) {
    return { Authorization: obj.accessToken }; 	
  } else {
    return {};
  }
}