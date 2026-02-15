import { Link } from "react-router-dom";
import { useAtomValue } from "jotai";
import { userAtom, isAdminAtom, isSuperAdminAtom } from "../../atoms/authAtom";
import { useAuth } from "../../hooks/useAuth";

export default function Header() {
  const user = useAtomValue(userAtom);
  const isAdmin = useAtomValue(isAdminAtom);
  const isSuperAdmin = useAtomValue(isSuperAdminAtom);
  const { logout } = useAuth();

  return (
    <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #ddd" }}>
      <Link to="/" style={{ fontSize: 20, fontWeight: "bold", textDecoration: "none", color: "#333" }}>
        Appliences
      </Link>
      <nav style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Link to="/">Products</Link>
        {isAdmin && <Link to="/admin/products">Admin Panel</Link>}
        {isSuperAdmin && <Link to="/admin/users">Manage Users</Link>}
        {user ? (
          <>
            <span>{user.name}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}
