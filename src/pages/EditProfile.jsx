import { useDispatch, useSelector } from "react-redux";
import { useApi } from "../services/useApi";
import { fetchUser } from "../features/auth/authThunks";
import { showToast } from "../features/toast/toastThunks";

function EditProfile() {
    const api = useApi();
    const dispatch = useDispatch();
    
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
          dispatch(fetchUser());
          dispatch(showToast("success", result.data.message));
        }
      } catch (error) {
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