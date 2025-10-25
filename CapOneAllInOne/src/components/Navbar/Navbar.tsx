import { Link, useLocation } from "react-router-dom";
import { CreditCard, TrendingUp, Home, BarChart3, Users } from "lucide-react";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: "/Accounts", icon: CreditCard, label: "Accounts" },
    { path: "/Stocks", icon: TrendingUp, label: "Stocks" },
    { path: "/", icon: Home, label: "Home" },
    { path: "/Analytics", icon: BarChart3, label: "Analytics" },
    { path: "/Groups", icon: Users, label: "Groups" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? "active" : ""}`}
              aria-label={item.label}
            >
              <div className="icon-wrapper">
                <Icon size={28} strokeWidth={2} />
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default Navbar;
