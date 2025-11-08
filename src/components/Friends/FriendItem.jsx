import { GetImageUrl } from "../../utils/general";

function FriendItem({ user, actions }) {
  return (
    <div className="FriendCard">
      <img src={GetImageUrl(user.avatar)}/>
      <div className="FriendCard--Info">
        <p>{user.username}</p>
        <div className="FriendCard--Actions">
          {actions.map(({ label, variant, onClick }) => (
            <button
              key={label}
              className={`FriendCard--Btn ${variant}`}
              onClick={onClick}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FriendItem;