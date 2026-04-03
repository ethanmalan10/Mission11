import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Book {
  bookID: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
}

const emptyForm: Omit<Book, 'bookID'> = {
  title: '', author: '', publisher: '', isbn: '',
  classification: '', category: '', pageCount: 0, price: 0,
};

function AdminBooks() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [editingID, setEditingID] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<Omit<Book, 'bookID'>>(emptyForm);

  const loadBooks = () =>
    fetch('/api/books?pageSize=200')
      .then(res => res.json())
      .then(data => setBooks(data.books));

  useEffect(() => { loadBooks(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'pageCount' ? parseInt(value) : name === 'price' ? parseFloat(value) : value,
    }));
  };

  const handleAdd = () => {
    fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    }).then(() => { setShowAdd(false); setForm(emptyForm); loadBooks(); });
  };

  const handleEdit = (book: Book) => {
    setEditingID(book.bookID);
    setShowAdd(false);
    const { bookID, ...rest } = book;
    setForm(rest);
  };

  const handleUpdate = () => {
    fetch(`/api/books/${editingID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    }).then(() => { setEditingID(null); setForm(emptyForm); loadBooks(); });
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('Delete this book?')) return;
    fetch(`/api/books/${id}`, { method: 'DELETE' }).then(loadBooks);
  };

  const cancelForm = () => { setShowAdd(false); setEditingID(null); setForm(emptyForm); };

  const BookForm = () => (
    <div className="card mb-4">
      <div className="card-header fw-bold">{editingID !== null ? 'Edit Book' : 'Add New Book'}</div>
      <div className="card-body">
        <div className="row g-2">
          {(['title', 'author', 'publisher', 'isbn', 'classification', 'category'] as const).map(field => (
            <div className="col-md-4" key={field}>
              <label className="form-label text-capitalize">{field === 'isbn' ? 'ISBN' : field}</label>
              <input className="form-control form-control-sm" name={field} value={form[field]} onChange={handleChange} required />
            </div>
          ))}
          <div className="col-md-4">
            <label className="form-label">Pages</label>
            <input className="form-control form-control-sm" type="number" name="pageCount" value={form.pageCount} onChange={handleChange} required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Price</label>
            <input className="form-control form-control-sm" type="number" step="0.01" name="price" value={form.price} onChange={handleChange} required />
          </div>
        </div>
        <div className="mt-3 d-flex gap-2">
          <button className="btn btn-primary" onClick={editingID !== null ? handleUpdate : handleAdd}>
            {editingID !== null ? 'Update' : 'Add'}
          </button>
          <button className="btn btn-outline-secondary" onClick={cancelForm}>Cancel</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin — Manage Books</h1>
        <div className="d-flex gap-2">
          <button className="btn btn-success" onClick={() => { setShowAdd(true); setEditingID(null); setForm(emptyForm); }}>
            + Add Book
          </button>
          <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>
            &larr; Back to Store
          </button>
        </div>
      </div>

      {(showAdd || editingID !== null) && <BookForm />}

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Publisher</th>
              <th>ISBN</th>
              <th>Classification</th>
              <th>Category</th>
              <th>Pages</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.bookID}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.publisher}</td>
                <td>{book.isbn}</td>
                <td>{book.classification}</td>
                <td>{book.category}</td>
                <td>{book.pageCount}</td>
                <td>${book.price.toFixed(2)}</td>
                <td>
                  <div className="d-flex gap-1">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(book)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(book.bookID)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminBooks;
