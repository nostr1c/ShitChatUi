import { createSlice } from "@reduxjs/toolkit";

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
      state.roomMembers[room] = (members);
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
      if (state.roomMembers[room]) {
        const member = state.roomMembers[room].find(member => member.user.id === user);
        if (member) {
          member.isTyping = isTyping;
        }
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
  pushInvite
} = chatSlice.actions;

export default chatSlice.reducer;