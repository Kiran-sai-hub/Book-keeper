"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Plus, X, MoreVertical, Trash2, BookMarked } from "lucide-react";

const STATUSES = [
    { value: "reading", label: "Reading" },
    { value: "wants-to-read", label: "Wants to Read" },
    { value: "completed", label: "Completed" },
];

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newBook, setNewBook] = useState({ title: "", author: "", tags: "" });
    const [addError, setAddError] = useState("");
    const [adding, setAdding] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRef = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {

                const meRes = await fetch("/api/v1/auth/me");
                const meData = await meRes.json();

                if (!meRes.ok || !meData.success) {
                    router.push("/login");
                    return;
                }

                setUser(meData.user);

                const booksRes = await fetch("/api/v1/books");
                const booksData = await booksRes.json();

                if (booksRes.ok && booksData.success) {
                    setBooks(booksData.data);
                }
            } catch {
                router.push("/login");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [router]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("/api/v1/auth/logout", { method: "POST" });
            router.push("/login");
        } catch {

            router.push("/login");
        }
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        setAddError("");
        setAdding(true);

        try {
            const tags = newBook.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean);

            const res = await fetch("/api/v1/books", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newBook.title, author: newBook.author, tags }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                setAddError(data.message || "Failed to add book");
                return;
            }

            setBooks((prev) => [...prev, data.data]);
            setNewBook({ title: "", author: "", tags: "" });
            setShowModal(false);
        } catch {
            setAddError("Something went wrong. Please try again.");
        } finally {
            setAdding(false);
        }
    };

    const handleStatusChange = async (bookId, newStatus) => {
        setOpenMenuId(null);
        try {
            const res = await fetch(`/api/v1/books/${bookId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setBooks((prev) =>
                    prev.map((b) => (b._id === bookId ? data.data : b))
                );
            }
        } catch { /* silent */ }
    };

    const handleDelete = async (bookId) => {
        setOpenMenuId(null);
        try {
            const res = await fetch(`/api/v1/books/${bookId}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setBooks((prev) => prev.filter((b) => b._id !== bookId));
            }
        } catch { /* silent */ }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner" />
                Loading…
            </div>
        );
    }

    return (
        <div className="dashboard">
            <nav className="dashboard-nav">
                <div className="logo">
                    Book<span>Keeper</span>
                </div>
                <div className="nav-right">
                    {user && <span className="user-name">{user.username}</span>}
                    <button className="btn btn-danger" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>

            <main className="dashboard-content">
                <div className="welcome-section">
                    <h1>
                        Hello, {user?.username || "there"}
                    </h1>
                    <p>Here&apos;s your personal book collection.</p>
                </div>

                <div className="section-header">
                    <h2>Your Books</h2>
                    <div className="section-header-right">
                        <span className="book-count">
                            {books.length} {books.length === 1 ? "book" : "books"}
                        </span>
                        <button
                            className="btn btn-add"
                            onClick={() => { setShowModal(true); setAddError(""); }}
                        >
                            <Plus size={16} />
                            Add Book
                        </button>
                    </div>
                </div>

                {books.length === 0 ? (
                    <div className="empty-state">
                        <div className="emoji"><BookOpen /></div>
                        <p>No books yet. Start building your collection!</p>
                    </div>
                ) : (
                    <div className="books-grid">
                        {books.map((book) => (
                            <div key={book._id} className="book-card">
                                <div className="book-card-header">
                                    <div>
                                        <div className="book-title">{book.title}</div>
                                        <div className="book-author">by {book.author}</div>
                                    </div>
                                    <div className="kebab-wrapper" ref={openMenuId === book._id ? menuRef : null}>
                                        <button
                                            className="kebab-btn"
                                            onClick={() => setOpenMenuId(openMenuId === book._id ? null : book._id)}
                                        >
                                            <MoreVertical size={16} />
                                        </button>
                                        {openMenuId === book._id && (
                                            <div className="dropdown-menu">
                                                <div className="dropdown-label">Set status</div>
                                                {STATUSES.map((s) => (
                                                    <button
                                                        key={s.value}
                                                        className={`dropdown-item${book.status === s.value ? " active" : ""}`}
                                                        onClick={() => handleStatusChange(book._id, s.value)}
                                                    >
                                                        <BookMarked size={14} />
                                                        {s.label}
                                                    </button>
                                                ))}
                                                <div className="dropdown-divider" />
                                                <button
                                                    className="dropdown-item danger"
                                                    onClick={() => handleDelete(book._id)}
                                                >
                                                    <Trash2 size={14} />
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="book-meta">
                                    {book.status && (
                                        <span
                                            className={`status-badge ${book.status.replace(/\s+/g, "-").toLowerCase()}`}
                                        >
                                            {book.status}
                                        </span>
                                    )}
                                    {book.tags &&
                                        book.tags.map((tag) => (
                                            <span key={tag} className="tag">
                                                {tag}
                                            </span>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Add a new book</h2>
                            <button
                                className="modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {addError && <div className="error-message">{addError}</div>}

                        <form onSubmit={handleAddBook}>
                            <div className="form-group">
                                <label htmlFor="book-title">Title</label>
                                <input
                                    id="book-title"
                                    type="text"
                                    placeholder="e.g. The Great Gatsby"
                                    value={newBook.title}
                                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="book-author">Author</label>
                                <input
                                    id="book-author"
                                    type="text"
                                    placeholder="e.g. F. Scott Fitzgerald"
                                    value={newBook.author}
                                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="book-tags">Tags (comma separated)</label>
                                <input
                                    id="book-tags"
                                    type="text"
                                    placeholder="e.g. fiction, classic, american"
                                    value={newBook.tags}
                                    onChange={(e) => setNewBook({ ...newBook, tags: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={adding}
                            >
                                {adding ? "Adding…" : "Add Book"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
