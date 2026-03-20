import { useEffect, useState } from 'react';

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

interface BooksResponse {
  totalCount: number;
  books: Book[];
}

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);

  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/books?page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`)
      .then(res => res.json())
      .then((data: BooksResponse) => {
        setBooks(data.books);
        setTotalCount(data.totalCount);
        setLoading(false);
      });
  }, [page, pageSize, sortOrder]);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Bookstore</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="pageSizeSelect" className="form-label mb-0">Books per page:</label>
          <select
            id="pageSizeSelect"
            className="form-select form-select-sm w-auto"
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={16}>All</option>
          </select>
        </div>
        <div className="text-muted">
          Showing {totalCount === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalCount)} of {totalCount} books
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status" />
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>
                  <button
                    className="btn btn-link text-white text-decoration-none p-0 fw-bold"
                    onClick={() => { setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc'); setPage(1); }}
                  >
                    Title {sortOrder === 'asc' ? '▲' : '▼'}
                  </button>
                </th>
                <th>Author</th>
                <th>Publisher</th>
                <th>ISBN</th>
                <th>Classification</th>
                <th>Category</th>
                <th>Pages</th>
                <th>Price</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <nav className="d-flex justify-content-center mt-3">
        <ul className="pagination">
          <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPage(p => p - 1)}>Previous</button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <li key={p} className={`page-item ${page === p ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setPage(p)}>{p}</button>
            </li>
          ))}
          <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPage(p => p + 1)}>Next</button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default BookList;
