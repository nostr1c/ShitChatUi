import { showToast } from "../redux/toast/toastThunks";

export const GetImageUrl = (avatarUri) => {
  const baseUrl = "https://api.filipsiri.se/api/v1/user/avatar";
  // const baseUrl = "https://localapi.test/api/v1/user/avatar";
  return avatarUri ? `${baseUrl}/${avatarUri}` : `${baseUrl}/default.png`;
};

// Show toast for each error message.
export const handleApiErrors = (dispatch, errors) => {
  if (!errors) return;

  Object.entries(errors).forEach(([_, messages]) => {
    messages.forEach((message) => {
      dispatch(showToast("error", message));
    });
  });
};