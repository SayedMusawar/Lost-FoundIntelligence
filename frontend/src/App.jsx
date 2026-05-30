import { useState } from "react";
import Login from "./pages/Login";
import ItemList from "./pages/ItemList";
import RegisterItem from "./pages/RegisterItem";
import ClaimItem from "./pages/ClaimItem";
import AdminDashboard from "./pages/AdminDashboard";
import IssueReceipt from "./pages/IssueReceipt";
import MyClaims from "./pages/MyClaims";
import Notifications from "./pages/Notifications";
import Layout from "./components/Layout";

const ROLE_PAGES = {
  register: ["staff", "admin"],
  claim: ["student", "faculty"],
  admin: ["admin"],
  receipt: ["admin", "staff"],
  myclaims: ["student", "faculty"],
  notifications: ["student", "faculty"],
};

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("items");
  const [selectedItem, setSelectedItem] = useState(null);

  const logout = () => {
    setUser(null);
    setPage("items");
    setSelectedItem(null);
  };

  const navigate = (target) => {
    const allowed = ROLE_PAGES[target];
    if (!allowed || allowed.includes(user?.role)) setPage(target);
  };

  if (!user)
    return (
      <Login
        onLogin={(u) => {
          setUser(u);
          setPage("items");
        }}
      />
    );

  const pageContent = () => {
    if (page === "register" && ["staff", "admin"].includes(user.role))
      return <RegisterItem user={user} onBack={() => setPage("items")} />;
    if (page === "claim" && ["student", "faculty"].includes(user.role))
      return (
        <ClaimItem
          item={selectedItem}
          user={user}
          onBack={() => setPage("items")}
        />
      );
    if (page === "admin" && user.role === "admin")
      return (
        <AdminDashboard user={user} onReceipt={() => setPage("receipt")} />
      );
    if (page === "receipt" && ["admin", "staff"].includes(user.role))
      return <IssueReceipt user={user} onBack={() => setPage("admin")} />;
    if (page === "myclaims" && ["student", "faculty"].includes(user.role))
      return <MyClaims user={user} />;
    if (page === "notifications" && ["student", "faculty"].includes(user.role))
      return <Notifications user={user} />;
    return (
      <ItemList
        user={user}
        onClaim={(item) => {
          setSelectedItem(item);
          setPage("claim");
        }}
      />
    );
  };

  return (
    <Layout
      user={user}
      currentPage={page}
      onNavigate={navigate}
      onLogout={logout}
    >
      {pageContent()}
    </Layout>
  );
}
