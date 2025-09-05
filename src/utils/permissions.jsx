export function userHasPermission(roomRoles, roomMembers, roomInfo, roomId, userId, permissions = []) {
  const room = roomInfo?.[roomId];
  if (room && room.ownerId === userId) return true;

  const member = roomMembers?.[roomId]?.[userId];
  if (!member) return false;

  const roles = member.roles
    .map(roleId => roomRoles?.[roomId]?.[roleId])
    .filter(Boolean);

  const allPermissions = roles.flatMap(role => role.permissions || []);
  
  return permissions.some(p => allPermissions.includes(p));
}