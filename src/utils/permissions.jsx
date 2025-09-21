export function userHasPermission(roomRoles, roomMembers, room, roomId, userId, permissions = []) {

  // If room owner, always return true
  if (room && room.ownerId === userId) return true;

  // If user is not member of room, return false.
  const member = roomMembers?.[roomId]?.[userId];
  if (!member) return false;

  // All user roles.
  const roles = member.roles
    .map(roleId => roomRoles?.[roomId]?.[roleId])
    .filter(Boolean);

  // All roles
  const allPermissions = roles.flatMap(role => role.permissions || []);
  
  // If any of the roles.
  return permissions.some(p => allPermissions.includes(p));
}