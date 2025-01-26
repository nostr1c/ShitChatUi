export const GetImageUrl = (avatarUri) => {
  const baseUrl = "https://localhost:7061/api/v1/user/avatar";
  return avatarUri ? `${baseUrl}/${avatarUri}` : `${baseUrl}/default.png`;
};