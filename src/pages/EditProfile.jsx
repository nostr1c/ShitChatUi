import { useDispatch, useSelector } from "react-redux";
import { useApi } from "../services/useApi";
import { showToast } from "../redux/toast/toastThunks";
import { signalRService } from "../services/signalRService";
import { updateAvatar } from "../redux/auth/authSlice";

function EditProfile() {
    const api = useApi();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    
    const triggerToast = () => {
      dispatch(showToast("success", "This is a success message!"));
    };

    const uploadAvatar = async (e) => {
      e.preventDefault();
      try {
        const file = e.target.files[0];
        if (file) {
          const formData = new FormData();
          formData.append("avatar", file);
          const result = await api.put("/user/avatar", formData);

          dispatch(updateAvatar(result?.data?.data));
          await signalRService.invoke("ChangeAvatar", user?.id, result?.data?.data);
          dispatch(showToast("success", result.data.message));
        }
      } catch (error) {
        console.log(error)
        dispatch(showToast("error", error.response.data));
      }
    };

  return (
    <div>
      <form>
        <input type="file" accept=".jpg, .jpeg, .png" onChange={uploadAvatar} />
      </form>

      <button onClick={triggerToast}>Show Toast</button>
    </div>
  )
}

export default EditProfile;