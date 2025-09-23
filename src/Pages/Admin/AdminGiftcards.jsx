import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../baseurl";
import "./adminProduct.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";

export const AdminGiftcards = () => {
  const [giftcards, setGiftcards] = useState([]);       // full list from API
  const [filteredGiftcards, setFilteredGiftcards] = useState([]); // list shown after search
  const [limit, setLimit] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchGiftcards = async (limitValue = limit) => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API}/giftcards?_limit=${limitValue}`);
      setGiftcards(res.data);
      setFilteredGiftcards(res.data);
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

  const handleLoadMore = () => {
    setLimit((prev) => prev + 5);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    if (!value.trim()) {
      setFilteredGiftcards(giftcards);
      return;
    }
    const filtered = giftcards.filter((gc) =>
      [gc.title, gc.category, gc.code]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(value))
    );
    setFilteredGiftcards(filtered);
  };

  useEffect(() => {
    fetchGiftcards(limit);
  }, [limit]);

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
          <h1><Link to={"/"}>Log out</Link></h1>
        </div>

        <div className="adminProductbox">
          <div className="filterProdcut">
            <input
              placeholder="Search Giftcard"
              type="text"
              value={searchTerm}
              onChange={handleSearch}
            />
            {limit > giftcards.length ? null : (
              <button onClick={handleLoadMore}>Load More</button>
            )}
          </div>

          <div className="head"><h1>All Giftcards</h1></div>

          {isLoading && <h2>Please wait...</h2>}

          {!isLoading && filteredGiftcards.length === 0 && (
            <p>No giftcards found.</p>
          )}

          {filteredGiftcards.map((gc) => (
            <div
                key={gc.id}
                className="adminProductlist"
                style={{
                display: "flex",
                alignItems: "center"
                }}
            >
                {gc.image && (
                <div style={{ width: "60px" }}>
                    <img
                    src={gc.image}
                    alt={gc.title}
                    style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "6px"
                    }}
                    />
                </div>
                )}

                <span style={{ flex: 1, marginLeft: "20px"}}>{gc.title}</span>
                <span style={{ flex: 1 }}>{gc.category}</span>
                <span style={{ flex: 1 }}>{gc.code}</span>

                <span style={{ width: "160px", textAlign: "right" }}>
                <button onClick={() => handleDeleteGiftcard(gc.id)}>Delete</button>
                <button>Edit</button>
                </span>
            </div>
            ))}
        </div>
      </div>
    </>
  );
};
