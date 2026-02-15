import { useAtomValue } from "jotai";
import { Navigate } from "react-router-dom";
import { isAuthenticatedAtom, isAdminAtom, isSuperAdminAtom } from "../../atoms/authAtom";

interface Props {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin, requireSuperAdmin }: Props) {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const isAdmin = useAtomValue(isAdminAtom);
  const isSuperAdmin = useAtomValue(isSuperAdminAtom);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireSuperAdmin && !isSuperAdmin) return <Navigate to="/" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
}
