import { toast } from "react-toastify";

export const GetImageUrl = (image) => {
  const baseUrl = "https://api.filipsiri.se/api/v1/files";
  // const baseUrl = "http://localhost:8080/api/v1/files";
  return image ? `${baseUrl}/${image}` : `https://api.filipsiri.se/api/v1/files/default.png`;
};