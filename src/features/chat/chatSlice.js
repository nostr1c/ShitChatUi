import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rooms: [],  // []
  messages: {}, // { roomId: [messages] }
  roomMembers: {}, // { roomId:  [users]} - Yes i wish i went with typescript....
  roomInfo: {} // { roomId: {data}}
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setRooms: (state, action) => {
      state.rooms = action.payload;
    },
    addMessage: (state, action) => {
      const { room, message } = action.payload;
      if (!state.messages[room]) state.messages[room] = [];
      
      const messageExists = state.messages[room].some((existingMessage) => existingMessage.id === message.id);
      
      if (!messageExists) {
        state.messages[room] = (message);
      }
    },
    pushMesage: (state, action) => {
      const { room, message } = action.payload;
      if (!state.messages[room]) state.messages[room] = [];
      
      const messageExists = state.messages[room].some((existingMessage) => existingMessage.id === message.id);
      
      if (!messageExists) {
        state.messages[room].push(message);
      }
    },
    addMembersToRoom: (state, action) => {
      const { room, members } = action.payload;
      state.roomMembers[room] = (members);
    },
    setRoomInfo: (state, action) => {
      const { room, data } = action.payload;
      state.roomInfo[room] = (data);
    }
  },
});

export const { 
  setRooms,
  addMessage,
  pushMesage,
  addMembersToRoom,
  setRoomInfo
} = chatSlice.actions;

export default chatSlice.reducer;