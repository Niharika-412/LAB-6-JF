// src/App.jsx
import React, { useState, useEffect } from "react";
import config from "./config"; // ✅ Import config

const API = `${config.url}/bookapi`;

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  // Load all books
  const loadBooks = () => {
    fetch(`${API}/all`)
      .then(res => {
        if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
        return res.json();
      })
      .then(data => setBooks(data || []))
      .catch(err => {
        console.error("Could not load books:", err);
        setBooks([]);
      });
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const clearForm = () => {
    setTitle("");
    setAuthor("");
    setPrice("");
    setEditId(null);
  };

  const addBook = () => {
    if (!title || !author || !price) {
      alert("Please fill title, author and price");
      return;
    }
    const body = { title, author, price: Number(price) };
    setLoading(true);
    fetch(`${API}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
      .then(res => {
        setLoading(false);
        if (!res.ok) throw new Error(`Add failed (${res.status})`);
        return res.json();
      })
      .then(newBook => {
        setBooks(prev => [...prev, newBook]);
        clearForm();
      })
      .catch(err => {
        setLoading(false);
        console.error("Add book error:", err);
        alert("Failed to add book. See console.");
      });
  };

  const startEdit = (book) => {
    setEditId(book.id);
    setTitle(book.title || "");
    setAuthor(book.author || "");
    setPrice(book.price != null ? String(book.price) : "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateBook = () => {
    if (!editId) return alert("No book selected for update");
    if (!title || !author || !price) {
      alert("Please fill title, author and price");
      return;
    }
    const body = { title, author, price: Number(price) };
    setLoading(true);
    fetch(`${API}/update/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
      .then(res => {
        setLoading(false);
        if (!res.ok) throw new Error(`Update failed (${res.status})`);
        return res.json();
      })
      .then(updated => {
        setBooks(prev => prev.map(b => (b.id === updated.id ? updated : b)));
        clearForm();
      })
      .catch(err => {
        setLoading(false);
        console.error("Update book error:", err);
        alert("Failed to update book. See console.");
      });
  };

  const deleteBook = (id) => {
    if (!window.confirm("Delete this book?")) return;
    fetch(`${API}/delete/${id}`, {
      method: "DELETE"
    })
      .then(res => {
        if (!res.ok) throw new Error(`Delete failed (${res.status})`);
        setBooks(prev => prev.filter(b => b.id !== id));
      })
      .catch(err => {
        console.error("Delete book error:", err);
        alert("Failed to delete book. See console.");
      });
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif", maxWidth: 900 }}>
      <h1>📚 Book Management</h1>

      <div style={{ marginBottom: 12, display: "flex", gap: 8, alignItems: "center" }}>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} />
        <input placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} style={{ width: 100 }} />

        {editId ? (
          <>
            <button onClick={updateBook} disabled={loading}>{loading ? "Saving..." : "Save Update"}</button>
            <button onClick={clearForm} disabled={loading}>Cancel</button>
          </>
        ) : (
          <button onClick={addBook} disabled={loading}>{loading ? "Adding..." : "Add Book"}</button>
        )}
        <button onClick={loadBooks}>Refresh</button>
      </div>

      <h2>All Books ({books.length})</h2>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>Title</th>
            <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>Author</th>
            <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>Price</th>
            <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.length === 0 ? (
            <tr><td colSpan={4} style={{ padding: 8 }}>No books yet</td></tr>
          ) : books.map(b => (
            <tr key={b.id || `${b.title}-${b.author}`}>
              <td style={{ padding: 8, borderBottom: "1px solid #f2f2f2" }}>{b.title}</td>
              <td style={{ padding: 8, borderBottom: "1px solid #f2f2f2" }}>{b.author}</td>
              <td style={{ padding: 8, borderBottom: "1px solid #f2f2f2" }}>{b.price}</td>
              <td style={{ padding: 8, borderBottom: "1px solid #f2f2f2" }}>
                <button onClick={() => startEdit(b)} style={{ marginRight: 8 }}>Edit</button>
                <button onClick={() => deleteBook(b.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
