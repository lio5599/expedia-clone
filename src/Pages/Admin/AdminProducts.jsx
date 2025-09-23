import React, { useEffect, useState } from "react";
import "./adminProduct.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  DeleteFlightProducts,
  fetchFlightProducts,
  // create this if you prefer redux-thunk for updating
  // UpdateFlightProduct
} from "../../Redux/AdminFlights/action";
import axios from "axios";
import { API } from "../../baseurl";

export const AdminProducts = () => {
  const dispatch = useDispatch();
  const [limit, setLimit] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFlights, setFilteredFlights] = useState([]);

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const { isLoading, data } = useSelector(
    (store) => ({
      isLoading: store.FlightReducer.isLoading,
      data: store.FlightReducer.data,
    }),
    shallowEqual
  );

  const handleDeleteFlights = (deleteId) => {
    dispatch(DeleteFlightProducts(deleteId));
    toast.success("Flight Removed");
  };

  const handleLoadMore = () => {
    if (data.length >= limit) setLimit((prev) => prev + 5);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (!value.trim()) {
      setFilteredFlights(data);
      return;
    }
    const filtered = data.filter((flight) =>
      [flight.airline, flight.from, flight.to, flight.price, flight.number]
        .filter(Boolean)
        .some((field) => field.toString().toLowerCase().includes(value))
    );
    setFilteredFlights(filtered);
  };

  useEffect(() => {
    dispatch(fetchFlightProducts(limit));
  }, [limit, dispatch]);

  useEffect(() => {
    setFilteredFlights(data);
  }, [data]);

  // ---------- Editing helpers ----------
  const startEdit = (flight) => {
    setEditId(flight.id);
    setEditData({ ...flight });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({});
  };

  const saveEdit = async (field, value) => {
    const updated = { ...editData, [field]: value };
    setEditData(updated);
    try {
      // If you have a redux action, dispatch it instead of axios.put
      await axios.put(`${API}/flights/${editId}`, updated);
      toast.success(`${field} updated`);
      dispatch(fetchFlightProducts(limit));
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
      e.target.blur(); // triggers blur→save
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
          <h1><Link to={"/"}>Log out</Link></h1>
        </div>

        <div className="adminProductbox">
          <div className="filterProdcut">
            <input
              placeholder="Search Flight"
              type="text"
              value={searchTerm}
              onChange={handleSearch}
            />
            {limit > data.length ? null : (
              <button onClick={handleLoadMore}>Load More</button>
            )}
          </div>

          <div className="head"><h1>All Flights</h1></div>

          {isLoading && <h1>Please wait...</h1>}
          {!isLoading && filteredFlights.length === 0 && <p>No flights found.</p>}

          {filteredFlights.map((flight) => (
            <div key={flight.id} className="adminProductlist">
              {editId === flight.id ? (
                <>
                  <span style={{ flex: 1 }}>
                    <input
                      name="airline"
                      value={editData.airline || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                      placeholder="Airline"
                    />
                  </span>
                  <span style={{ flex: 1 }}>
                    <input
                      name="from"
                      value={editData.from || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                      placeholder="From"
                    />
                  </span>
                  <span style={{ flex: 1 }}>
                    <input
                      name="to"
                      value={editData.to || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                      placeholder="To"
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
                      placeholder="Flight Number"
                    />
                  </span>
                  <span style={{ flex: 1 }}>
                    <button onClick={cancelEdit}>Done</button>
                  </span>
                </>
              ) : (
                <>
                  <span style={{ flex: 1, marginLeft: "10px" }}>{flight.airline}</span>
                  <span style={{ flex: 1, marginLeft: "10px" }}>{flight.from}</span>
                  <span style={{ flex: 1, marginLeft: "10px" }}>{flight.to}</span>
                  <span style={{ flex: 1, marginLeft: "10px" }}>{flight.price}</span>
                  <span style={{ flex: 1, marginLeft: "10px" }}>{flight.number}</span>
                  <span style={{ flex: 1, marginLeft: "10px" }}>
                    <button onClick={() => handleDeleteFlights(flight.id)}>Delete</button>
                    <button onClick={() => startEdit(flight)}>Edit</button>
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
