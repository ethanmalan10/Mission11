import { useCart } from '../context/CartContext';

function Cart({ onContinueShopping }: { onContinueShopping: () => void }) {
  const { items, updateQuantity, removeFromCart, total } = useCart();

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="alert alert-info">Your cart is empty.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.bookID}>
                  <td>{item.title}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      style={{ width: '70px' }}
                      min={1}
                      value={item.quantity}
                      onChange={e => updateQuantity(item.bookID, Number(e.target.value))}
                    />
                  </td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => removeFromCart(item.bookID)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="table-dark">
                <td colSpan={3} className="text-end fw-bold">Total:</td>
                <td className="fw-bold">${total.toFixed(2)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <button className="btn btn-primary" onClick={onContinueShopping}>
        &larr; Continue Shopping
      </button>
    </div>
  );
}

export default Cart;
