import { useState, useEffect } from "react";

import {
    Package,
    Truck,
    ShoppingCart,
    Receipt,
    TriangleAlert,
    IndianRupee
} from "lucide-react";

import { apiFetch } from "../api";


function Dashboard()
{
    const [totalProducts, setTotalProducts] =
        useState(0);

    const [totalSuppliers, setTotalSuppliers] =
        useState(0);

    const [totalPurchases, setTotalPurchases] =
        useState(0);

    const [totalSales, setTotalSales] =
        useState(0);

    const [lowStockCount, setLowStockCount] =
        useState(0);

    const [inventoryValue, setInventoryValue] =
        useState(0);

    const [lowStockProducts, setLowStockProducts] =
        useState([]);

    const [message, setMessage] =
        useState("");


    // =========================
    // Load Dashboard Data
    // =========================

    useEffect(() =>
    {
        const loadDashboardData = async () =>
        {
            try
            {
                // Total Products
                const productsResponse =
                    await apiFetch(
                        "/dashboard/products"
                    );

                if(productsResponse.ok)
                {
                    const data =
                        await productsResponse.json();

                    setTotalProducts(data);
                }


                // Total Suppliers
                const suppliersResponse =
                    await apiFetch(
                        "/dashboard/suppliers"
                    );

                if(suppliersResponse.ok)
                {
                    const data =
                        await suppliersResponse.json();

                    setTotalSuppliers(data);
                }


                // Total Purchases
                const purchasesResponse =
                    await apiFetch(
                        "/dashboard/purchases"
                    );

                if(purchasesResponse.ok)
                {
                    const data =
                        await purchasesResponse.json();

                    setTotalPurchases(data);
                }


                // Total Sales
                const salesResponse =
                    await apiFetch(
                        "/dashboard/sales"
                    );

                if(salesResponse.ok)
                {
                    const data =
                        await salesResponse.json();

                    setTotalSales(data);
                }


                // Low Stock Count
                const lowStockResponse =
                    await apiFetch(
                        "/dashboard/low-stock"
                    );

                if(lowStockResponse.ok)
                {
                    const data =
                        await lowStockResponse.json();

                    setLowStockCount(data);
                }


                // Inventory Value
                const inventoryValueResponse =
                    await apiFetch(
                        "/dashboard/inventory-value"
                    );

                if(inventoryValueResponse.ok)
                {
                    const data =
                        await inventoryValueResponse.json();

                    setInventoryValue(data);
                }


                // Low Stock Products
                const lowStockProductsResponse =
                    await apiFetch(
                        "/inventory/low-stock"
                    );

                if(lowStockProductsResponse.ok)
                {
                    const data =
                        await lowStockProductsResponse.json();

                    setLowStockProducts(data);
                }
            }
            catch(error)
            {
                console.log(
                    "Error loading dashboard:",
                    error
                );

                setMessage(
                    "Something went wrong while loading dashboard."
                );
            }
        };


        loadDashboardData();

    }, []);


    return (
        <div className="dashboard-page">

            {/* =========================
                ERROR MESSAGE
            ========================= */}

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}


            {/* =========================
                PAGE HEADER
            ========================= */}

            <div className="dashboard-header">

                <div>

                    <h1>
                        Dashboard

                        <span className="dashboard-live">
                            <span className="live-dot">
                            </span>

                            Live
                        </span>
                    </h1>

                    <p>
                        Overview of your inventory and
                        business activity
                    </p>

                </div>

            </div>


            {/* =========================
                DASHBOARD CARDS
            ========================= */}

            <div className="dashboard-cards">

                {/* Products */}

                <div className="dashboard-card">

                    <div className="dashboard-card-top">

                        <div className="dashboard-card-icon">
                            <Package size={22} />
                        </div>

                        <span className="dashboard-card-label">
                            Products
                        </span>

                    </div>

                    <div className="dashboard-card-value">
                        {totalProducts}
                    </div>

                    <div className="dashboard-card-description">
                        Total products
                    </div>

                </div>


                {/* Suppliers */}

                <div className="dashboard-card">

                    <div className="dashboard-card-top">

                        <div className="dashboard-card-icon">
                            <Truck size={22} />
                        </div>

                        <span className="dashboard-card-label">
                            Suppliers
                        </span>

                    </div>

                    <div className="dashboard-card-value">
                        {totalSuppliers}
                    </div>

                    <div className="dashboard-card-description">
                        Registered suppliers
                    </div>

                </div>


                {/* Purchases */}

                <div className="dashboard-card">

                    <div className="dashboard-card-top">

                        <div className="dashboard-card-icon purchase-icon">
                            <ShoppingCart size={22} />
                        </div>

                        <span className="dashboard-card-label">
                            Purchases
                        </span>

                    </div>

                    <div className="dashboard-card-value">
                        {totalPurchases}
                    </div>

                    <div className="dashboard-card-description">
                        Total purchase transactions
                    </div>

                </div>


                {/* Sales */}

                <div className="dashboard-card">

                    <div className="dashboard-card-top">

                        <div className="dashboard-card-icon sales-icon">
                            <Receipt size={22} />
                        </div>

                        <span className="dashboard-card-label">
                            Sales
                        </span>

                    </div>

                    <div className="dashboard-card-value">
                        {totalSales}
                    </div>

                    <div className="dashboard-card-description">
                        Total sales transactions
                    </div>

                </div>


                {/* Low Stock */}

                <div className="dashboard-card low-stock-card">

                    <div className="dashboard-card-top">

                        <div className="dashboard-card-icon low-stock-icon">
                            <TriangleAlert size={22} />
                        </div>

                        <span className="dashboard-card-label">
                            Low Stock
                        </span>

                    </div>

                    <div className="dashboard-card-value">
                        {lowStockCount}
                    </div>

                    <div className="dashboard-card-description">
                        Products need attention
                    </div>

                </div>


                {/* Inventory Value */}

                <div className="dashboard-card inventory-value-card">

                    <div className="dashboard-card-top">

                        <div className="dashboard-card-icon inventory-icon">
                            <IndianRupee size={22} />
                        </div>

                        <span className="dashboard-card-label">
                            Inventory Value
                        </span>

                    </div>

                    <div className="dashboard-card-value">
                        ₹
                        {Number(inventoryValue)
                            .toLocaleString("en-IN")}
                    </div>

                    <div className="dashboard-card-description">
                        Current inventory value
                    </div>

                </div>

            </div>


            {/* =========================
                INVENTORY OVERVIEW
            ========================= */}

            <div className="dashboard-info-section">

                <div className="dashboard-info-header">

                    <h2>
                        Inventory Overview
                    </h2>

                    <p>
                        Monitor your inventory performance
                        from one place.
                    </p>

                </div>


                <div className="dashboard-info-items">

                    {/* Products */}

                    <div className="dashboard-info-item">

                        <div className="dashboard-info-icon">
                            <Package size={20} />
                        </div>

                        <div>

                            <strong>
                                {totalProducts}
                            </strong>

                            <span>
                                Products currently managed
                            </span>

                        </div>

                    </div>


                    {/* Low Stock */}

                    <div className="dashboard-info-item">

                        <div className="dashboard-info-icon warning-info-icon">
                            <TriangleAlert size={20} />
                        </div>

                        <div>

                            <strong>
                                {lowStockCount}
                            </strong>

                            <span>
                                Products with low stock
                            </span>

                        </div>

                    </div>


                    {/* Inventory Value */}

                    <div className="dashboard-info-item">

                        <div className="dashboard-info-icon value-info-icon">
                            <IndianRupee size={20} />
                        </div>

                        <div>

                            <strong>
                                ₹
                                {Number(inventoryValue)
                                    .toLocaleString("en-IN")}
                            </strong>

                            <span>
                                Current inventory value
                            </span>

                        </div>

                    </div>

                </div>

            </div>


            {/* =========================
                LOW STOCK ALERTS
            ========================= */}

            <div className="dashboard-alert-section">

                <div className="dashboard-section-header">

                    <div>

                        <h2>
                            Low Stock Alerts
                        </h2>

                        <p>
                            Products that may need to
                            be restocked.
                        </p>

                    </div>


                    <div className="alert-count">

                        {lowStockProducts.length}

                        {" "}

                        {lowStockProducts.length === 1
                            ? "item"
                            : "items"}

                    </div>

                </div>


                {lowStockProducts.length > 0 ? (

                    <div className="low-stock-list">

                        {lowStockProducts.map(
                            product => (

                                <div
                                    className="low-stock-row"
                                    key={product.id}
                                >

                                    {/* Product */}

                                    <div className="low-stock-product">

                                        <div className="low-stock-product-icon">

                                            <Package size={18} />

                                        </div>


                                        <div>

                                            <strong>
                                                {product.name}
                                            </strong>

                                            <span>
                                                Product ID:{" "}
                                                {product.id}
                                            </span>

                                        </div>

                                    </div>


                                    {/* Price */}

                                    <div className="low-stock-price">

                                        ₹
                                        {Number(
                                            product.price
                                        ).toLocaleString(
                                            "en-IN"
                                        )}

                                    </div>


                                    {/* Stock Warning */}

                                    <div className="stock-warning">

                                        <TriangleAlert
                                            size={15}
                                        />

                                        <span>

                                            {product.quantity}

                                            {" "}

                                            {product.quantity === 1
                                                ? "unit"
                                                : "units"}

                                            {" "}left

                                        </span>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                ) : (

                    <div className="no-low-stock">

                        <Package size={22} />

                        <span>
                            All products have sufficient
                            stock.
                        </span>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Dashboard;