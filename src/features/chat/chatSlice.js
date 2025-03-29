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
      
      if (state.messages[room].length > 0) {
        const existingMessageIds = new Set(state.messages[room].map((msg) => msg.id));
        const newMessages = message.filter((msg) => !existingMessageIds.has(msg.id));

        state.messages[room] = [ ...state.messages[room], ...newMessages ]
      } else {
        state.messages[room] = (message);
      }
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