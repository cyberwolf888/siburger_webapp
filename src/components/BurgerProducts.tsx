import { useState } from "react";
import { useTelegramBot } from "../hooks/useTelegramBot";
import { useTelegramWebApp } from "../hooks/useTelegramWebApp";

interface BurgerProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
}

interface CartItem extends BurgerProduct {
  quantity: number;
}

// Sample burger products data
// Helper to format price as 'Rp 21.000'
const formatRupiah = (amount: number): string => {
  return `Rp ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
};

const BURGER_PRODUCTS: BurgerProduct[] = [
  {
    id: 1,
    name: "Ayam Teriyaki Burger",
    description: "Chicken patty, teriyaki sauce, lettuce, tomato",
    price: 8000,
    category: "Classic",
  },
  {
    id: 2,
    name: "Ayam Rica-Rica Burger",
    description: "Chicken patty, rica-rica sauce, lettuce, tomato",
    price: 8000,
    category: "Premium",
  },
  {
    id: 3,
    name: "Ayam Rendang Burger",
    description: "Chicken patty, rendang sauce, lettuce, tomato",
    price: 8000,
    category: "Gourmet",
  },
  {
    id: 4,
    name: "Ikan Cakalang Burger",
    description: "Cakalang fish patty, spicy mayo, lettuce, tomato",
    price: 8000,
    category: "Spicy",
  },
];

const NOTIF_CHAT_ID = 765730507;

export const BurgerProducts = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { sendMessage } = useTelegramBot();
  const { user } = useTelegramWebApp();

  const addToCart = (product: BurgerProduct) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const getItemQuantity = (productId: number): number => {
    const item = cart.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  const getTotalItems = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = (): number => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    // Get customer information from Telegram user data
    const customerName = user
      ? `${user.first_name}${user.last_name ? " " + user.last_name : ""}`
      : "Unknown Customer";

    const customerContact = user?.username
      ? `@${user.username}`
      : user?.id
      ? `User ID: ${user.id}`
      : "No contact info";

    // Create detailed checkout message
    const orderDate = new Date().toLocaleString();
    const itemsList = cart
      .map(
        (item) =>
          `• ${item.name} x${item.quantity} - ${formatRupiah(
            item.price * item.quantity
          )}`
      )
      .join("\n");

    const checkoutMessage = `🛒 NEW ORDER RECEIVED!

📅 Order Date: ${orderDate}
👤 Customer: ${customerName}
📱 Contact: ${customerContact}
🆔 Telegram ID: ${user?.id || "N/A"}

📦 ORDER DETAILS:
${itemsList}

💰 TOTAL: ${formatRupiah(getTotalPrice())}
📊 Total Items: ${getTotalItems()}

🏪 Order placed via Burger WebApp
⚡ Status: Pending Payment

📞 Customer can be reached via Telegram: ${customerContact}`;

    try {
      // Send message to the specified user ID
      await sendMessage(NOTIF_CHAT_ID, checkoutMessage, "HTML");

      console.log("Checkout message sent successfully");

      // Show success message to user
      alert(
        `Order placed successfully! 🎉\nTotal: ${formatRupiah(
          getTotalPrice()
        )}\nOrder details sent to restaurant.`
      );

      // Clear cart after successful checkout
      setCart([]);
    } catch (err) {
      console.error("Failed to send checkout message:", err);
      alert("Order processing failed. Please try again or contact support.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          🍔 Our Burgers
        </h2>
        <p className="text-gray-600">
          Delicious burgers made with fresh ingredients
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {BURGER_PRODUCTS.map((product) => {
          const quantity = getItemQuantity(product.id);

          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Product Info */}
              <div className="p-6">
                {/* Category Badge */}
                <div className="mb-3">
                  <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                    {product.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-green-600">
                    {formatRupiah(product.price)}
                  </span>
                </div>

                {/* Quantity Controls */}
                {quantity > 0 ? (
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        <span className="text-lg font-bold text-gray-600">
                          −
                        </span>
                      </button>

                      <span className="text-lg font-semibold min-w-[2rem] text-center text-gray-800">
                        {quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors"
                      >
                        <span className="text-lg font-bold text-white">+</span>
                      </button>
                    </div>

                    <span className="text-sm font-medium text-gray-600">
                      {formatRupiah(product.price * quantity)}
                    </span>
                  </div>
                ) : (
                  <div className="mb-4">
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 active:transform active:scale-95"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <span>Add to Cart</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Checkout Section */}
      {cart.length > 0 && (
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-t-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"}
              </div>
              <span className="text-2xl font-bold text-gray-800">
                {formatRupiah(getTotalPrice())}
              </span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 active:transform active:scale-95 shadow-lg"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 21a2 2 0 100-4 2 2 0 000 4zm-8 0a2 2 0 100-4 2 2 0 000 4z"
              />
            </svg>
            <span>Proceed to Checkout</span>
          </button>
        </div>
      )}
    </div>
  );
};
