import React, { useEffect, useState } from "react";
import "./adminProduct.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { DeleteHotel, fetchingHotels } from "../../Redux/AdminHotel/action";
import { API } from "../../baseurl";

export const AllHotels = () => {
  const dispatch = useDispatch();
  const [limit, setLimit] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHotels, setFilteredHotels] = useState([]);

  // editing state
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const { isLoading, data } = useSelector(
    (store) => ({
      isLoading: store.HotelReducer.isLoading,
      data: store.HotelReducer.data,
    }),
    shallowEqual
  );

  const handleDeleteHotel = (deleteId) => {
    dispatch(DeleteHotel(deleteId));
    toast.success("Hotel Removed");
  };

  const handleLoadMore = () => {
    if (data.length >= limit) setLimit((prev) => prev + 5);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (!value.trim()) {
      setFilteredHotels(data);
      return;
    }
    const filtered = data.filter((hotel) =>
      [hotel.name, hotel.place, hotel.taxes, hotel.price, hotel.number]
        .filter(Boolean)
        .some((field) => field.toString().toLowerCase().includes(value))
    );
    setFilteredHotels(filtered);
  };

  useEffect(() => {
    dispatch(fetchingHotels(limit));
  }, [limit, dispatch]);

  useEffect(() => {
    setFilteredHotels(data);
  }, [data]);

  const startEdit = (hotel) => {
    setEditId(hotel.id);
    setEditData({ ...hotel });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({});
  };

  const saveEdit = async (field, value) => {
    const updated = { ...editData, id: editId, [field]: value }; // include id for JSON server
    setEditData(updated);
    try {
      await axios.put(`${API}/hotels/${editId}`, updated);
      toast.success(`${field} updated`);
      dispatch(fetchingHotels(limit)); 
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
        {/* Sidebar */}
        <div className="adminSideBr">
          <h1><Link to={"/admin"}>Home</Link></h1>
          <h1><Link to={"/admin/adminflight"}>Add Flight</Link></h1>
          <h1><Link to={"/admin/adminstay"}>Add Stays</Link></h1>
          <h1><Link to={"/admin/products"}>All Flights</Link></h1>
          <h1><Link to={"/admin/hotels"}>All Hotels</Link></h1>
          <h1><Link to={"/"}>Log out</Link></h1>
        </div>

        {/* Main content */}
        <div className="adminProductbox">
          <div className="filterProdcut">
            <input
              placeholder="Search Hotel"
              type="text"
              value={searchTerm}
              onChange={handleSearch}
            />
            {limit > data.length ? null : (
              <button onClick={handleLoadMore}>Load More</button>
            )}
          </div>

          <div className="head"><h1>All Hotels</h1></div>

          {isLoading && <h1>Please wait...</h1>}
          {!isLoading && filteredHotels.length === 0 && <p>No hotels found.</p>}

          {filteredHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="adminProductlist"
              style={{ display: "flex", alignItems: "center" }}
            >

              <span style={{ width: "80px" }}>
                {hotel.image && (
                  <img
                    src={hotel.image}
                    alt={hotel.name || "Hotel"}
                    style={{ width: "80px", height: "60px", objectFit: "cover" }}
                  />
                )}
              </span>

              {editId === hotel.id ? (
                <>
                  <span style={{ flex: 1 }}>
                    <input
                      name="name"
                      value={editData.name || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                      placeholder="Name"
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
                      name="taxes"
                      value={editData.taxes || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                      placeholder="Taxes"
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
                    <input
                      name="number"
                      value={editData.number || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                      placeholder="Contact"
                    />
                  </span>
                  <span style={{ width: "180px" }}>
                    <button onClick={cancelEdit}>Done</button>
                  </span>
                </>
              ) : (
                <>
                  <span style={{ flex: 1, marginLeft: "10px" }}>
                    {hotel.name && hotel.name.length > 10
                      ? hotel.name.substring(0, 10) + "..."
                      : hotel.name || "Unnamed"}
                  </span>
                  <span style={{ flex: 1, marginLeft: "10px" }}>{hotel.place}</span>
                  <span style={{ flex: 1, marginLeft: "10px" }}>Rs.{hotel.taxes}</span>
                  <span style={{ flex: 1, marginLeft: "10px" }}>Rs.{hotel.price}</span>
                  <span style={{ flex: 1, marginLeft: "10px" }}>{hotel.number}</span>
                  <span style={{ width: "180px", textAlign: "right", marginLeft: "10px" }}>
                    <button onClick={() => handleDeleteHotel(hotel.id)}>Delete</button>
                    <button onClick={() => startEdit(hotel)}>Edit</button>
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
