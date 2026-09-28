import { useState, useEffect } from "react";
import { apiFetch } from "../api";

function Purchases()
{
    const [purchases, setPurchases] = useState([]);

    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editingPurchase, setEditingPurchase] = useState(null);

    const [message, setMessage] = useState("");

    const [productId, setProductId] = useState("");
    const [supplierId, setSupplierId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [purchasePrice, setPurchasePrice] = useState("");
    const [purchaseDate, setPurchaseDate] = useState("");

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
                const purchasesResponse =
                    await apiFetch("/purchases");

                if(purchasesResponse.ok)
                {
                    const purchasesData =
                        await purchasesResponse.json();

                    setPurchases(purchasesData);
                }
                else
                {
                    setMessage(
                        "Failed to load purchases."
                    );
                }


                const productsResponse =
                    await apiFetch("/products");

                if(productsResponse.ok)
                {
                    const productsData =
                        await productsResponse.json();

                    setProducts(productsData);
                }


                const suppliersResponse =
                    await apiFetch("/suppliers");

                if(suppliersResponse.ok)
                {
                    const suppliersData =
                        await suppliersResponse.json();

                    setSuppliers(suppliersData);
                }
            }
            catch(error)
            {
                console.log(
                    "Error loading initial data:",
                    error
                );

                setMessage(
                    "Something went wrong while loading purchase data."
                );
            }
        };

        loadInitialData();

    }, []);


    // =========================
    // Load Purchases
    // =========================

    const loadPurchases = async () =>
    {
        try
        {
            const response =
                await apiFetch("/purchases");

            if(response.ok)
            {
                const data =
                    await response.json();

                setPurchases(data);
            }
            else
            {
                setMessage(
                    "Failed to load purchases."
                );
            }
        }
        catch(error)
        {
            console.log(
                "Error loading purchases:",
                error
            );

            setMessage(
                "Something went wrong while loading purchases."
            );
        }
    };


    // =========================
    // Load Products
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

                setProducts(data);
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
    // Add Purchase
    // =========================

    const handleAddPurchase = async () =>
    {
        const newPurchase =
        {
            product:
            {
                id: Number(productId)
            },

            supplier:
            {
                id: Number(supplierId)
            },

            quantity:
                Number(quantity),

            purchasePrice:
                Number(purchasePrice),

            purchaseDate:
                purchaseDate
        };


        try
        {
            const response =
                await apiFetch(
                    "/purchases",
                    {
                        method: "POST",

                        headers:
                        {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                newPurchase
                            )
                    }
                );


            if(response.ok)
            {
                setMessage(
                    "Purchase added successfully!"
                );

                setShowForm(false);

                setProductId("");
                setSupplierId("");
                setQuantity("");
                setPurchasePrice("");
                setPurchaseDate("");

                loadPurchases();
                loadProducts();

                setTimeout(() =>
                {
                    setMessage("");
                }, 3000);
            }
            else
            {
                if(response.status === 403)
                {
                    setMessage(
                        "🔒 You don't have permission to add purchases."
                    );
                }
                else
                {
                    setMessage(
                        "Failed to add purchase."
                    );
                }
            }
        }
        catch(error)
        {
            console.log(
                "Error adding purchase:",
                error
            );

            setMessage(
                "Something went wrong while adding the purchase."
            );
        }
    };


    // =========================
    // Start Editing
    // =========================

    const startEditPurchase = (purchase) =>
    {
        setEditingPurchase(
        {
            ...purchase,

            productId:
                purchase.product
                    ? purchase.product.id
                    : "",

            supplierId:
                purchase.supplier
                    ? purchase.supplier.id
                    : ""
        });
    };


    // =========================
    // Update Purchase
    // =========================

    const handleUpdatePurchase = async () =>
    {
        const updatedPurchase =
        {
            product:
            {
                id:
                    Number(
                        editingPurchase.productId
                    )
            },

            supplier:
            {
                id:
                    Number(
                        editingPurchase.supplierId
                    )
            },

            quantity:
                Number(
                    editingPurchase.quantity
                ),

            purchasePrice:
                Number(
                    editingPurchase.purchasePrice
                ),

            purchaseDate:
                editingPurchase.purchaseDate
        };


        try
        {
            const response =
                await apiFetch(
                    `/purchases/${editingPurchase.id}`,
                    {
                        method: "PUT",

                        headers:
                        {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                updatedPurchase
                            )
                    }
                );


            if(response.ok)
            {
                setMessage(
                    "Purchase updated successfully!"
                );

                setEditingPurchase(null);

                loadPurchases();
                loadProducts();

                setTimeout(() =>
                {
                    setMessage("");
                }, 3000);
            }
            else
            {
                if(response.status === 403)
                {
                    setMessage(
                        "🔒 You don't have permission to update purchases."
                    );
                }
                else
                {
                    setMessage(
                        "Failed to update purchase."
                    );
                }
            }
        }
        catch(error)
        {
            console.log(
                "Error updating purchase:",
                error
            );

            setMessage(
                "Something went wrong while updating the purchase."
            );
        }
    };


    // =========================
    // Delete Purchase
    // =========================

    const handleDeletePurchase = async (id) =>
    {
        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this purchase?"
            );


        if(!confirmDelete)
        {
            return;
        }


        try
        {
            const response =
                await apiFetch(
                    `/purchases/${id}`,
                    {
                        method: "DELETE"
                    }
                );


            if(response.ok)
            {
                setMessage(
                    "Purchase deleted successfully!"
                );

                loadPurchases();
                loadProducts();

                setTimeout(() =>
                {
                    setMessage("");
                }, 3000);
            }
            else
            {
                if(response.status === 403)
                {
                    setMessage(
                        "🔒 You don't have permission to delete purchases."
                    );
                }
                else
                {
                    setMessage(
                        "Failed to delete purchase."
                    );
                }
            }
        }
        catch(error)
        {
            console.log(
                "Error deleting purchase:",
                error
            );

            setMessage(
                "Something went wrong while deleting the purchase."
            );
        }
    };


    return (
        <div className="products-page purchases-page">

            {/* =========================
                Success / Error Message
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
                        🛒 Purchases
                    </h1>

                    <p>
                        Manage purchases and update your inventory stock.
                    </p>

                </div>


                {role === "ADMIN" && (
                    <button
                        className="add-product-button"
                        onClick={() =>
                            setShowForm(true)
                        }
                    >
                        + Add Purchase
                    </button>
                )}

            </div>


            {/* =========================
                Add Purchase Form
            ========================= */}

            {role === "ADMIN" && showForm && (

                <div className="product-form purchase-form">

                    <h2>
                        ➕ Add New Purchase
                    </h2>

                    <p>
                        Enter the purchase details below.
                    </p>


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


                    <label>
                        Supplier
                    </label>

                    <select
                        value={supplierId}
                        onChange={(e) =>
                            setSupplierId(
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            Select Supplier
                        </option>

                        {suppliers.map(supplier => (

                            <option
                                key={supplier.id}
                                value={supplier.id}
                            >
                                {supplier.name}
                            </option>

                        ))}

                    </select>


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
                    />


                    <label>
                        Purchase Price
                    </label>

                    <input
                        type="number"
                        placeholder="Enter purchase price"
                        value={purchasePrice}
                        onChange={(e) =>
                            setPurchasePrice(
                                e.target.value
                            )
                        }
                    />


                    <label>
                        Purchase Date
                    </label>

                    <input
                        type="date"
                        value={purchaseDate}
                        onChange={(e) =>
                            setPurchaseDate(
                                e.target.value
                            )
                        }
                    />


                    <div className="form-buttons">

                        <button
                            className="save-button"
                            onClick={
                                handleAddPurchase
                            }
                        >
                            Save Purchase
                        </button>

                        <button
                            className="cancel-button"
                            onClick={() =>
                                setShowForm(false)
                            }
                        >
                            Cancel
                        </button>

                    </div>

                </div>
            )}


            {/* =========================
                Edit Purchase Modal
            ========================= */}

            {role === "ADMIN" && editingPurchase && (

                <div className="edit-modal-overlay">

                    <div className="edit-modal">

                        <h2>
                            ✏️ Edit Purchase
                        </h2>


                        <label>
                            Product
                        </label>

                        <select
                            value={
                                editingPurchase.productId
                            }
                            onChange={(e) =>
                                setEditingPurchase(
                                {
                                    ...editingPurchase,

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


                        <label>
                            Supplier
                        </label>

                        <select
                            value={
                                editingPurchase.supplierId
                            }
                            onChange={(e) =>
                                setEditingPurchase(
                                {
                                    ...editingPurchase,

                                    supplierId:
                                        e.target.value
                                })
                            }
                        >

                            {suppliers.map(supplier => (

                                <option
                                    key={supplier.id}
                                    value={supplier.id}
                                >
                                    {supplier.name}
                                </option>

                            ))}

                        </select>


                        <label>
                            Quantity
                        </label>

                        <input
                            type="number"
                            value={
                                editingPurchase.quantity
                            }
                            onChange={(e) =>
                                setEditingPurchase(
                                {
                                    ...editingPurchase,

                                    quantity:
                                        e.target.value
                                })
                            }
                        />


                        <label>
                            Purchase Price
                        </label>

                        <input
                            type="number"
                            value={
                                editingPurchase.purchasePrice
                            }
                            onChange={(e) =>
                                setEditingPurchase(
                                {
                                    ...editingPurchase,

                                    purchasePrice:
                                        e.target.value
                                })
                            }
                        />


                        <label>
                            Purchase Date
                        </label>

                        <input
                            type="date"
                            value={
                                editingPurchase.purchaseDate
                            }
                            onChange={(e) =>
                                setEditingPurchase(
                                {
                                    ...editingPurchase,

                                    purchaseDate:
                                        e.target.value
                                })
                            }
                        />


                        <div className="form-buttons">

                            <button
                                className="save-button"
                                onClick={
                                    handleUpdatePurchase
                                }
                            >
                                Save Changes
                            </button>

                            <button
                                className="cancel-button"
                                onClick={() =>
                                    setEditingPurchase(null)
                                }
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                </div>
            )}


            {/* =========================
                Purchase List
            ========================= */}

            <div className="product-list-header">

                <div>

                    <h2>
                        🧾 Purchase List
                    </h2>

                    <p>
                        {purchases.length} Purchase
                        {purchases.length !== 1 ? "s" : ""}
                    </p>

                </div>

            </div>


            <table className="purchase-table">

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Product</th>

                        <th>Supplier</th>

                        <th>Quantity</th>

                        <th>Purchase Price</th>

                        <th>Purchase Date</th>

                        {role === "ADMIN" && (
                            <th>Actions</th>
                        )}

                    </tr>

                </thead>


                <tbody>

                    {purchases.length > 0 ? (

                        purchases.map(purchase => (

                            <tr key={purchase.id}>

                                <td>
                                    {purchase.id}
                                </td>

                                <td>
                                    {purchase.product
                                        ? purchase.product.name
                                        : "N/A"}
                                </td>

                                <td>
                                    {purchase.supplier
                                        ? purchase.supplier.name
                                        : "N/A"}
                                </td>

                                <td>
                                    {purchase.quantity}
                                </td>

                                <td>
                                    ₹{purchase.purchasePrice}
                                </td>

                                <td>
                                    {purchase.purchaseDate}
                                </td>


                                {role === "ADMIN" && (

                                    <td>

                                        <button
                                            className="edit-button"
                                            onClick={() =>
                                                startEditPurchase(
                                                    purchase
                                                )
                                            }
                                        >
                                            ✏️ Edit
                                        </button>


                                        <button
                                            className="delete-button"
                                            onClick={() =>
                                                handleDeletePurchase(
                                                    purchase.id
                                                )
                                            }
                                        >
                                            🗑️ Delete
                                        </button>

                                    </td>

                                )}

                            </tr>

                        ))

                    ) : (

                        <tr>

                            <td
                                colSpan={
                                    role === "ADMIN"
                                        ? "7"
                                        : "6"
                                }
                            >
                                No purchases found.
                            </td>

                        </tr>

                    )}

                </tbody>

            </table>

        </div>
    );
}

export default Purchases;