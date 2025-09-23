import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../baseurl";
import "./adminProduct.css"; // reuse existing adminProduct styles
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";

export const AdminPackages = () => {
  const [packages, setPackages] = useState([]);
  const [limit, setLimit] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPackages = async (limitValue = limit) => {
    try {
      setIsLoading(true);
      // assuming your API endpoint is /Things_todo
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

  const handleLoadMore = () => {
    setLimit((prev) => prev + 5);
  };

  useEffect(() => {
    fetchPackages(limit);
  }, [limit]);

  // 🔎 Filter packages client-side by searchTerm (case-insensitive)
  const filteredPackages = packages.filter((pkg) =>
    Object.values(pkg)
      .join(" ") // combine all fields into one string
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

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
          <h1><Link to={"/admin/giftcards"}>All Giftcards</Link></h1>
          <h1><Link to={"/admin/packages"}>All Packages</Link></h1>
          <h1><Link to={"/"}>Log out</Link></h1>
        </div>

        {/* Main Content */}
        <div className="adminProductbox">
          <div className="filterProdcut">
            {/* 🔎 Search bar */}
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
              <span>
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  style={{ width: "80px", height: "60px", objectFit: "cover" }}
                />
              </span>
              <span>{pkg.place}</span>
              <span>{pkg.title}</span>
              <span>{pkg.rating} ratings</span>
              <span>{pkg.adress}</span>
              <span>{pkg.price}</span>
              <span>
                <button onClick={() => handleDeletePackage(pkg.id)}>
                  Delete <i className="fa fa-trash"></i>
                </button>
                <button>
                  Edit <i className="fa fa-pencil"></i>
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
