import { useState } from "react";
import Login from "./pages/Login";
import ItemList from "./pages/ItemList";
import RegisterItem from "./pages/RegisterItem";
import ClaimItem from "./pages/ClaimItem";
import AdminDashboard from "./pages/AdminDashboard";
import IssueReceipt from "./pages/IssueReceipt";
import MyClaims from "./pages/MyClaims";
import Notifications from "./pages/Notifications";

const CAN_REGISTER = ["staff", "admin"];
const CAN_CLAIM = ["student", "faculty"];
const CAN_ADMIN = ["admin"];
const CAN_RECEIPT = ["admin", "staff"];
const CAN_MYCLAIMS = ["student", "faculty"];
const CAN_NOTIFICATIONS = ["student", "faculty"];

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("items");
  const [selectedItem, setSelectedItem] = useState(null);

  const logout = () => {
    setUser(null);
    setPage("items");
    setSelectedItem(null);
  };

  const goTo = (targetPage, allowedRoles) => {
    if (allowedRoles.includes(user?.role)) {
      setPage(targetPage);
    } else {
      alert(`Access denied. Only ${allowedRoles.join("/")} can access this.`);
    }
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

  if (page === "register") {
    if (!CAN_REGISTER.includes(user.role)) {
      setPage("items");
      return null;
    }
    return <RegisterItem user={user} onBack={() => setPage("items")} />;
  }

  if (page === "claim") {
    if (!CAN_CLAIM.includes(user.role)) {
      setPage("items");
      return null;
    }
    return (
      <ClaimItem
        item={selectedItem}
        user={user}
        onBack={() => setPage("items")}
      />
    );
  }

  if (page === "admin") {
    if (!CAN_ADMIN.includes(user.role)) {
      setPage("items");
      return null;
    }
    return (
      <AdminDashboard
        user={user}
        onBack={() => setPage("items")}
        onReceipt={() => setPage("receipt")}
        onLogout={logout}
      />
    );
  }

  if (page === "receipt") {
    if (!CAN_RECEIPT.includes(user.role)) {
      setPage("items");
      return null;
    }
    return <IssueReceipt user={user} onBack={() => setPage("admin")} />;
  }

  if (page === "myclaims") {
    if (!CAN_MYCLAIMS.includes(user.role)) {
      setPage("items");
      return null;
    }
    return <MyClaims user={user} onBack={() => setPage("items")} />;
  }

  if (page === "notifications") {
    if (!CAN_NOTIFICATIONS.includes(user.role)) {
      setPage("items");
      return null;
    }
    return <Notifications user={user} onBack={() => setPage("items")} />;
  }

  return (
    <ItemList
      user={user}
      onLogout={logout}
      onRegister={() => goTo("register", CAN_REGISTER)}
      onClaim={(item) => {
        if (CAN_CLAIM.includes(user.role)) {
          setSelectedItem(item);
          setPage("claim");
        } else {
          alert("Only students and faculty can submit claims.");
        }
      }}
      onAdmin={() => goTo("admin", CAN_ADMIN)}
      onMyClaims={() => goTo("myclaims", CAN_MYCLAIMS)}
      onNotifications={() => goTo("notifications", CAN_NOTIFICATIONS)}
    />
  );
}
