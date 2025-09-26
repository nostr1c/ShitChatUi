import { toast } from "react-toastify";

export const GetImageUrl = (avatarUri) => {
  const baseUrl = "https://api.filipsiri.se/api/v1/user/avatar";
  // const baseUrl = "https://localapi.test/api/v1/user/avatar";
  return avatarUri ? `${baseUrl}/${avatarUri}` : `${baseUrl}/default.png`;
};

// Show toast for each error message.
export const handleApiErrors = (errors) => {
  if (!errors) return;

  Object.entries(errors).forEach(([_, messages]) => {
    messages.forEach((message) => {
      toast.error(message)
    });
  });
};