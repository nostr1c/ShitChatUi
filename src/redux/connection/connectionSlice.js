import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  connections: null,
};

const connectionSlice = createSlice({
  name: "connection",
  initialState,
  reducers: {
    setConnections: (state, action) => {
      state.connections = action.payload;
    },
    pushReceivedConnection: (state, action) => {
      const { connection } = action.payload;
      state.connections.receivedRequests.push(connection);
    },
    pushSentConnection: (state, action) => {
      const { connection } = action.payload;
      console.log(connection);
      state.connections.sentRequests.push(connection);
    },
    pushAcceptedConnection: (state, action) => {
      const { connection } = action.payload;
      state.connections.sentRequests = state.connections.sentRequests.filter((prev) => prev.id != connection.id);
      state.connections.accepted.push(connection);
      state.connections.receivedRequests = state.connections.receivedRequests.filter((prev) => prev.id != connection.id);
    },
    deleteConnection: (state, action) => {
      const { connection } = action.payload;
      state.connections.sentRequests = state.connections.sentRequests.filter((prev) => prev.id != connection.id);
      state.connections.receivedRequests = state.connections.receivedRequests.filter((prev) => prev.id != connection.id);
      state.connections.accepted = state.connections.accepted.filter((prev) => prev.id != connection.id);
    }
  },
});

export const {
    setConnections,
    pushReceivedConnection,
    pushSentConnection,
    pushAcceptedConnection,
    deleteConnection
} = connectionSlice.actions;
export default connectionSlice.reducer;