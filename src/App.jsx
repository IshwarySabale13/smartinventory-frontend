import { useState, useEffect } from "react";
import "./App.css";

import {
    LayoutDashboard,
    Package,
    Folder,
    Truck,
    ShoppingCart,
    Receipt,
    Boxes,
    TriangleAlert,
    LogOut,
    User,
    ShieldCheck,
    Menu,
    X
} from "lucide-react";

import Dashboard from "./Pages/Dashboard";
import Products from "./Pages/Products";
import Categories from "./Pages/Categories";
import Suppliers from "./Pages/Suppliers";
import Purchases from "./Pages/Purchases";
import Sales from "./Pages/Sales";
import Inventory from "./Pages/Inventory";
import LowStock from "./Pages/LowStock";


function App()
{
    const [username, setUsername] = useState(
        localStorage.getItem("username") || ""
    );

    const [password, setPassword] = useState("");

    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("token") !== null
    );

    const [role, setRole] = useState(
        localStorage.getItem("role")
    );

    const [currentPage, setCurrentPage] = useState(
        "dashboard"
    );

    const [sidebarOpen, setSidebarOpen] = useState(false);


    /* =========================================
       LOGOUT
    ========================================= */

    const handleLogout = () =>
    {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");

        setIsLoggedIn(false);
        setRole(null);
        setUsername("");
        setCurrentPage("dashboard");
        setSidebarOpen(false);
    };


    /* =========================================
       CHECK JWT TOKEN EXPIRATION
    ========================================= */

    useEffect(() =>
    {
        const checkTokenExpiration = () =>
        {
            const token =
                localStorage.getItem("token");

            if(!token)
            {
                return;
            }

            try
            {
                const payload =
                    JSON.parse(
                        atob(token.split(".")[1])
                    );

                const expirationTime =
                    payload.exp * 1000;

                if(Date.now() >= expirationTime)
                {
                    console.log(
                        "JWT token expired."
                    );

                    handleLogout();
                }
            }
            catch
            {
                console.log(
                    "Invalid JWT token."
                );

                handleLogout();
            }
        };

        checkTokenExpiration();

        const interval =
            setInterval(
                checkTokenExpiration,
                30000
            );

        return () =>
        {
            clearInterval(interval);
        };

    }, []);


    /* =========================================
       LOGIN
    ========================================= */

    const handleLogin = async (e) =>
    {
        e.preventDefault();

        try
        {
            const response =
                await fetch(
                    "http://localhost:8080/users/login",
                    {
                        method: "POST",

                        headers:
                        {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                            {
                                username:
                                    username,

                                password:
                                    password
                            })
                    }
                );

            if(!response.ok)
            {
                console.log(
                    "Login failed."
                );

                return;
            }

            const data =
                await response.json();

            console.log(
                "Login response:",
                data
            );

            if(data.token)
            {
                localStorage.setItem(
                    "token",
                    data.token
                );

                localStorage.setItem(
                    "role",
                    data.role
                );

                localStorage.setItem(
                    "username",
                    data.username
                );

                setIsLoggedIn(true);
                setRole(data.role);
                setUsername(data.username);

                setCurrentPage(
                    "dashboard"
                );

                setPassword("");

                console.log(
                    "Login successful"
                );
            }
            else
            {
                console.log(
                    "Login failed"
                );
            }
        }
        catch(error)
        {
            console.log(
                "Login error:",
                error
            );
        }
    };


    /* =========================================
       PAGE NAVIGATION
    ========================================= */

    const changePage = (page) =>
    {
        setCurrentPage(page);
        setSidebarOpen(false);
    };


    /* =========================================
       NAVIGATION ITEMS
    ========================================= */

    const navigationItems =
    [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: LayoutDashboard
        },

        {
            id: "products",
            label: "Products",
            icon: Package
        },

        {
            id: "categories",
            label: "Categories",
            icon: Folder
        },

        {
            id: "suppliers",
            label: "Suppliers",
            icon: Truck
        },

        {
            id: "purchases",
            label: "Purchases",
            icon: ShoppingCart
        },

        {
            id: "sales",
            label: "Sales",
            icon: Receipt
        },

        {
            id: "inventory",
            label: "Inventory",
            icon: Boxes
        },

        {
            id: "low-stock",
            label: "Low Stock",
            icon: TriangleAlert
        }
    ];


    /* =========================================
       PAGE TITLES
    ========================================= */

    const pageTitles =
    {
        dashboard: "Dashboard",
        products: "Products",
        categories: "Categories",
        suppliers: "Suppliers",
        purchases: "Purchases",
        sales: "Sales",
        inventory: "Inventory",
        "low-stock": "Low Stock"
    };


    /* =========================================
       LOGGED-IN APPLICATION
    ========================================= */

    if(isLoggedIn)
    {
        const CurrentPageIcon =
            navigationItems.find(
                item =>
                    item.id === currentPage
            )?.icon || LayoutDashboard;


        return (
            <div className="app-layout">


                {/* =================================
                    MOBILE OVERLAY
                ================================= */}

                {sidebarOpen && (
                    <div
                        className="sidebar-overlay"
                        onClick={() =>
                            setSidebarOpen(false)
                        }
                    />
                )}


                {/* =================================
                    SIDEBAR
                ================================= */}

                <aside
                    className={
                        sidebarOpen
                            ? "sidebar sidebar-open"
                            : "sidebar"
                    }
                >

                    {/* Brand */}

                    <div className="sidebar-brand">

                        <div className="sidebar-brand-icon">
                            SI
                        </div>

                        <div className="sidebar-brand-text">

                            <h2>
                                SmartInventory
                            </h2>

                            <span>
                                Inventory Management
                            </span>

                        </div>

                        <button
                            className="sidebar-close"
                            onClick={() =>
                                setSidebarOpen(false)
                            }
                        >
                            <X size={20} />
                        </button>

                    </div>


                    {/* Navigation */}

                    <div className="sidebar-section">

                        <div className="sidebar-section-title">
                            MAIN MENU
                        </div>


                        <nav className="sidebar-nav">

                            {navigationItems.map(
                                item =>
                                {
                                    const Icon =
                                        item.icon;

                                    return (
                                        <button
                                            key={item.id}
                                            className={
                                                currentPage === item.id
                                                    ? "sidebar-nav-item active"
                                                    : "sidebar-nav-item"
                                            }

                                            onClick={() =>
                                                changePage(
                                                    item.id
                                                )
                                            }
                                        >

                                            <Icon
                                                size={19}
                                                strokeWidth={2}
                                            />

                                            <span>
                                                {item.label}
                                            </span>

                                            {item.id ===
                                                "low-stock" &&
                                                (
                                                    <span className="sidebar-warning-dot" />
                                                )
                                            }

                                        </button>
                                    );
                                }
                            )}

                        </nav>

                    </div>


                    {/* Bottom user section */}

                    <div className="sidebar-bottom">

                        <div className="sidebar-user">

                            <div className="sidebar-user-avatar">
                                {username
                                    ? username
                                        .charAt(0)
                                        .toUpperCase()
                                    : "U"
                                }
                            </div>


                            <div className="sidebar-user-info">

                                <span className="sidebar-user-name">
                                    {username || "User"}
                                </span>

                                <span
                                    className={
                                        role === "ADMIN"
                                            ? "sidebar-role admin"
                                            : "sidebar-role user"
                                    }
                                >
                                    {role}
                                </span>

                            </div>

                        </div>


                        <button
                            className="sidebar-logout"
                            onClick={handleLogout}
                        >
                            <LogOut size={18} />

                            <span>
                                Logout
                            </span>
                        </button>

                    </div>

                </aside>


                {/* =================================
                    MAIN AREA
                ================================= */}

                <div className="app-main">


                    {/* =================================
                        TOP HEADER
                    ================================= */}

                    <header className="top-header">

                        <div className="top-header-left">

                            <button
                                className="mobile-menu-button"
                                onClick={() =>
                                    setSidebarOpen(true)
                                }
                            >
                                <Menu size={22} />
                            </button>


                            <div className="current-page-title">

                                <CurrentPageIcon
                                    size={21}
                                    strokeWidth={2}
                                />

                                <span>
                                    {pageTitles[currentPage]}
                                </span>

                            </div>

                        </div>


                        <div className="top-header-user">

                            <div className="top-user-avatar">
                                {username
                                    ? username
                                        .charAt(0)
                                        .toUpperCase()
                                    : "U"
                                }
                            </div>


                            <div className="top-user-details">

                                <span className="top-user-name">
                                    {username || "User"}
                                </span>

                                <span
                                    className={
                                        role === "ADMIN"
                                            ? "top-role admin"
                                            : "top-role user"
                                    }
                                >
                                    <ShieldCheck
                                        size={12}
                                    />

                                    {role}
                                </span>

                            </div>

                        </div>

                    </header>


                    {/* =================================
                        PAGE CONTENT
                    ================================= */}

                    <main className="app-content">

                        {currentPage === "dashboard" &&
                            <Dashboard />
                        }

                        {currentPage === "products" &&
                            <Products />
                        }

                        {currentPage === "categories" &&
                            <Categories />
                        }

                        {currentPage === "suppliers" &&
                            <Suppliers />
                        }

                        {currentPage === "purchases" &&
                            <Purchases />
                        }

                        {currentPage === "sales" &&
                            <Sales />
                        }

                        {currentPage === "inventory" &&
                            <Inventory />
                        }

                        {currentPage === "low-stock" &&
                            <LowStock />
                        }

                    </main>

                </div>

            </div>
        );
    }


    /* =========================================
       LOGIN PAGE
    ========================================= */

    return (
        <div className="login-page">

            <div className="login-card">

                <div className="login-logo">
                    SI
                </div>


                <h1>
                    SmartInventory
                </h1>


                <p className="login-subtitle">
                    Inventory Management System
                </p>


                <div className="login-welcome">
                    Welcome back! Please login to continue.
                </div>


                <form onSubmit={handleLogin}>

                    <div className="login-field">

                        <label>
                            Username
                        </label>

                        <div className="input-wrapper">

                            <span className="input-icon">
                                <User size={18} />
                            </span>

                            <input
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) =>
                                    setUsername(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>

                    </div>


                    <div className="login-field">

                        <label>
                            Password
                        </label>

                        <div className="input-wrapper">

                            <span className="input-icon">
                                🔒
                            </span>

                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>

                    </div>


                    <button
                        type="submit"
                        className="login-button"
                    >
                        Login
                    </button>

                </form>


                <div className="login-footer">
                    SmartInventory • Secure Access
                </div>

            </div>

        </div>
    );
}


export default App;