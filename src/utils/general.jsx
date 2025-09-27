import { toast } from "react-toastify";

export const GetImageUrl = (image) => {
  const baseUrl = "https://api.filipsiri.se/api/v1/files";
  // const baseUrl = "https://localapi.test/api/v1/files";
  return image ? `${baseUrl}/${image}` : `${baseUrl}/default.png`;
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