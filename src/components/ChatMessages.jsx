import { IoMdChatboxes } from "react-icons/io";
import MessageItem from "./MessageItem";

export default function ChatMessages({ messages, currentUser, roomMembers, onLoadMore, hasMore, previewImage }) {
  const messageCount = messages?.length || 0;

  return (
    <div className="Chat--Messages">
      {messages?.length > 0 ? (
        messages.map((m, i) => {
          const nextMsg = messages[i + 1];
          const isDifferentUser = !nextMsg || nextMsg.userId !== m.userId;
          const timeGap =
            !nextMsg || Math.abs(new Date(m.createdAt) - new Date(nextMsg.createdAt)) > 2 * 60 * 1000;
          const isMessageStart = isDifferentUser || timeGap;

          return (
            <MessageItem
              key={m.id}
              message={m}
              currentUser={currentUser}
              isMessageStart={isMessageStart}
              member={roomMembers?.[m.userId]}
              previewImage={previewImage}
            />
          );
        })
      ) : (
        <div className="Messages--Not-Found">
          <IoMdChatboxes />
          <h4>No messages.</h4>
          <p>Be the first one to be social.</p>
        </div>
      )}
      {messageCount >= 40 && hasMore && (
        <button
          className="Load-More"
          onClick={onLoadMore}
        >
          Load More
        </button>
        )}
    </div>
  );
}
