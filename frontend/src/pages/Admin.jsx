// src/pages/Admin.jsx - admin dashboard: create/edit/delete products
import { useState, useEffect } from "react";
import API from "../api/axios";

const empty = {
  name: "", brand: "", description: "", price: "", originalPrice: "",
  category: "", countInStock: "", image: "", rating: "", numReviews: ""
};

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    const { data } = await API.get("/products");
    setProducts(data);
  };
  useEffect(() => { load(); }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const resetForm = () => { setForm(empty); setEditingId(null); };

  const submit = async () => {
    setError(""); setMessage("");
    if (!form.name || form.price === "") return setError("Name and price are required");
    const payload = {
      ...form,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice) || 0,
      countInStock: Number(form.countInStock) || 0,
      rating: Number(form.rating) || 0,
      numReviews: Number(form.numReviews) || 0
    };
    try {
      if (editingId) {
        await API.put(`/products/${editingId}`, payload);
        setMessage("Product updated");
      } else {
        await API.post("/products", payload);
        setMessage("Product created");
      }
      resetForm();
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    }
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name, brand: p.brand, description: p.description, price: p.price,
      originalPrice: p.originalPrice, category: p.category, countInStock: p.countInStock,
      image: p.image, rating: p.rating, numReviews: p.numReviews
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    try { await API.delete(`/products/${id}`); load(); }
    catch (err) { setError(err.response?.data?.message || "Delete failed"); }
  };

  return (
    <div className="container">
      <h1 className="section-title">Admin Dashboard</h1>
      <p className="section-sub">Manage your product catalog</p>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 10, fontWeight: 800 }}>
          {editingId ? "Edit product" : "Add a new product"}
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div><label>Name</label><input name="name" value={form.name} onChange={change} /></div>
          <div><label>Brand</label><input name="brand" value={form.brand} onChange={change} /></div>
        </div>
        <label>Description</label>
        <textarea name="description" rows={2} value={form.description} onChange={change} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div><label>Price ($)</label><input name="price" type="number" step="0.01" value={form.price} onChange={change} /></div>
          <div><label>Original price ($)</label><input name="originalPrice" type="number" step="0.01" value={form.originalPrice} onChange={change} /></div>
          <div><label>Stock</label><input name="countInStock" type="number" value={form.countInStock} onChange={change} /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div><label>Category</label><input name="category" value={form.category} onChange={change} /></div>
          <div><label>Rating (0-5)</label><input name="rating" type="number" step="0.1" max="5" value={form.rating} onChange={change} /></div>
          <div><label># Reviews</label><input name="numReviews" type="number" value={form.numReviews} onChange={change} /></div>
        </div>
        <label>Image URL</label>
        <input name="image" value={form.image} onChange={change} placeholder="https://..." />

        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button className="btn blue" onClick={submit}>
            {editingId ? "Update product" : "Add product"}
          </button>
          {editingId && <button className="btn outline" onClick={resetForm}>Cancel</button>}
        </div>
      </div>

      <table className="table">
        <thead>
          <tr><th></th><th>Name</th><th>Brand</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td><img src={p.image} alt={p.name} /></td>
              <td>{p.name}</td>
              <td>{p.brand}</td>
              <td>{p.category}</td>
              <td>${p.price.toFixed(2)}</td>
              <td>{p.countInStock}</td>
              <td>
                <div className="row-actions">
                  <button className="btn outline sm" onClick={() => startEdit(p)}>Edit</button>
                  <button className="btn danger sm" onClick={() => remove(p._id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
