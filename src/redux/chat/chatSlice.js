import { createSlice } from "@reduxjs/toolkit";

const normalizeRoomMembers = (members) => {
  const normalized = {};
  members.forEach((member) => {
    normalized[member.user.id] = member;
  });
  return normalized;
};

const normalizeRoomRoles = (roles) => {
  const normalized = {};
  roles.forEach((role) => {
    normalized[role.id] = role;
  });
  return normalized;
}

const normalizeRooms = (rooms) => {
  const normalized = {};
  rooms.forEach((room) => {
    normalized[room.id] = room;
  });
  return normalized;
}

const normalizeRoomInvites = (invites) => {
  const normalized = {};
  invites.forEach((invite) => {
    normalized[invite.id] = invite;
  }
  );
  return normalized;
}

const normalizeRoomBans = (bans) => {
  const normalized = {};
  bans.forEach((ban) => {
    normalized[ban.id] = ban;
  }
  );
  return normalized;
}

const initialState = {
  rooms: {},
  messages: {},
  roomMembers: {},
  roomInvites: {},
  roomPresence: {},
  roomRoles: {},
  roomBans: {},
  currentRoom: null
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setRooms: (state, action) => {
      state.rooms = normalizeRooms(action.payload);
    },
    pushRoom: (state, action) => {
      const room = action.payload;
      state.rooms[room.id] = room;
    },
    setRoom: (state, action) => {
      const { room, data } = action.payload;
      state.rooms[room] = {
        ...state.rooms[room],
        ...data,
      }
    },
    setCurrentRoom: (state, action) => {
      const roomId = action.payload;
      state.currentRoom = roomId;

      if (state.rooms[roomId]) {
        state.rooms[roomId].unreadCount = 0;
      }
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

      if (state.rooms[room]) {
        state.rooms[room].lastActivity = message.createdAt;
      }
    },
    updateRoomActivity: (state, action) => {
      const { room, message } = action.payload;
      if (!state.rooms[room]) return;

      state.rooms[room].lastActivity = message.createdAt;

      const newRooms = { [room]: state.rooms[room]};
      Object.entries(state.rooms).forEach(([id, room]) => {
        if (id !== room) newRooms[id] = room;
      })
      state.rooms = newRooms;
    },
    addMembersToRoom: (state, action) => {
      const { room, members } = action.payload;
      state.roomMembers[room] = normalizeRoomMembers(members);
    },
    pushMemberToRoom: (state, action) => {
      const { room, member } = action.payload;
      
      state.roomMembers[room][member.user.id] = {
        ...member,
        roles: member.roles ?? []
      };
    },
    removeMemberFromRoom: (state, action) => {
      const { room, user } = action.payload;

      if (state.roomMembers[room]) {
        delete state.roomMembers[room][user];
      }
    },
    removeRoomFromUser: (state, action) => {
      const { room } = action.payload;

      delete state.rooms[room];
      delete state.messages[room];
      delete state.roomMembers[room];
      delete state.roomRoles[room];
      delete state.roomInvites[room];
      delete state.roomPresence[room];
    },
    deleteRoom: (state, action) => {
      const { roomId } = action.payload;

      delete state.rooms[roomId];
      delete state.messages[roomId];
      delete state.roomMembers[roomId];
      delete state.roomRoles[roomId];
      delete state.roomInvites[roomId];
      delete state.roomPresence[roomId];
    },
    updateUserAvatar: (state, action) => {
      const { userId, imageName } = action.payload;

      for (const room of Object.values(state.roomMembers)) {
        for (const member of Object.values(room)) {
          if (member.user.id === userId) {
            member.user.avatar = imageName;
          }
        }
      }
    },
    setRoomInvites: (state, action) => {
      const { room, data } = action.payload;
      state.roomInvites[room] = normalizeRoomInvites(data);
    },
    setRoomRoles: (state, action) => {
      const { room, data } = action.payload;
      state.roomRoles[room] = normalizeRoomRoles(data);
    },
    pushRoomRole: (state, action) => {
      const { room, role } = action.payload;
      if (!state.roomRoles[room]) state.roomRoles[room] = [];
      state.roomRoles[room][role.id] = role;
    },
    editRoomRole: (state, action) => {
      const { room, role } = action.payload;
      state.roomRoles[room][role.id] = role;
    },
    pushInvite: (state, action) => {
      const { room, invite } = action.payload;
      state.roomInvites[room][invite.id] = invite;
    },
    setUserTyping: (state, action) => {
      const {room, user, isTyping} = action.payload;
      
      const roomMembers = state.roomMembers[room];
      if (roomMembers && roomMembers[user]) {
        roomMembers[user].isTyping = isTyping;
      }
    },
    updatePresence: (state, action) => {
      const { room, users } = action.payload;
      state.roomPresence[room] = users;
    },
    addRoleToUser: (state, action) => {
      const { room, user, role } = action.payload;
      const member = state.roomMembers[room][user];
      if (!member.roles.includes(role)) {
        member.roles.push(role);
      }
    },
    removeRoleFromUser: (state, action) => {
      const { room, user, role } = action.payload;
      const member = state.roomMembers[room]?.[user];
      if (!member) return;

      member.roles = member.roles.filter((r) => r !== role);
    },
    incrementUnread: (state, action) => {
      const roomId = action.payload;

      if (!state.rooms[roomId])
        return

      if (!state.rooms[roomId].unreadCount) {
        state.rooms[roomId].unreadCount = 0;
      }

      state.rooms[roomId].unreadCount += 1;
    },
    editRoom: (state, action) => {
      const { roomId, room } = action.payload;
      if (state.rooms[roomId]) {
        state.rooms[roomId] = room;
      }
    },
    deleteInvite: (state, action) => {
      const {roomId, inviteId} = action.payload;
      delete state.roomInvites[roomId][inviteId];
    },
    setRoomBans: (state, action) => {
      const { roomId, bans } = action.payload;
      console.log(roomId)
      state.roomBans[roomId] = normalizeRoomBans(bans);
    },
    deleteBan: (state, action) => {
      const { roomId, banId } = action.payload;
      console.log(roomId, banId)
      delete state.roomBans[roomId][banId];
    }
  },
});

export const { 
  setRooms,
  pushRoom,
  setRoom,
  setCurrentRoom,
  addMessage,
  pushMesage,
  updateRoomActivity,
  addMembersToRoom,
  pushMemberToRoom,
  removeMemberFromRoom,
  setRoomInvites,
  setUserTyping,
  pushInvite,
  updateUserAvatar,
  updatePresence,
  setRoomRoles,
  addRoleToUser,
  removeRoleFromUser,
  pushRoomRole,
  editRoomRole,
  incrementUnread,
  removeRoomFromUser,
  editRoom,
  deleteRoom,
  deleteInvite,
  setRoomBans,
  deleteBan
} = chatSlice.actions;

export default chatSlice.reducer;