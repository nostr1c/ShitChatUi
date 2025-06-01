export const GetImageUrl = (avatarUri) => {
  // const baseUrl = "https://api.filipsiri.se/api/v1/user/avatar";
  const baseUrl = "https://localapi.test/api/v1/user/avatar";
  return avatarUri ? `${baseUrl}/${avatarUri}` : `${baseUrl}/default.png`;
};