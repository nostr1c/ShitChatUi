import { useDispatch, useSelector } from "react-redux";
import { useApi } from "../services/useApi";
import { signalRService } from "../services/signalRService";
import { updateAvatar } from "../redux/auth/authSlice";
import { toast } from "react-toastify";

function EditProfile() {
    const api = useApi();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    
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
          toast.success(result.data.message)
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response.data);
      }
    };

  return (
    <div>
      <h2>This page is still not implemented</h2>
      <h4>But you can change your avatar:</h4><br />
      <form>
        <input type="file" accept=".jpg, .jpeg, .png" onChange={uploadAvatar} />
      </form>
    </div>
  )
}

export default EditProfile;