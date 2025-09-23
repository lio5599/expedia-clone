import React, { useEffect, useState } from "react";
import "./adminProduct.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { DeleteHotel, fetchingHotels } from "../../Redux/AdminHotel/action";

export const AllHotels = () => {
  const dispatch = useDispatch();
  const [limit, setLimit] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHotels, setFilteredHotels] = useState([]);
  const { isLoading, data } = useSelector(
    (store) => ({
      isLoading: store.HotelReducer.isLoading,
      data: store.HotelReducer.data,
    }),
    shallowEqual
  );

  const handleDeleteHotel = (deleteId) => {
    dispatch(DeleteHotel(deleteId));
    toast.success("Hotel Removed", {
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

  // Update filtered list whenever data changes
  useEffect(() => {
    setFilteredHotels(data);
  }, [data]);

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
          {!isLoading && filteredHotels.length === 0 && (
            <p>No hotels found.</p>
          )}

          {filteredHotels.map((ele, i) => (
            <div
              key={i}
              className="adminProductlist"
              style={{ display: "flex", alignItems: "center" }}
            >

              <span style={{ width: "80px" }}>
                {ele.image && (
                  <img
                    src={ele.image}
                    alt={ele.name || "Hotel"}
                    style={{ width: "80px", height: "60px", objectFit: "cover" }}
                  />
                )}
              </span>

              <span style={{ flex: 1, marginLeft: "10px" }}>
                {ele.name && ele.name.length > 10
                  ? ele.name.substring(0, 10) + "..."
                  : ele.name || "Unnamed"}
              </span>
              <span style={{ flex: 1, marginLeft: "10px" }}>{ele.place}</span>
              <span style={{ flex: 1, marginLeft: "10px" }}>Rs.{ele.taxes}</span>
              <span style={{ flex: 1, marginLeft: "10px" }}>Rs.{ele.price}</span>
              <span style={{ flex: 1, marginLeft: "10px" }}>{ele.number}</span>

              <span style={{ width: "180px", textAlign: "right", marginLeft: "10px" }}>
                <button onClick={() => handleDeleteHotel(ele.id)}>Delete</button>
                <button>Edit</button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
