import { createSlice } from "@reduxjs/toolkit";

const normalizeRoomMembers = (members) => {
  const normalized = {};
  members.forEach((member) => {
    normalized[member.user.id] = member;
  });
  return normalized;
};

const initialState = {
  rooms: [],  // []
  messages: {}, // { roomId: [messages] }
  roomMembers: {}, // { roomId:  [users]} - Yes i wish i went with typescript....
  roomInfo: {}, // { roomId: {data}}
  roomInvites: {} // { roomId: {data} }
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setRooms: (state, action) => {
      state.rooms = action.payload;
    },
    pushRoom: (state, action) => {
      state.rooms.unshift(action.payload);
    },
    addMessage: (state, action) => {
      const { room, message } = action.payload;
      const incomingMessages = Array.isArray(message) ? message : [message];
    
      if (!state.messages[room]) {
        state.messages[room] = [];
      }
    
      const existingMessageIds = new Set(state.messages[room].map((msg) => msg.id));
      const newMessages = incomingMessages.filter((msg) => !existingMessageIds.has(msg.id));
    
      state.messages[room] = [...state.messages[room], ...newMessages];
    },
    pushMesage: (state, action) => {
      const { room, message } = action.payload;
      if (!state.messages[room]) state.messages[room] = [];
      state.messages[room].unshift(message);
    },
    addMembersToRoom: (state, action) => {
      const { room, members } = action.payload;
      state.roomMembers[room] = normalizeRoomMembers(members);
    },
    updateUserAvatar: (state, action) => {
      const { userId, imageName } = action.payload;
      console.log(userId, imageName);

      for (const room of Object.values(state.roomMembers)) {
        for (const member of Object.values(room)) {
          if (member.user.id === userId) {
            member.user.avatar = imageName;
            console.log("updated 1")
          }
        }
      }
    },
    setRoomInfo: (state, action) => {
      const { room, data } = action.payload;
      state.roomInfo[room] = (data);
    },
    setRoomInvites: (state, action) => {
      const { room, data } = action.payload;
      state.roomInvites[room] = (data);
    },
    pushInvite: (state, action) => {
      const { room, invite } = action.payload;
      if (!state.roomInvites[room]) state.roomInvites[room] = [];
      state.roomInvites[room].unshift(invite);
    },
    setUserTyping: (state, action) => {
      const {room, user, isTyping} = action.payload;
      
      const roomMembers = state.roomMembers[room];
      if (roomMembers && roomMembers[user]) {
        roomMembers[user].isTyping = isTyping;
      }
    }
  },
});

export const { 
  setRooms,
  pushRoom,
  addMessage,
  pushMesage,
  addMembersToRoom,
  setRoomInfo,
  setRoomInvites,
  setUserTyping,
  pushInvite,
  updateUserAvatar
} = chatSlice.actions;

export default chatSlice.reducer;