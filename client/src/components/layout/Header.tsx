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
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
            A
          </span>
          Appliences
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link className="text-slate-700 hover:text-slate-900" to="/">Products</Link>
          {isAdmin && <Link className="text-slate-700 hover:text-slate-900" to="/admin/products">Admin Panel</Link>}
          {isSuperAdmin && <Link className="text-slate-700 hover:text-slate-900" to="/admin/users">Manage Users</Link>}
          {user ? (
            <div className="flex items-center gap-3 rounded-full bg-slate-100 px-3 py-1.5">
              <span className="text-slate-700">{user.name}</span>
              <button
                onClick={logout}
                className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
