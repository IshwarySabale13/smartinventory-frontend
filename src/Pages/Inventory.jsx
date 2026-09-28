import { useState, useEffect } from "react";
import { apiFetch } from "../api";

function Inventory()
{
    const [inventory, setInventory] = useState([]);
    const [message, setMessage] = useState("");

    // =========================
    // Load Inventory
    // =========================

    useEffect(() =>
    {
        loadInventory();
    }, []);


    const loadInventory = async () =>
    {
        try
        {
            const response =
                await apiFetch("/inventory");

            if(response.ok)
            {
                const data =
                    await response.json();

                console.log(
                    "Inventory:",
                    data
                );

                setInventory(data);
            }
            else
            {
                setMessage(
                    "Failed to load inventory."
                );
            }
        }
        catch(error)
        {
            console.log(
                "Error loading inventory:",
                error
            );

            setMessage(
                "Something went wrong while loading inventory."
            );
        }
    };


    // =========================
    // Inventory Calculations
    // =========================

    const totalProducts =
        inventory.length;


    const totalUnits =
        inventory.reduce(
            (total, item) =>
                total + Number(item.quantity || 0),
            0
        );


    const lowStockProducts =
        inventory.filter(
            item =>
                Number(item.quantity || 0) <= 5
        ).length;


    // =========================
    // Format Price
    // =========================

    const formatPrice = (price) =>
    {
        return Number(price || 0).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
        );
    };


    // =========================
    // UI
    // =========================

    return (
        <div className="products-page inventory-page">

            {/* =========================
                Error / Message
            ========================= */}

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}


            {/* =========================
                Page Header
            ========================= */}

            <div className="products-header">

                <div>

                    <h1>
                        📦 Inventory
                    </h1>

                    <p>
                        View current stock of all products.
                    </p>

                </div>

            </div>


            {/* =========================
                Inventory Summary Cards
            ========================= */}

            <div className="inventory-summary">

                {/* Total Products */}

                <div className="inventory-summary-card">

                    <div className="inventory-summary-icon">
                        📦
                    </div>

                    <div className="inventory-summary-content">

                        <span className="inventory-summary-label">
                            Total Products
                        </span>

                        <strong className="inventory-summary-value">
                            {totalProducts}
                        </strong>

                    </div>

                </div>


                {/* Total Units */}

                <div className="inventory-summary-card">

                    <div className="inventory-summary-icon">
                        📊
                    </div>

                    <div className="inventory-summary-content">

                        <span className="inventory-summary-label">
                            Total Units
                        </span>

                        <strong className="inventory-summary-value">
                            {totalUnits}
                        </strong>

                    </div>

                </div>


                {/* Low Stock */}

                <div className="inventory-summary-card">

                    <div className="inventory-summary-icon low">
                        ⚠️
                    </div>

                    <div className="inventory-summary-content">

                        <span className="inventory-summary-label">
                            Low Stock
                        </span>

                        <strong className="inventory-summary-value">
                            {lowStockProducts}
                        </strong>

                    </div>

                </div>

            </div>


            {/* =========================
                Inventory List Header
            ========================= */}

            <div className="products-list-header inventory-list-header">

                <div>

                    <h2>
                        📋 Inventory List
                    </h2>

                    <p>
                        {totalProducts} Product
                        {totalProducts !== 1 ? "s" : ""}
                    </p>

                </div>

            </div>


            {/* =========================
                Inventory Table
            ========================= */}

            <div className="product-table-container inventory-table-container">

                <table className="inventory-table">

                    <thead>

                        <tr>

                            <th>
                                ID
                            </th>

                            <th>
                                Product
                            </th>

                            <th>
                                Price
                            </th>

                            <th>
                                Current Stock
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {inventory.length > 0 ? (

                            inventory.map(item => (

                                <tr
                                    key={item.id}
                                >

                                    {/* ID */}

                                    <td>
                                        #{item.id}
                                    </td>


                                    {/* Product */}

                                    <td>

                                        <div className="product-name-cell">

                                            <span className="product-icon">
                                                📦
                                            </span>

                                            <strong>
                                                {item.name}
                                            </strong>

                                        </div>

                                    </td>


                                    {/* Price */}

                                    <td>

                                        <strong>
                                            ₹{formatPrice(item.price)}
                                        </strong>

                                    </td>


                                    {/* Current Stock */}

                                    <td>

                                        {Number(item.quantity || 0) <= 5 ? (

                                            <span className="low-stock inventory-stock-badge">
                                                {item.quantity} Low Stock
                                            </span>

                                        ) : (

                                            <span className="normal-stock inventory-stock-badge">
                                                {item.quantity} In Stock
                                            </span>

                                        )}

                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan="4"
                                    className="inventory-empty"
                                >
                                    📦 No inventory products found.
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default Inventory;