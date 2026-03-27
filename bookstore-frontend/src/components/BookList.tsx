import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

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

interface Props {
  initialPage: number;
  onGoToCart: (currentPage: number) => void;
}

function BookList({ initialPage, onGoToCart }: Props) {
  const { addToCart, itemCount, total } = useCart();

  const [books, setBooks] = useState<Book[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(5);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState('');

  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    fetch('http://localhost:5000/api/books/categories')
      .then(res => res.json())
      .then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/books?page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}&category=${category}`)
      .then(res => res.json())
      .then((data: BooksResponse) => {
        setBooks(data.books);
        setTotalCount(data.totalCount);
        setLoading(false);
      });
  }, [page, pageSize, sortOrder, category]);

  const selectCategory = (cat: string) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <div className="container-fluid mt-4">
      {/* Header */}
      <div className="row align-items-center mb-4">
        <div className="col">
          <h1 className="mb-0">Bookstore</h1>
        </div>
        <div className="col-auto">
          {/* Bootstrap Badge: pill badge on cart button showing item count */}
          <button
            className="btn btn-outline-dark position-relative"
            onClick={() => onGoToCart(page)}
          >
            Cart
            {itemCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 mb-4">
          {/* Bootstrap Accordion: category filter */}
          <div className="accordion mb-3" id="filterAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#categoryCollapse"
                >
                  Filter by Category
                </button>
              </h2>
              <div id="categoryCollapse" className="accordion-collapse collapse show">
                <div className="accordion-body d-grid gap-1">
                  <button
                    className={`btn btn-sm ${category === '' ? 'btn-dark' : 'btn-outline-secondary'}`}
                    onClick={() => selectCategory('')}
                  >
                    All
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      className={`btn btn-sm ${category === cat ? 'btn-dark' : 'btn-outline-secondary'}`}
                      onClick={() => selectCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cart summary card */}
          <div className="card">
            <div className="card-header fw-bold">Cart Summary</div>
            <div className="card-body">
              {itemCount === 0 ? (
                <p className="text-muted mb-0">No items in cart</p>
              ) : (
                <>
                  <p className="mb-1">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
                  <p className="mb-2 fw-bold">Total: ${total.toFixed(2)}</p>
                  <button className="btn btn-sm btn-primary w-100" onClick={() => onGoToCart(page)}>
                    View Cart
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="col-md-9">
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
                <option value={25}>25</option>
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
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => addToCart({ bookID: book.bookID, title: book.title, price: book.price })}
                        >
                          Add
                        </button>
                      </td>
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
      </div>
    </div>
  );
}

export default BookList;
