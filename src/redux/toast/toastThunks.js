import { addToast, removeToast } from "./toastSlice";

export const showToast = (type, message) => async (dispatch) => {
  const toastContent = {
    type: type,
    message: message
  } 

  dispatch(addToast(toastContent));

  setTimeout(() => {
    dispatch(removeToast());
  }, 5000);
};