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
} from "../../Redux/AdminFlights/action";

export const AdminProducts = () => {
  const dispatch = useDispatch();
  const [limit, setLimit] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFlights, setFilteredFlights] = useState([]);
  const { isLoading, data } = useSelector(
    (store) => ({
      isLoading: store.FlightReducer.isLoading,
      data: store.FlightReducer.data,
    }),
    shallowEqual
  );

  const handleDeleteFlights = (deleteId) => {
    dispatch(DeleteFlightProducts(deleteId));
    toast.success("Flight Removed", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const handleLoadMore = () => {
    if (data.length >= limit) {
      setLimit((prev) => prev + 5);
    }
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

  // Update filtered list when API data changes
  useEffect(() => {
    setFilteredFlights(data);
  }, [data]);

  return (
    <>
      <ToastContainer />
      <div className="adminProductMain">
        {/* Left sidebar */}
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

          {!isLoading && filteredFlights.length === 0 && (
            <p>No flights found.</p>
          )}

          {filteredFlights.map((ele, i) => (
            <div
              key={i}
              className="adminProductlist"
              style={{ display: "flex", alignItems: "center" }}
            >
              <span style={{ flex: 1, marginLeft: "10px" }}>{ele.airline}</span>
              <span style={{ flex: 1, marginLeft: "10px" }}>{ele.from}</span>
              <span style={{ flex: 1, marginLeft: "10px" }}>{ele.to}</span>
              <span style={{ flex: 1, marginLeft: "10px" }}>{ele.price}</span>
              <span style={{ flex: 1, marginLeft: "10px" }}>{ele.number}</span>
              <span style={{ flex: 1, marginLeft: "10px" }}>
                <button onClick={() => handleDeleteFlights(ele.id)}>Delete</button>
                <button>Edit</button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
