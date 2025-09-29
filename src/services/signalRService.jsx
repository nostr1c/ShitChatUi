import * as signalR from "@microsoft/signalr";
import {
  pushMesage,
  updateRoomActivity,
  setUserTyping,
  pushInvite,
  updateUserAvatar,
  updatePresence,
  pushMemberToRoom,
  removeMemberFromRoom,
  addRoleToUser,
  removeRoleFromUser,
  pushRoomRole,
  editRoomRole,
  incrementUnread,
  removeRoomFromUser,
  editRoom
} from "../redux/chat/chatSlice";

const SIGNALR_URL = "https://api.filipsiri.se/chatHub";
// const SIGNALR_URL = "https://localapi.test/chatHub";
 
class SignalRService {
  constructor() {
    this.connection = null;
    this.listenersAttached = false;
  }

  async startConnection(rooms) {
    if (this.connection && this.connection.state !== signalR.HubConnectionState.Disconnected) {
      // console.warn("SignalR is already connected or connecting."); 
      return;
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(SIGNALR_URL, { 
        withCredentials: true
      })
      // .configureLogging(signalR.LogLevel.Trace)
      .withAutomaticReconnect()
      .build();

    try {
      // Connect to signalr
      await this.connection.start();
      console.log("SignalR Connected");

      // Join groups based on rooms.
      rooms.forEach((group) => {
        this.invoke("JoinGroup", group.id).then(() => console.log(`Joined room: ${group.id}`))
          .catch((err) => console.error(`Failed to join room ${group.id}:`, err));
      });

    } catch (error) {
      console.error("SignalR Connection Error: ", error);
      setTimeout(() => this.startConnection(rooms), 5000);
    }
  }

  async invoke(methodName, ...args) {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      return this.connection.invoke(methodName, ...args);
    }
  }

  on(eventName, callback) {
    if (this.connection) {
      this.connection.on(eventName, callback);
    }
  }

  attachListeners(dispatch) {
    if (this.listenersAttached) return;

    this.on("ReceiveMessage", (message, room) => {
      dispatch(pushMesage({ room, message }));

      dispatch((dispatch, getState) => {
        const currentRoom = getState().chat.currentRoom;
        if (room !== currentRoom) {
          dispatch(incrementUnread(room));
        }
      });

      dispatch(updateRoomActivity({ room, message }));
    });

    this.on("ReceiveUserTyping", (room, user, isTyping) => {
      dispatch(setUserTyping({ room, user, isTyping }));
    });

    this.on("ReceiveInvite", (invite, room) => {
      dispatch(pushInvite({invite, room}));
    });

    this.on("ReceiveChangedAvatar", (userId, imageName) => {
      dispatch(updateUserAvatar({ userId, imageName} ));
    });

    this.on("PresenceUpdated", (room, users) => {
      dispatch(updatePresence({ room, users }))
    });

    this.on("ReceiveMember", (room, member) => {
      dispatch(pushMemberToRoom({ room, member }));
    })

    this.on("UserAddedRole", (room, user, role) => {
      dispatch(addRoleToUser({ room, user, role }));
    })

    this.on("UserRemovedRole", (room, user, role) => {
      dispatch(removeRoleFromUser({ room, user, role }));
    })

    this.on("RoleCreated", (room, role) => {
      dispatch(pushRoomRole( { room, role } ));
    })
    this.on("RoleEdited", (room, role) => {
      dispatch(editRoomRole( { room, role } ));
    })

    this.on("RemoveMember", (room, user) => {
      dispatch((dispatch, getState) => {
        const currentUser = getState().auth.user;

        if (currentUser.id == user) {
          dispatch(removeRoomFromUser({ room, user }))
        }
      });

      dispatch(removeMemberFromRoom( { room, user } ));
    })

      this.on("EditedRoom", (roomId, room) => {
      dispatch(editRoom( { roomId, room } ));
    })

    this.listenersAttached = true;
  }

  waitUntilConnected() {
    return new Promise((resolve) => {
      const check = () => {
        if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
          resolve();
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }
}

export const signalRService = new SignalRService();