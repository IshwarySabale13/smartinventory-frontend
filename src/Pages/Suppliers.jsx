import { useState, useEffect } from "react";
import { apiFetch } from "../api";


function Suppliers()
{
    const [suppliers, setSuppliers] = useState([]);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    const [editId, setEditId] = useState(null);

    const [showForm, setShowForm] = useState(false);

    const [message, setMessage] = useState("");

    const role = localStorage.getItem("role");


    // =========================
    // Load Suppliers
    // =========================

    useEffect(() =>
    {
        loadSuppliers();
    }, []);


    const loadSuppliers = async () =>
    {
        try
        {
            const response =
                await apiFetch("/suppliers");

            if(response.ok)
            {
                const data =
                    await response.json();

                setSuppliers(data);
            }
        }
        catch(error)
        {
            console.log(
                "Error loading suppliers:",
                error
            );
        }
    };


    // =========================
    // Open Add Supplier Form
    // =========================

    const handleShowAddForm = () =>
    {
        setEditId(null);

        setName("");
        setEmail("");
        setPhone("");
        setAddress("");

        setMessage("");

        setShowForm(true);
    };


    // =========================
    // Add Supplier
    // =========================

    const handleAddSupplier = async (e) =>
    {
        e.preventDefault();

        setMessage("");

        try
        {
            const response =
                await apiFetch(
                    "/suppliers",
                    {
                        method: "POST",

                        headers:
                        {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(
                        {
                            name: name,
                            email: email,
                            phone: phone,
                            address: address
                        })
                    }
                );


            if(response.status === 403)
            {
                setMessage(
                    "🔒 You don't have permission to add suppliers."
                );

                return;
            }


            if(!response.ok)
            {
                setMessage(
                    "Failed to add supplier."
                );

                return;
            }


            setMessage(
                "Supplier added successfully."
            );

            setName("");
            setEmail("");
            setPhone("");
            setAddress("");

            setEditId(null);

            setShowForm(false);

            await loadSuppliers();
        }
        catch(error)
        {
            console.log(
                "Error adding supplier:",
                error
            );

            setMessage(
                "Something went wrong while adding supplier."
            );
        }
    };


    // =========================
    // Edit Supplier
    // =========================

    const handleEdit = (supplier) =>
    {
        setEditId(supplier.id);

        setName(supplier.name);
        setEmail(supplier.email);
        setPhone(supplier.phone);
        setAddress(supplier.address);

        setMessage("");

        setShowForm(true);
    };


    // =========================
    // Update Supplier
    // =========================

    const handleUpdateSupplier = async (e) =>
    {
        e.preventDefault();

        setMessage("");

        try
        {
            const response =
                await apiFetch(
                    `/suppliers/${editId}`,
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
                            email: email,
                            phone: phone,
                            address: address
                        })
                    }
                );


            if(response.status === 403)
            {
                setMessage(
                    "🔒 You don't have permission to update suppliers."
                );

                return;
            }


            if(!response.ok)
            {
                setMessage(
                    "Failed to update supplier."
                );

                return;
            }


            setMessage(
                "Supplier updated successfully."
            );

            setEditId(null);

            setName("");
            setEmail("");
            setPhone("");
            setAddress("");

            setShowForm(false);

            await loadSuppliers();
        }
        catch(error)
        {
            console.log(
                "Error updating supplier:",
                error
            );

            setMessage(
                "Something went wrong while updating supplier."
            );
        }
    };


    // =========================
    // Delete Supplier
    // =========================

    const handleDelete = async (id) =>
    {
        setMessage("");

        try
        {
            const response =
                await apiFetch(
                    `/suppliers/${id}`,
                    {
                        method: "DELETE"
                    }
                );


            if(response.status === 403)
            {
                setMessage(
                    "🔒 You don't have permission to delete suppliers."
                );

                return;
            }


            if(!response.ok)
            {
                setMessage(
                    "Failed to delete supplier."
                );

                return;
            }


            setMessage(
                "Supplier deleted successfully."
            );

            await loadSuppliers();
        }
        catch(error)
        {
            console.log(
                "Error deleting supplier:",
                error
            );

            setMessage(
                "Something went wrong while deleting supplier."
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
        setEmail("");
        setPhone("");
        setAddress("");

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
                        Suppliers
                    </h1>

                    <p>
                        Manage your product suppliers.
                    </p>

                </div>


                {/* ADD SUPPLIER BUTTON */}

                {role === "ADMIN" && !showForm && (
                    <button
                        className="add-product-button"
                        onClick={handleShowAddForm}
                    >
                        + Add Supplier
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

                    <div className="form-header">

                        <h2>
                            {editId
                                ? "Edit Supplier"
                                : "Add New Supplier"
                            }
                        </h2>

                        <p>
                            {editId
                                ? "Update the supplier details below."
                                : "Enter the supplier details below."
                            }
                        </p>

                    </div>


                    <form
                        onSubmit={
                            editId
                                ? handleUpdateSupplier
                                : handleAddSupplier
                        }
                    >


                        {/* SUPPLIER NAME */}

                        <div className="form-group">

                            <label>
                                Supplier Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter supplier name"
                                value={name}
                                onChange={(e) =>
                                    setName(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        {/* EMAIL */}

                        <div className="form-group">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        {/* PHONE */}

                        <div className="form-group">

                            <label>
                                Phone
                            </label>

                            <input
                                type="text"
                                placeholder="Enter phone number"
                                value={phone}
                                onChange={(e) =>
                                    setPhone(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        {/* ADDRESS */}

                        <div className="form-group">

                            <label>
                                Address
                            </label>

                            <input
                                type="text"
                                placeholder="Enter supplier address"
                                value={address}
                                onChange={(e) =>
                                    setAddress(
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
                                className="save-button"
                            >
                                {editId
                                    ? "Update Supplier"
                                    : "Add Supplier"
                                }
                            </button>


                            <button
                                type="button"
                                className="cancel-button"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>
            )}


            {/* =========================
                SUPPLIER LIST
            ========================= */}

            <div className="product-list-header">

                <div>

                    <h2>
                        Supplier List
                    </h2>

                    <p>
                        {suppliers.length}{" "}
                        {suppliers.length === 1
                            ? "supplier"
                            : "suppliers"}{" "}
                        found
                    </p>

                </div>

            </div>


            {/* =========================
                SUPPLIER TABLE
            ========================= */}

            <div className="product-table-container">

                <table className="product-table">

                    <thead>

                        <tr>

                            <th>
                                ID
                            </th>

                            <th>
                                Supplier
                            </th>

                            <th>
                                Email
                            </th>

                            <th>
                                Phone
                            </th>

                            <th>
                                Address
                            </th>

                            {role === "ADMIN" && (
                                <th>
                                    Actions
                                </th>
                            )}

                        </tr>

                    </thead>


                    <tbody>

                        {suppliers.length > 0 ? (

                            suppliers.map(
                                (supplier) => (

                                    <tr
                                        key={supplier.id}
                                    >

                                        <td>
                                            #{supplier.id}
                                        </td>


                                        <td>

                                            <div className="product-name-cell">

                                                <span className="product-icon">
                                                    🚚
                                                </span>

                                                <strong>
                                                    {supplier.name}
                                                </strong>

                                            </div>

                                        </td>


                                        <td>
                                            {supplier.email}
                                        </td>


                                        <td>
                                            {supplier.phone}
                                        </td>


                                        <td>
                                            {supplier.address}
                                        </td>


                                        {role === "ADMIN" && (

                                            <td>

                                                <div className="action-buttons">

                                                    <button
                                                        className="edit-button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                supplier
                                                            )
                                                        }
                                                        title="Edit Supplier"
                                                    >
                                                        ✎
                                                    </button>


                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                supplier.id
                                                            )
                                                        }
                                                        title="Delete Supplier"
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
                                    No suppliers found.
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}


export default Suppliers;