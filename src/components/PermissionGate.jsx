import { usePermission } from "../services/usePermission";

export default function PermissionGate({ roomId, userId, permissions, children }) {
  const allowed = usePermission(roomId, userId, permissions);

  if (!allowed) return null;

  return <>{children}</>;
}