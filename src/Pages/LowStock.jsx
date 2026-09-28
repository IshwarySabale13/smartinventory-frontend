import { useState, useEffect } from "react";
import { apiFetch } from "../api";

function LowStock()
{
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState("");


    // =========================
    // Load Low Stock Products
    // =========================

    useEffect(() =>
    {
        const loadLowStock = async () =>
        {
            try
            {
                const response =
                    await apiFetch(
                        "/inventory/low-stock"
                    );

                if(response.ok)
                {
                    const data =
                        await response.json();

                    console.log(
                        "Low Stock Products:",
                        data
                    );

                    setProducts(data);
                }
                else
                {
                    setMessage(
                        "Failed to load low-stock products."
                    );
                }
            }
            catch(error)
            {
                console.log(
                    "Error:",
                    error
                );

                setMessage(
                    "Something went wrong while loading low-stock products."
                );
            }
        };


        loadLowStock();

    }, []);


    // =========================
    // UI
    // =========================

    return (
        <div className="products-page">

            {/* =========================
                Message
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
                        ⚠️ Low Stock
                    </h1>

                    <p>
                        Products that need to be restocked.
                    </p>

                </div>

            </div>


            {/* =========================
                Low Stock Summary
            ========================= */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "minmax(250px, 380px)",
                    justifyContent: "center",
                    marginTop: "10px",
                    marginBottom: "32px"
                }}
            >

                <div
                    style={{
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "16px",
                        padding: "20px 24px",
                        boxShadow:
                            "0 6px 18px rgba(15, 23, 42, 0.06)",
                        display: "flex",
                        alignItems: "center",
                        gap: "18px"
                    }}
                >

                    {/* Warning Icon */}

                    <div
                        style={{
                            width: "58px",
                            height: "58px",
                            borderRadius: "14px",
                            background: "#fff7ed",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "30px",
                            flexShrink: 0
                        }}
                    >
                        ⚠️
                    </div>


                    {/* Summary Information */}

                    <div>

                        <p
                            style={{
                                margin: "0 0 5px",
                                color: "#64748b",
                                fontSize: "15px"
                            }}
                        >
                            Low Stock Products
                        </p>

                        <h2
                            style={{
                                margin: "0",
                                color: "#23418f",
                                fontSize: "30px",
                                fontWeight: "700"
                            }}
                        >
                            {products.length}
                        </h2>

                        <p
                            style={{
                                margin: "3px 0 0",
                                color: "#94a3b8",
                                fontSize: "13px"
                            }}
                        >
                            Need Restocking
                        </p>

                    </div>

                </div>

            </div>


            {/* =========================
                Low Stock List Header
            ========================= */}

            <div
                style={{
                    textAlign: "center",
                    marginBottom: "20px"
                }}
            >

                <h2
                    style={{
                        color: "#23418f",
                        margin: "0 0 5px",
                        fontSize: "25px",
                        fontWeight: "700"
                    }}
                >
                    📋 Low Stock Products
                </h2>

                <p
                    style={{
                        color: "#64748b",
                        margin: "0",
                        fontSize: "16px"
                    }}
                >
                    {products.length}{" "}
                    {products.length === 1
                        ? "Product"
                        : "Products"}{" "}
                    Need Restocking
                </p>

            </div>


            {/* =========================
                Low Stock Table
            ========================= */}

            <div className="product-table-container">

                <table className="low-stock-table">

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

                        {products.length > 0 ? (

                            products.map(product => (

                                <tr
                                    key={product.id}
                                >

                                    {/* ID */}

                                    <td>
                                        #{product.id}
                                    </td>


                                    {/* Product */}

                                    <td>

                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "12px"
                                            }}
                                        >

                                            <span
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    borderRadius: "10px",
                                                    background: "#f1f5f9",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: "20px"
                                                }}
                                            >
                                                📦
                                            </span>

                                            <strong
                                                style={{
                                                    color: "#173b82",
                                                    fontSize: "15px"
                                                }}
                                            >
                                                {product.name}
                                            </strong>

                                        </div>

                                    </td>


                                    {/* Price */}

                                    <td>

                                        <strong>
                                            ₹
                                            {Number(
                                                product.price
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>

                                    </td>


                                    {/* Current Stock */}

                                    <td>

                                        <span
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "6px",
                                                padding: "9px 14px",
                                                borderRadius: "10px",
                                                background: "#fff1f2",
                                                color: "#dc2626",
                                                fontWeight: "700",
                                                fontSize: "14px"
                                            }}
                                        >
                                            ⚠️
                                            {product.quantity}
                                            {" Low Stock"}
                                        </span>

                                    </td>

                                </tr>

                            ))

                        ) : (

                            /* =========================
                               Empty State
                            ========================= */

                            <tr>

                                <td
                                    colSpan="4"
                                    style={{
                                        textAlign: "center",
                                        padding: "55px 20px"
                                    }}
                                >

                                    <div
                                        style={{
                                            fontSize: "42px",
                                            marginBottom: "10px"
                                        }}
                                    >
                                        ✅
                                    </div>

                                    <strong
                                        style={{
                                            display: "block",
                                            color: "#23418f",
                                            fontSize: "18px",
                                            marginBottom: "5px"
                                        }}
                                    >
                                        No Low Stock Products
                                    </strong>

                                    <span
                                        style={{
                                            color: "#64748b",
                                            fontSize: "14px"
                                        }}
                                    >
                                        All products currently have
                                        sufficient stock.
                                    </span>

                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default LowStock;