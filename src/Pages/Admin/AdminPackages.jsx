import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../baseurl";
import "./adminProduct.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";

export const AdminPackages = () => {
  const [packages, setPackages] = useState([]);
  const [limit, setLimit] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchPackages = async (limitValue = limit) => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API}/Things_todo?_limit=${limitValue}`);
      setPackages(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch packages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePackage = async (id) => {
    try {
      await axios.delete(`${API}/Things_todo/${id}`);
      toast.success("Package removed");
      fetchPackages(limit);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete package");
    }
  };

  const handleLoadMore = () => setLimit((prev) => prev + 5);

  useEffect(() => {
    fetchPackages(limit);
  }, [limit]);

  const filteredPackages = packages.filter((pkg) =>
    Object.values(pkg).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEdit = (pkg) => {
    setEditId(pkg.id);
    setEditData({ ...pkg });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({});
  };

  const saveEdit = async (field, value) => {
    const updated = { ...editData, [field]: value };
    setEditData(updated);
    try {
      await axios.put(`${API}/Things_todo/${editId}`, updated);
      toast.success(`${field} updated`);
      fetchPackages(limit);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    saveEdit(name, value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.target.blur();
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="adminProductMain">
        <div className="adminSideBr">
          <h1><Link to={"/admin"}>Home</Link></h1>
          <h1><Link to={"/admin/adminflight"}>Add Flight</Link></h1>
          <h1><Link to={"/admin/adminstay"}>Add Stays</Link></h1>
          <h1><Link to={"/admin/products"}>All Flights</Link></h1>
          <h1><Link to={"/admin/hotels"}>All Hotels</Link></h1>
          <h1><Link to={"/admin/giftcards"}>All Giftcards</Link></h1>
          <h1><Link to={"/admin/packages"}>All Packages</Link></h1>
          <h1><Link to={"/"}>Log out</Link></h1>
        </div>

        <div className="adminProductbox">
          <div className="filterProdcut">
            <input
              placeholder="Search Package"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={() => fetchPackages(limit)}>Search</button>
            {limit > packages.length ? "" : (
              <button onClick={handleLoadMore}>Load More</button>
            )}
          </div>

          <div className="head"><h1>All Packages</h1></div>

          {isLoading && <h2>Please wait...</h2>}
          {filteredPackages.length === 0 && !isLoading && <p>No packages found.</p>}

          {filteredPackages.map((pkg) => (
            <div key={pkg.id} className="adminProductlist">
              {editId === pkg.id ? (
                <>
                  <span style={{ flex: 1 }}>
                    <input
                      name="image"
                      value={editData.image || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                      placeholder="Image URL"
                    />
                  </span>
                  <span style={{ flex: 1 }}>
                    <input
                      name="place"
                      value={editData.place || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                      placeholder="Place"
                    />
                  </span>
                  <span style={{ flex: 1 }}>
                    <input
                      name="title"
                      value={editData.title || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                      placeholder="Title"
                    />
                  </span>
                  <span style={{ flex: 1 }}>
                    <input
                      name="rating"
                      value={editData.rating || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                      placeholder="Rating"
                    />
                  </span>
                  <span style={{ flex: 1 }}>
                    <input
                      name="adress"
                      value={editData.adress || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                      placeholder="Address"
                    />
                  </span>
                  <span style={{ flex: 1 }}>
                    <input
                      name="price"
                      value={editData.price || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                      placeholder="Price"
                    />
                  </span>
                  <span style={{ flex: 1 }}>
                    <button onClick={cancelEdit}>Done</button>
                  </span>
                </>
              ) : (
                <>
                  <span style={{ flex: 1 }}>
                    {pkg.image && (
                      <img
                        src={pkg.image}
                        alt={pkg.title || "Package"}
                        style={{ width: "80px", height: "60px", objectFit: "cover" }}
                      />
                    )}
                  </span>
                  <span style={{ flex: 1 }}>{pkg.place || "N/A"}</span>
                  <span style={{ flex: 1 }}>{pkg.title || "Untitled"}</span>
                  <span style={{ flex: 1 }}>{pkg.rating ? `ratings: ${pkg.rating}` : "No rating"}</span>
                  <span style={{ flex: 1 }}>{pkg.adress || "N/A"}</span>
                  <span style={{ flex: 1 }}>Rs.{pkg.price ?? "0"}</span>
                  <span style={{ flex: 1 }}>
                    <button onClick={() => handleDeletePackage(pkg.id)}>Delete</button>
                    <button onClick={() => startEdit(pkg)}>Edit</button>
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
