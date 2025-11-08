import FriendItem from "./FriendItem";

function FriendSection({title, data, emptyText, renderActions}) {
  return (
    <div className="FriendSection">
      <h4>{title}</h4>
      <div className="FriendList">
        {(!data || data.length === 0) && <p className="EmptyText">{emptyText}</p>}
        {data?.map((c) => (
          <FriendItem
            key={c.user.id}
            user={c.user}
            actions={renderActions(c.user)}
          />
        ))}
      </div>
    </div>
  )
}

export default FriendSection;