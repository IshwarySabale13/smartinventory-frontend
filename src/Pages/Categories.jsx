import { useState, useEffect } from "react";
import { apiFetch } from "../api";


function Categories()
{
    const [categories, setCategories] = useState([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [editId, setEditId] = useState(null);

    const [message, setMessage] = useState("");

    const [showForm, setShowForm] = useState(false);

    const role = localStorage.getItem("role");


    // =========================
    // Load Categories
    // =========================

    useEffect(() =>
    {
        loadCategories();
    }, []);


    const loadCategories = async () =>
    {
        try
        {
            const response =
                await apiFetch("/categories");

            if(response.ok)
            {
                const data =
                    await response.json();

                setCategories(data);
            }
        }
        catch(error)
        {
            console.log(
                "Error loading categories:",
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
        setDescription("");

        setMessage("");

        setShowForm(true);
    };


    // =========================
    // Add Category
    // =========================

    const handleAddCategory = async (e) =>
    {
        e.preventDefault();

        setMessage("");

        try
        {
            const response =
                await apiFetch(
                    "/categories",
                    {
                        method: "POST",

                        headers:
                        {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(
                        {
                            name: name,
                            description: description
                        })
                    }
                );


            if(response.status === 403)
            {
                setMessage(
                    "🔒 You don't have permission to add categories."
                );

                return;
            }


            if(!response.ok)
            {
                setMessage(
                    "Failed to add category."
                );

                return;
            }


            setMessage(
                "Category added successfully."
            );

            setName("");
            setDescription("");

            setShowForm(false);

            await loadCategories();
        }
        catch(error)
        {
            console.log(
                "Error adding category:",
                error
            );

            setMessage(
                "Something went wrong while adding category."
            );
        }
    };


    // =========================
    // Edit Category
    // =========================

    const handleEdit = (category) =>
    {
        setEditId(category.id);

        setName(category.name);

        setDescription(
            category.description
        );

        setMessage("");

        setShowForm(true);
    };


    // =========================
    // Update Category
    // =========================

    const handleUpdateCategory = async (e) =>
    {
        e.preventDefault();

        setMessage("");

        try
        {
            const response =
                await apiFetch(
                    `/categories/${editId}`,
                    {
                        method: "PUT",

                        headers:
                        {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(
                        {
                            id: editId,
                            name: name,
                            description: description
                        })
                    }
                );


            if(response.status === 403)
            {
                setMessage(
                    "🔒 You don't have permission to update categories."
                );

                return;
            }


            if(!response.ok)
            {
                setMessage(
                    "Failed to update category."
                );

                return;
            }


            setMessage(
                "Category updated successfully."
            );

            setEditId(null);

            setName("");
            setDescription("");

            setShowForm(false);

            await loadCategories();
        }
        catch(error)
        {
            console.log(
                "Error updating category:",
                error
            );

            setMessage(
                "Something went wrong while updating category."
            );
        }
    };


    // =========================
    // Delete Category
    // =========================

    const handleDelete = async (id) =>
    {
        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this category?"
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
                    `/categories/${id}`,
                    {
                        method: "DELETE"
                    }
                );


            if(response.status === 403)
            {
                setMessage(
                    "🔒 You don't have permission to delete categories."
                );

                return;
            }


            if(!response.ok)
            {
                setMessage(
                    "Failed to delete category."
                );

                return;
            }


            setMessage(
                "Category deleted successfully."
            );

            await loadCategories();
        }
        catch(error)
        {
            console.log(
                "Error deleting category:",
                error
            );

            setMessage(
                "Something went wrong while deleting category."
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
        setDescription("");

        setMessage("");

        setShowForm(false);
    };


    return (
        <div className="products-page">

            {/* =========================
                PAGE HEADER
            ========================= */}

            <div className="products-header">

                <div>

                    <h1>
                        Categories
                    </h1>

                    <p>
                        Manage your product categories.
                    </p>

                </div>


                {/* ADD CATEGORY BUTTON */}

                {role === "ADMIN" && !showForm && (
                    <button
                        className="add-product-button"
                        onClick={handleOpenAddForm}
                    >
                        + Add Category
                    </button>
                )}

            </div>


            {/* =========================
                MESSAGE
            ========================= */}

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}


            {/* =========================
                ADD / EDIT FORM
            ========================= */}

            {role === "ADMIN" && showForm && (

                <div className="product-form">

                    <h2>
                        {editId
                            ? "✏️ Edit Category"
                            : "➕ Add New Category"
                        }
                    </h2>


                    <p>
                        {editId
                            ? "Update the category details below."
                            : "Enter the category details below."
                        }
                    </p>


                    <form
                        onSubmit={
                            editId
                                ? handleUpdateCategory
                                : handleAddCategory
                        }
                    >

                        {/* CATEGORY NAME */}

                        <div className="form-group">

                            <label>
                                Category Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter category name"
                                value={name}
                                onChange={(e) =>
                                    setName(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        {/* DESCRIPTION */}

                        <div className="form-group">

                            <label>
                                Description
                            </label>

                            <input
                                type="text"
                                placeholder="Enter category description"
                                value={description}
                                onChange={(e) =>
                                    setDescription(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        {/* BUTTONS */}

                        <div className="form-buttons">

                            <button
                                type="submit"
                                className="add-product-button"
                            >
                                {editId
                                    ? "Update Category"
                                    : "Add Category"
                                }
                            </button>


                            <button
                                type="button"
                                className="secondary-button"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>
            )}


            {/* =========================
                CATEGORY LIST
            ========================= */}

            <div className="category-list-header">

                <div>

                    <h2>
                        Category List
                    </h2>

                    <p>
    {categories.length}{" "}
    {categories.length === 1 ? "category" : "categories"} found
</p>

                </div>

            </div>


            {/* =========================
                CATEGORY TABLE
            ========================= */}

            <div className="category-table-container">

                <table className="category-table">

                    <thead>

                        <tr>

                            <th>
                                ID
                            </th>

                            <th>
                                Category
                            </th>

                            <th>
                                Description
                            </th>

                            {role === "ADMIN" && (
                                <th>
                                    Actions
                                </th>
                            )}

                        </tr>

                    </thead>


                    <tbody>

                        {categories.length > 0 ? (

                            categories.map(
                                (category) => (

                                    <tr
                                        key={
                                            category.id
                                        }
                                    >

                                        <td>
                                            #{category.id}
                                        </td>


                                        <td>

                                            <div className="category-name-cell">

                                                <span className="category-icon">
                                                    🏷️
                                                </span>

                                                <strong>
                                                    {
                                                        category.name
                                                    }
                                                </strong>

                                            </div>

                                        </td>


                                        <td>
                                            {
                                                category.description
                                            }
                                        </td>


                                        {role === "ADMIN" && (

                                            <td>

                                                <div className="action-buttons">

                                                    <button
                                                        className="edit-button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                category
                                                            )
                                                        }
                                                        title="Edit Category"
                                                    >
                                                        ✎
                                                    </button>


                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                category.id
                                                            )
                                                        }
                                                        title="Delete Category"
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
                                            ? "4"
                                            : "3"
                                    }
                                >
                                    No categories found.
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}


export default Categories;