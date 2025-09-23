import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../baseurl";
import "./adminProduct.css"; // reuse the same CSS
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async (limitValue = limit) => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API}/users?_limit=${limitValue}`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${API}/users/${id}`);
      toast.success("User removed");
      fetchUsers(limit); // refresh list
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  const handleLoadMore = () => setLimit((prev) => prev + 10);

  useEffect(() => {
    fetchUsers(limit);
  }, [limit]);

  const filteredUsers = users.filter((u) =>
    Object.values(u)
      .join(" ") // combine all fields into one string
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <ToastContainer />
      <div className="adminProductMain">
        <div className="adminSideBr">
          <h1><Link to="/admin">Home</Link></h1>
          <h1><Link to="/admin/adminflight">Add Flight</Link></h1>
          <h1><Link to="/admin/adminstay">Add Stays</Link></h1>
          <h1><Link to="/admin/products">All Flights</Link></h1>
          <h1><Link to="/admin/hotels">All Hotels</Link></h1>
          <h1><Link to="/admin/giftcards">All Giftcards</Link></h1>
          <h1><Link to="/admin/packages">All Packages</Link></h1>
          <h1><Link to="/admin/users">All Users</Link></h1>
          <h1><Link to="/">Log out</Link></h1>
        </div>

        <div className="adminProductbox">
          <div className="filterProdcut">
            <input
              placeholder="Search User"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={() => fetchUsers(limit)}>Search</button>
            {limit > users.length ? "" : (
              <button onClick={handleLoadMore}>Load More</button>
            )}
          </div>

          <div className="head"><h1>All Users</h1></div>

          {isLoading && <h2>Please wait...</h2>}
          {filteredUsers.length === 0 && !isLoading && (
            <p>No users found.</p>
          )}

          {filteredUsers.map((u) => (
            <div
                key={u.id}
                className="adminProductlist"
                style={{ display: "flex", alignItems: "center" }}
            >
                <span style={{ flex: 1, marginLeft: "10px" }}>{u.user_name || "N/A"}</span>
                <span style={{ flex: 1, marginLeft: "10px" }}>{u.email || "N/A"}</span>
                <span style={{ flex: 1, marginLeft: "10px" }}>{u.number || "N/A"}</span>
                <span style={{ flex: 1, marginLeft: "10px" }}>{u.dob || "N/A"}</span>
                <span style={{ flex: 1, marginLeft: "10px" }}>{u.gender || "N/A"}</span>
                <span style={{ flex: 1, marginLeft: "10px" }}>
                <button onClick={() => handleDeleteUser(u.id)}>Delete</button>
                <button>Edit</button>
                </span>
            </div>
            ))}
        </div>
      </div>
    </>
  );
};
