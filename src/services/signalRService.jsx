import * as signalR from "@microsoft/signalr";
import { pushMesage, setUserTyping, pushInvite, updateUserAvatar } from "../features/chat/chatSlice";

const SIGNALR_URL = "https://api.filipsiri.se/chatHub";

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
      .withUrl(SIGNALR_URL)
      .withAutomaticReconnect()
      .build();

    try {
      await this.connection.start();
      console.log("SignalR Connected");

      rooms.forEach((group) => {
        this.invoke("JoinGroup", group.id)
          .then(() => console.log(`Joined room: ${group.id}`))
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