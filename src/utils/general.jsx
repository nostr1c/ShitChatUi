export const GetImageUrl = (avatarUri) => {
  const baseUrl = "https://api.filipsiri.se/api/v1/user/avatar";
  // const baseUrl = "http://localhost:8080/api/v1/user/avatar";
  return avatarUri ? `${baseUrl}/${avatarUri}` : `${baseUrl}/default.png`;
};