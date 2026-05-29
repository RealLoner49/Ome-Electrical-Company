import "./Profile.css";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user, logout, requireLogin, setAuthModalOpen, setAuthMessage } = useAuth();

  const orders = [];

  const deliveredOrders = orders.filter((order) => order.status === "Delivered");
  const processingOrders = orders.filter((order) => order.status === "Processing");
  const totalSpent = orders.reduce((acc, order) => acc + Number(order.price || 0), 0);

  const handleLogout = async () => {
    await logout();
    window.location.hash = "#/";
  };

  const handleCheckout = () => {
    if (requireLogin("Please login to proceed to checkout.")) {
      window.location.hash = "#/checkout";
    }
  };

  const handleTrackOrder = (orderId) => {
    if (requireLogin("Please login to track your order.")) {
      window.location.hash = `#/checkout?orderId=${orderId}`;
    }
  };

  const handleAddAddress = () => {
    if (requireLogin("Please login to add or update your delivery address.")) {
      window.location.hash = "#/checkout";
    }
  };

  const handleContactSupport = () => {
    window.location.href = "mailto:support@omeelectrical.com?subject=Support%20Request";
  };

  const handleManageSecurity = () => {
    if (!user) {
      setAuthMessage("Please login to manage your account security.");
      setAuthModalOpen(true);
      return;
    }

    setAuthMessage(
      "For account security help, please sign in again or contact support via email."
    );
    setAuthModalOpen(true);
  };

  return (
    <main className="profile">
      <section className="profileHero">
        <div>
          <p className="profileEyebrow">Customer dashboard</p>
          <h1>My Profile</h1>
          <p>
            Manage your account, track deliveries, and view completed purchases.
          </p>
        </div>

        <div className="profileHeroActions">
          <button className="profileSmallBtn" onClick={handleCheckout}>
            Checkout
          </button>

          <button className="profileLogout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </section>

      <section className="profileGrid">
        <aside className="profileCard userCard">
          <div className="avatar">
            {(user?.displayName || user?.email || "U").charAt(0).toUpperCase()}
          </div>

          <h2>{user?.displayName || "Customer"}</h2>
          <p>{user?.email || "No email available"}</p>

          <span className="verifiedBadge">✓ Verified Customer</span>
        </aside>

        <div className="profileStats">
          <div className="statCard">
            <span>{orders.length}</span>
            <p>Total Orders</p>
          </div>

          <div className="statCard">
            <span>{processingOrders.length}</span>
            <p>Processing</p>
          </div>

          <div className="statCard">
            <span>{deliveredOrders.length}</span>
            <p>Delivered</p>
          </div>

          <div className="statCard">
            <span>₦{totalSpent.toLocaleString()}</span>
            <p>Total Spent</p>
          </div>
        </div>
      </section>

      <section className="profileSection">
        <div className="sectionHead">
          <div>
            <p className="profileEyebrow">Recent activity</p>
            <h2>My Orders</h2>
          </div>

          <button className="profileSmallBtn">View all</button>
        </div>

        {orders.length === 0 ? (
          <div className="emptyOrders">
            <div className="emptyOrdersIcon">🛒</div>
            <h3>No product ordered yet</h3>
            <p>
              Your completed purchases will appear here after successful payment.
            </p>

            <button className="profileSmallBtn" onClick={() => (window.location.hash = "#/shop")}>
              Start shopping
            </button>
          </div>
        ) : (
          <div className="ordersGrid">
            {orders.map((order) => (
              <article className="orderCard" key={order.id}>
                <img src={order.image} alt={order.product} />

                <div className="orderInfo">
                  <div className="orderTop">
                    <span>Order #{order.id}</span>

                    <strong
                      className={order.status === "Delivered" ? "done" : "pending"}
                    >
                      {order.status}
                    </strong>
                  </div>

                  <h3>{order.product}</h3>
                  <p>Placed {order.date}</p>

                  <div className="orderBottom">
                    <strong>₦{Number(order.price).toLocaleString()}</strong>

                    <button onClick={() => handleTrackOrder(order.id)}>
                      Track order
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="profileBottom">
        <div className="infoPanel">
          <h3>Delivery Address</h3>
          <p>No address added yet.</p>
          <button className="profileSmallBtn" onClick={handleAddAddress}>
            Add address
          </button>
        </div>

        <div className="infoPanel">
          <h3>Support</h3>
          <p>Need help with an order? Contact our support team.</p>
          <button className="profileSmallBtn" onClick={handleContactSupport}>
            Contact support
          </button>
        </div>

        <div className="infoPanel">
          <h3>Account Security</h3>
          <p>Your account is protected with Firebase authentication.</p>
          <button className="profileSmallBtn" onClick={handleManageSecurity}>
            Manage
          </button>
        </div>
      </section>
    </main>
  );
}