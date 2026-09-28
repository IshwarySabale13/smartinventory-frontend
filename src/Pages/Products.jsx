import { useState, useEffect } from "react";
import { apiFetch } from "../api";


function Products()
{
    // =========================
    // States
    // =========================

    const [products, setProducts] = useState([]);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [categoryId, setCategoryId] = useState("");

    const [categories, setCategories] = useState([]);

    const [editId, setEditId] = useState(null);

    const [message, setMessage] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [search, setSearch] = useState("");


    // =========================
    // Get Logged-in User Role
    // =========================

    const role =
        localStorage.getItem("role");


    // =========================
    // Load Products & Categories
    // =========================

    useEffect(() =>
    {
        loadInitialData();
    }, []);


    const loadInitialData = async () =>
    {
        try
        {
            const productResponse =
                await apiFetch("/products");

            if(productResponse.ok)
            {
                const productData =
                    await productResponse.json();

                setProducts(productData);
            }


            const categoryResponse =
                await apiFetch("/categories");

            if(categoryResponse.ok)
            {
                const categoryData =
                    await categoryResponse.json();

                setCategories(categoryData);
            }
        }
        catch(error)
        {
            console.log(
                "Error loading products:",
                error
            );

            setMessage(
                "Something went wrong while loading products."
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
    // Open Add Form
    // =========================

    const handleOpenAddForm = () =>
    {
        setEditId(null);

        setName("");
        setPrice("");
        setQuantity("");
        setCategoryId("");

        setMessage("");

        setShowForm(true);
    };


    // =========================
    // Add Product
    // =========================

    const handleAddProduct = async (e) =>
    {
        e.preventDefault();

        setMessage("");


        try
        {
            const response =
                await apiFetch(
                    "/products",
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
                                name: name,

                                price:
                                    Number(price),

                                quantity:
                                    Number(quantity),

                                category:
                                {
                                    id:
                                        Number(categoryId)
                                }
                            })
                    }
                );


            if(response.status === 403)
            {
                setMessage(
                    "🔒 You don't have permission to add products."
                );

                return;
            }


            if(!response.ok)
            {
                setMessage(
                    "Failed to add product."
                );

                return;
            }


            setMessage(
                "Product added successfully."
            );


            setName("");
            setPrice("");
            setQuantity("");
            setCategoryId("");

            setShowForm(false);


            await loadProducts();
        }
        catch(error)
        {
            console.log(
                "Error adding product:",
                error
            );

            setMessage(
                "Error adding product."
            );
        }
    };


    // =========================
    // Edit Product
    // =========================

    const handleEdit = (product) =>
    {
        setEditId(product.id);

        setName(product.name);

        setPrice(product.price);

        setQuantity(product.quantity);


        if(product.category)
        {
            setCategoryId(
                product.category.id
            );
        }
        else
        {
            setCategoryId("");
        }


        setMessage("");

        setShowForm(true);
    };


    // =========================
    // Update Product
    // =========================

    const handleUpdateProduct = async (e) =>
    {
        e.preventDefault();

        setMessage("");


        try
        {
            const response =
                await apiFetch(
                    `/products/${editId}`,
                    {
                        method: "PUT",

                        headers:
                        {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                            {
                                id: editId,

                                name: name,

                                price:
                                    Number(price),

                                quantity:
                                    Number(quantity),

                                category:
                                {
                                    id:
                                        Number(categoryId)
                                }
                            })
                    }
                );


            if(response.status === 403)
            {
                setMessage(
                    "🔒 You don't have permission to update products."
                );

                return;
            }


            if(!response.ok)
            {
                setMessage(
                    "Failed to update product."
                );

                return;
            }


            setMessage(
                "Product updated successfully."
            );


            setEditId(null);

            setName("");
            setPrice("");
            setQuantity("");
            setCategoryId("");

            setShowForm(false);


            await loadProducts();
        }
        catch(error)
        {
            console.log(
                "Error updating product:",
                error
            );

            setMessage(
                "Error updating product."
            );
        }
    };


    // =========================
    // Delete Product
    // =========================

    const handleDelete = async (id) =>
    {
        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this product?"
            );


        if(!confirmDelete)
        {
            return;
        }


        setMessage("");


        try
        {
            const response =
                await apiFetch(
                    `/products/${id}`,
                    {
                        method: "DELETE"
                    }
                );


            if(response.status === 403)
            {
                setMessage(
                    "🔒 You don't have permission to delete products."
                );

                return;
            }


            if(!response.ok)
            {
                setMessage(
                    "Failed to delete product."
                );

                return;
            }


            setMessage(
                "Product deleted successfully."
            );


            await loadProducts();
        }
        catch(error)
        {
            console.log(
                "Error deleting product:",
                error
            );

            setMessage(
                "Error deleting product."
            );
        }
    };


    // =========================
    // Cancel Form
    // =========================

    const handleCancel = () =>
    {
        setEditId(null);

        setName("");
        setPrice("");
        setQuantity("");
        setCategoryId("");

        setShowForm(false);

        setMessage("");
    };


    // =========================
    // Filter Products
    // =========================

    const filteredProducts =
        products.filter((product) =>
        {
            const productName =
                product.name
                    ? product.name.toLowerCase()
                    : "";

            const categoryName =
                product.category &&
                product.category.name
                    ? product.category.name.toLowerCase()
                    : "";

            const searchText =
                search.toLowerCase();


            return (
                productName.includes(searchText) ||
                categoryName.includes(searchText)
            );
        });


    // =========================
    // Page
    // =========================

    return (
        <div className="products-page">

            {/* =========================
                Page Header
            ========================= */}

            <div className="products-header">

                <div>

                    <h1>
                        Products
                    </h1>

                    <p>
                        Manage your inventory
                        products and stock levels.
                    </p>

                </div>


                {/* ADMIN ONLY */}

                {role === "ADMIN" && (
                    <button
                        className="add-product-button"
                        onClick={
                            handleOpenAddForm
                        }
                    >
                        + Add Product
                    </button>
                )}

            </div>


            {/* =========================
                Message
            ========================= */}

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}


            {/* =========================
                Add / Edit Form
            ========================= */}

            {role === "ADMIN" &&
             showForm && (

                <div className="product-form">

                    <div className="form-header">

                        <h2>
                            {editId
                                ? "Edit Product"
                                : "Add New Product"
                            }
                        </h2>

                        <p>
                            {editId
                                ? "Update the product details below."
                                : "Enter the product details below."
                            }
                        </p>

                    </div>


                    <form
                        onSubmit={
                            editId
                                ? handleUpdateProduct
                                : handleAddProduct
                        }
                    >

                        {/* Product Name */}

                        <div className="form-group">

                            <label>
                                Product Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter product name"
                                value={name}
                                onChange={(e) =>
                                    setName(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        {/* Price */}

                        <div className="form-group">

                            <label>
                                Price
                            </label>

                            <input
                                type="number"
                                placeholder="Enter price"
                                value={price}
                                onChange={(e) =>
                                    setPrice(
                                        e.target.value
                                    )
                                }
                                min="0"
                                step="0.01"
                                required
                            />

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
                                min="0"
                                required
                            />

                        </div>


                        {/* Category */}

                        <div className="form-group">

                            <label>
                                Category
                            </label>

                            <select
                                value={categoryId}
                                onChange={(e) =>
                                    setCategoryId(
                                        e.target.value
                                    )
                                }
                                required
                            >

                                <option value="">
                                    Select Category
                                </option>

                                {categories.map(
                                    (category) => (

                                        <option
                                            key={
                                                category.id
                                            }
                                            value={
                                                category.id
                                            }
                                        >
                                            {
                                                category.name
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* Form Buttons */}

                        <div className="form-buttons">

                            <button
                                type="submit"
                                className="save-button"
                            >
                                {editId
                                    ? "Update Product"
                                    : "Add Product"
                                }
                            </button>


                            <button
                                type="button"
                                className="cancel-button"
                                onClick={
                                    handleCancel
                                }
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* =========================
                Product List Header
            ========================= */}

            <div className="product-list-header">

                <div>

                    <h2>
                        Product List
                    </h2>

                    <p>
                        {filteredProducts.length}{" "}
                        {filteredProducts.length === 1
                            ? "product"
                            : "products"}{" "}
                        found
                    </p>

                </div>


                {/* Search */}

                <div className="product-search">

                    <span>
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search products or categories..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                </div>

            </div>


            {/* =========================
                Product Table
            ========================= */}

            <div className="product-table-container">

                <table className="product-table">

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
                                Stock
                            </th>

                            <th>
                                Category
                            </th>

                            {role === "ADMIN" && (
                                <th>
                                    Actions
                                </th>
                            )}

                        </tr>

                    </thead>


                    <tbody>

                        {filteredProducts.length > 0 ? (

                            filteredProducts.map(
                                (product) => (

                                    <tr
                                        key={
                                            product.id
                                        }
                                    >

                                        {/* ID */}

                                        <td>
                                            #
                                            {product.id}
                                        </td>


                                        {/* Product */}

                                        <td>

                                            <div className="product-name-cell">

                                                <span className="product-icon">
                                                    📦
                                                </span>

                                                <strong>
                                                    {
                                                        product.name
                                                    }
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


                                        {/* Stock */}

                                        <td>

                                            <span
                                                className={
                                                    product.quantity <= 5
                                                        ? "low-stock"
                                                        : "normal-stock"
                                                }
                                            >

                                                {
                                                    product.quantity
                                                }

                                                {product.quantity <= 5 &&
                                                    " Low"
                                                }

                                            </span>

                                        </td>


                                        {/* Category */}

                                        <td>

                                            <span className="category-cell">

                                                🏷️{" "}

                                                {
                                                    product.category
                                                        ? product.category.name
                                                        : "N/A"
                                                }

                                            </span>

                                        </td>


                                        {/* Actions */}

                                        {role === "ADMIN" && (

                                            <td>

                                                <div className="action-buttons">

                                                    <button
                                                        className="edit-button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                product
                                                            )
                                                        }
                                                        title="Edit Product"
                                                    >
                                                        ✎
                                                    </button>


                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                product.id
                                                            )
                                                        }
                                                        title="Delete Product"
                                                    >
                                                        🗑
                                                    </button>

                                                </div>

                                            </td>

                                        )}

                                    </tr>

                                )
                            )

                        ) : (

                            <tr>

                                <td
                                    colSpan={
                                        role === "ADMIN"
                                            ? "6"
                                            : "5"
                                    }
                                >
                                    {search
                                        ? "No products match your search."
                                        : "No products available."
                                    }
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}


export default Products;