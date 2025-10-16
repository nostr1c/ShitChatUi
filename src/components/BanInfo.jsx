import "./scss/BanInfo.scss"
function BanInfo({ ban }) {
  return (
    <div className="BanInfo">
      <div className="BanInfo--Child">
        <p>Banned by:</p>
        <p>{ban.bannedByUser.username}</p>
      </div>
      <div className="BanInfo--Child">
        <p>Reason:</p>
        <p>{ban.reason || "No reason"}</p>
      </div>
      <div className="BanInfo--Child Date">
        <p>Banned on:</p>
        <p>{new Date(ban.createdAt).toLocaleString()}</p>
      </div>
    </div>
  )
}

export default BanInfo;