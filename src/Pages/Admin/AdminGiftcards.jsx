import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../baseurl";
import "./adminProduct.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";

export const AdminGiftcards = () => {
  const [giftcards, setGiftcards] = useState([]);
  const [limit, setLimit] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchGiftcards = async (limitValue = limit) => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API}/giftcards?_limit=${limitValue}`);
      setGiftcards(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch giftcards");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGiftcard = async (id) => {
    try {
      await axios.delete(`${API}/giftcards/${id}`);
      toast.success("Giftcard removed");
      fetchGiftcards(limit);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete giftcard");
    }
  };

  const handleLoadMore = () => setLimit((prev) => prev + 5);

  useEffect(() => {
    fetchGiftcards(limit);
  }, [limit]);

  const filteredGiftcards = giftcards.filter((gc) =>
    Object.values(gc).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEdit = (gc) => {
    setEditId(gc.id);
    setEditData({ ...gc });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({});
  };

  const saveEdit = async (field, value) => {
    const updated = { ...editData, [field]: value };
    setEditData(updated);
    try {
      await axios.put(`${API}/giftcards/${editId}`, updated);
      toast.success(`${field} updated`);
      fetchGiftcards(limit);
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
              placeholder="Search Giftcard"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={() => fetchGiftcards(limit)}>Search</button>
            {limit > giftcards.length ? "" : (
              <button onClick={handleLoadMore}>Load More</button>
            )}
          </div>

          <div className="head"><h1>All Giftcards</h1></div>

          {isLoading && <h2>Please wait...</h2>}
          {filteredGiftcards.length === 0 && !isLoading && <p>No giftcards found.</p>}

          {filteredGiftcards.map((gc) => (
            <div key={gc.id} className="adminProductlist">
              {editId === gc.id ? (
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
                      name="category"
                      value={editData.category || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                      placeholder="Category"
                    />
                  </span>
                  <span style={{ flex: 1 }}>
                    <input
                      name="code"
                      value={editData.code || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                      placeholder="Code"
                    />
                  </span>
                  <span style={{ flex: 1 }}>
                    <button onClick={cancelEdit}>Done</button>
                  </span>
                </>
              ) : (
                <>
                  <span style={{ flex: 1 }}>
                    {gc.image && (
                      <img
                        src={gc.image}
                        alt={gc.title || "Giftcard"}
                        style={{ width: "80px", height: "60px", objectFit: "cover" }}
                      />
                    )}
                  </span>
                  <span style={{ flex: 1 }}>{gc.title || "Untitled"}</span>
                  <span style={{ flex: 1 }}>{gc.category || "N/A"}</span>
                  <span style={{ flex: 1 }}>{gc.code || "N/A"}</span>
                  <span style={{ flex: 1 }}>
                    <button onClick={() => handleDeleteGiftcard(gc.id)}>Delete</button>
                    <button onClick={() => startEdit(gc)}>Edit</button>
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
