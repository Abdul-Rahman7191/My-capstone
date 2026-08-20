import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout({ currentUser, onLogout }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#eef1f6]">
      <Sidebar currentUser={currentUser} onLogout={onLogout} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}