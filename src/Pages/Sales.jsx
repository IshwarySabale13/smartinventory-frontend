import { useState, useEffect } from "react";
import { apiFetch } from "../api";

function Sales()
{
    const [sales, setSales] = useState([]);
    const [products, setProducts] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editingSale, setEditingSale] = useState(null);

    const [message, setMessage] = useState("");

    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [salePrice, setSalePrice] = useState("");
    const [saleDate, setSaleDate] = useState("");

    // =========================
    // Get Logged-in User Role
    // =========================

    const role = localStorage.getItem("role");


    // =========================
    // Initial Load
    // =========================

    useEffect(() =>
    {
        const loadInitialData = async () =>
        {
            try
            {
                // Load Sales
                const salesResponse =
                    await apiFetch("/sales");

                if(salesResponse.ok)
                {
                    const salesData =
                        await salesResponse.json();

                    console.log(
                        "Sales:",
                        salesData
                    );

                    setSales(salesData);
                }
                else
                {
                    console.log(
                        "Failed to load sales:",
                        salesResponse.status
                    );

                    setMessage(
                        "Failed to load sales."
                    );
                }


                // Load Products
                const productsResponse =
                    await apiFetch("/products");

                if(productsResponse.ok)
                {
                    const productsData =
                        await productsResponse.json();

                    console.log(
                        "Products:",
                        productsData
                    );

                    setProducts(productsData);
                }
                else
                {
                    console.log(
                        "Failed to load products:",
                        productsResponse.status
                    );
                }
            }
            catch(error)
            {
                console.log(
                    "Error loading initial data:",
                    error
                );

                setMessage(
                    "Something went wrong while loading sales data."
                );
            }
        };

        loadInitialData();

    }, []);


    // =========================
    // Get All Sales
    // =========================

    const loadSales = async () =>
    {
        try
        {
            const response =
                await apiFetch("/sales");

            if(response.ok)
            {
                const data =
                    await response.json();

                console.log(
                    "Sales:",
                    data
                );

                setSales(data);
            }
            else
            {
                console.log(
                    "Failed to load sales:",
                    response.status
                );

                setMessage(
                    "Failed to load sales."
                );
            }
        }
        catch(error)
        {
            console.log(
                "Error loading sales:",
                error
            );

            setMessage(
                "Something went wrong while loading sales."
            );
        }
    };


    // =========================
    // Get All Products
    // =========================

    const loadProducts = async () =>
    {
        try
        {
            const response =
                await apiFetch("/products");

            if(response.ok)
            {
                const data =
                    await response.json();

                console.log(
                    "Products:",
                    data
                );

                setProducts(data);
            }
            else
            {
                console.log(
                    "Failed to load products:",
                    response.status
                );
            }
        }
        catch(error)
        {
            console.log(
                "Error loading products:",
                error
            );
        }
    };


    // =========================
    // Add Sale
    // =========================

    const handleAddSale = async (e) =>
    {
        e.preventDefault();

        try
        {
            const response =
                await apiFetch(
                    "/sales",
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
                                product:
                                {
                                    id: Number(productId)
                                },

                                quantity:
                                    Number(quantity),

                                salePrice:
                                    Number(salePrice),

                                saleDate:
                                    saleDate
                            })
                    }
                );


            if(response.ok)
            {
                setMessage(
                    "Sale created successfully!"
                );

                setProductId("");
                setQuantity("");
                setSalePrice("");
                setSaleDate("");

                setShowForm(false);

                loadSales();
                loadProducts();


                setTimeout(() =>
                {
                    setMessage("");
                }, 3000);
            }
            else
            {
                console.log(
                    "Sale failed:",
                    response.status
                );


                if(response.status === 403)
                {
                    setMessage(
                        "🔒 You don't have permission to add sales."
                    );
                }
                else
                {
                    const errorMessage =
                        await response.text();

                    setMessage(
                        errorMessage ||
                        "Sale could not be created."
                    );
                }
            }
        }
        catch(error)
        {
            console.log(
                "Error:",
                error
            );

            setMessage(
                "Something went wrong while creating the sale."
            );
        }
    };


    // =========================
    // Start Editing
    // =========================

    const startEditSale = (sale) =>
    {
        setEditingSale(
        {
            ...sale,

            productId:
                sale.product
                    ? sale.product.id
                    : ""
        });
    };


    // =========================
    // Update Sale
    // =========================

    const handleUpdateSale = async () =>
    {
        try
        {
            const updatedSale =
            {
                product:
                {
                    id:
                        Number(
                            editingSale.productId
                        )
                },

                quantity:
                    Number(
                        editingSale.quantity
                    ),

                salePrice:
                    Number(
                        editingSale.salePrice
                    ),

                saleDate:
                    editingSale.saleDate
            };


            const response =
                await apiFetch(
                    `/sales/${editingSale.id}`,
                    {
                        method: "PUT",

                        headers:
                        {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                updatedSale
                            )
                    }
                );


            if(response.ok)
            {
                setMessage(
                    "Sale updated successfully!"
                );

                setEditingSale(null);

                loadSales();
                loadProducts();


                setTimeout(() =>
                {
                    setMessage("");
                }, 3000);
            }
            else
            {
                console.log(
                    "Update sale failed:",
                    response.status
                );


                if(response.status === 403)
                {
                    setMessage(
                        "🔒 You don't have permission to update sales."
                    );
                }
                else
                {
                    const errorMessage =
                        await response.text();

                    setMessage(
                        errorMessage ||
                        "Failed to update sale."
                    );
                }
            }
        }
        catch(error)
        {
            console.log(
                "Error:",
                error
            );

            setMessage(
                "Something went wrong while updating the sale."
            );
        }
    };


    // =========================
    // Delete Sale
    // =========================

    const handleDeleteSale = async (id) =>
    {
        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this sale?"
            );


        if(!confirmDelete)
        {
            return;
        }


        try
        {
            const response =
                await apiFetch(
                    `/sales/${id}`,
                    {
                        method: "DELETE"
                    }
                );


            if(response.ok)
            {
                setMessage(
                    "Sale deleted successfully!"
                );

                loadSales();
                loadProducts();


                setTimeout(() =>
                {
                    setMessage("");
                }, 3000);
            }
            else
            {
                console.log(
                    "Delete sale failed:",
                    response.status
                );


                if(response.status === 403)
                {
                    setMessage(
                        "🔒 You don't have permission to delete sales."
                    );
                }
                else
                {
                    const errorMessage =
                        await response.text();

                    setMessage(
                        errorMessage ||
                        "Failed to delete sale."
                    );
                }
            }
        }
        catch(error)
        {
            console.log(
                "Error:",
                error
            );

            setMessage(
                "Something went wrong while deleting the sale."
            );
        }
    };


    // =========================
    // UI
    // =========================

    return (
        <div className="products-page sales-page">

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
                        💰 Sales
                    </h1>

                    <p>
                        Manage your sales and stock deductions here.
                    </p>

                </div>


                {role === "ADMIN" && (
                    <button
                        className="add-product-button"
                        onClick={() =>
                            setShowForm(true)
                        }
                    >
                        + Add Sale
                    </button>
                )}

            </div>


            {/* =========================
                Add Sale Form
            ========================= */}

            {role === "ADMIN" && showForm && (

                <div className="product-form sales-form">

                    <div className="form-header">

                        <h2>
                            ➕ Add New Sale
                        </h2>

                        <p>
                            Enter the sale details below.
                        </p>

                    </div>


                    <form onSubmit={handleAddSale}>

                        {/* Product */}

                        <div className="form-group">

                            <label>
                                Product
                            </label>

                            <select
                                value={productId}
                                onChange={(e) =>
                                    setProductId(
                                        e.target.value
                                    )
                                }
                                required
                            >

                                <option value="">
                                    Select Product
                                </option>

                                {products.map(product => (

                                    <option
                                        key={product.id}
                                        value={product.id}
                                    >
                                        {product.name}
                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* Quantity */}

                        <div className="form-group">

                            <label>
                                Quantity
                            </label>

                            <input
                                type="number"
                                placeholder="Enter quantity"
                                value={quantity}
                                onChange={(e) =>
                                    setQuantity(
                                        e.target.value
                                    )
                                }
                                min="1"
                                required
                            />

                        </div>


                        {/* Sale Price */}

                        <div className="form-group">

                            <label>
                                Sale Price
                            </label>

                            <input
                                type="number"
                                placeholder="Enter sale price"
                                value={salePrice}
                                onChange={(e) =>
                                    setSalePrice(
                                        e.target.value
                                    )
                                }
                                min="0"
                                step="0.01"
                                required
                            />

                        </div>


                        {/* Sale Date */}

                        <div className="form-group">

                            <label>
                                Sale Date
                            </label>

                            <input
                                type="date"
                                value={saleDate}
                                onChange={(e) =>
                                    setSaleDate(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        {/* Buttons */}

                        <div className="form-buttons">

                            <button
                                type="submit"
                                className="save-button"
                            >
                                Save Sale
                            </button>

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() =>
                                    setShowForm(false)
                                }
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>
            )}


            {/* =========================
                Edit Sale Modal
            ========================= */}

            {role === "ADMIN" && editingSale && (

                <div className="edit-modal-overlay">

                    <div className="edit-modal">

                        <h2>
                            ✏️ Edit Sale
                        </h2>


                        {/* Product */}

                        <label>
                            Product
                        </label>

                        <select
                            value={
                                editingSale.productId
                            }
                            onChange={(e) =>
                                setEditingSale(
                                {
                                    ...editingSale,

                                    productId:
                                        e.target.value
                                })
                            }
                        >

                            {products.map(product => (

                                <option
                                    key={product.id}
                                    value={product.id}
                                >
                                    {product.name}
                                </option>

                            ))}

                        </select>


                        {/* Quantity */}

                        <label>
                            Quantity
                        </label>

                        <input
                            type="number"
                            value={
                                editingSale.quantity
                            }
                            onChange={(e) =>
                                setEditingSale(
                                {
                                    ...editingSale,

                                    quantity:
                                        e.target.value
                                })
                            }
                            min="1"
                        />


                        {/* Sale Price */}

                        <label>
                            Sale Price
                        </label>

                        <input
                            type="number"
                            value={
                                editingSale.salePrice
                            }
                            onChange={(e) =>
                                setEditingSale(
                                {
                                    ...editingSale,

                                    salePrice:
                                        e.target.value
                                })
                            }
                            min="0"
                            step="0.01"
                        />


                        {/* Sale Date */}

                        <label>
                            Sale Date
                        </label>

                        <input
                            type="date"
                            value={
                                editingSale.saleDate
                            }
                            onChange={(e) =>
                                setEditingSale(
                                {
                                    ...editingSale,

                                    saleDate:
                                        e.target.value
                                })
                            }
                        />


                        {/* Buttons */}

                        <div className="form-buttons">

                            <button
                                className="save-button"
                                onClick={
                                    handleUpdateSale
                                }
                            >
                                Save Changes
                            </button>

                            <button
                                className="cancel-button"
                                onClick={() =>
                                    setEditingSale(null)
                                }
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                </div>
            )}


            {/* =========================
                Sales List Header
            ========================= */}

            <div className="product-list-header">

                <div>

                    <h2>
                        🧾 Sales List
                    </h2>

                    <p>
                        {sales.length} Sale
                        {sales.length !== 1 ? "s" : ""}
                    </p>

                </div>

            </div>


            {/* =========================
                Sales Table
            ========================= */}

            <div className="product-table-container">

                <table className="sales-table">

                    <thead>

                        <tr>

                            <th>
                                ID
                            </th>

                            <th>
                                Product
                            </th>

                            <th>
                                Quantity
                            </th>

                            <th>
                                Sale Price
                            </th>

                            <th>
                                Sale Date
                            </th>

                            {role === "ADMIN" && (
                                <th>
                                    Actions
                                </th>
                            )}

                        </tr>

                    </thead>


                    <tbody>

                        {sales.length > 0 ? (

                            sales.map(sale => (

                                <tr
                                    key={sale.id}
                                >

                                    <td>
                                        #{sale.id}
                                    </td>

                                    <td>

                                        <div className="product-name-cell">

                                            <span className="product-icon">
                                                💰
                                            </span>

                                            <strong>
                                                {sale.product
                                                    ? sale.product.name
                                                    : "N/A"}
                                            </strong>

                                        </div>

                                    </td>

                                    <td>
                                        {sale.quantity}
                                    </td>

                                    <td>

                                        <strong>
                                            ₹
                                            {Number(
                                                sale.salePrice
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>

                                    </td>

                                    <td>
                                        {sale.saleDate}
                                    </td>


                                    {role === "ADMIN" && (

                                        <td>

                                            <div className="action-buttons">

                                                <button
                                                    className="edit-button"
                                                    onClick={() =>
                                                        startEditSale(
                                                            sale
                                                        )
                                                    }
                                                    title="Edit Sale"
                                                >
                                                    ✎
                                                </button>

                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        handleDeleteSale(
                                                            sale.id
                                                        )
                                                    }
                                                    title="Delete Sale"
                                                >
                                                    🗑
                                                </button>

                                            </div>

                                        </td>

                                    )}

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan={
                                        role === "ADMIN"
                                            ? "6"
                                            : "5"
                                    }
                                >
                                    No sales found.
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default Sales;