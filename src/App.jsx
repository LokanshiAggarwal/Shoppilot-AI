import { useState } from "react";

import {
  FiArrowRight,
  FiStar,
  FiShoppingBag,
  FiZap,
  FiShield,
  FiChevronRight,
  FiMessageCircle,
  FiCheck,
  FiX,
  FiMapPin,
  FiCreditCard,
  FiTruck,
  FiUser,
  FiMail,
  FiPhone,
} from "react-icons/fi";

import "./App.css";

// =========================================================
// DEFAULT PRODUCTS
// =========================================================

const products = [
  {
    id: 1,
    name: "MacBook Air M3",
    category: "Laptop",
    price: "₹89,990",
    rating: "4.8",

    reason:
      "Excellent for coding, design and everyday productivity.",

    description:
      "A lightweight and powerful laptop designed for coding, creative work and everyday productivity.",

    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85",

    tag: "Best Match",
    match: 98,
  },

  {
    id: 2,
    name: "Dell XPS 13",
    category: "Laptop",
    price: "₹78,490",
    rating: "4.7",

    reason:
      "Powerful performance in a lightweight premium design.",

    description:
      "A premium lightweight laptop offering strong performance for development, work and everyday use.",

    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85",

    tag: "Great Value",
    match: 94,
  },

  {
    id: 3,
    name: "MacBook Pro",
    category: "Laptop",
    price: "₹1,49,990",
    rating: "4.9",

    reason:
      "Built for demanding development and creative workflows.",

    description:
      "A high-performance professional laptop designed for demanding development and creative workflows.",

    image:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=900&q=85",

    tag: "Power Pick",
    match: 92,
  },
];

// =========================================================
// IMAGE HANDLER
// =========================================================

const getProductImage = (category) => {
  const type = String(category || "").toLowerCase();

  if (
    type.includes("headphone") ||
    type.includes("earphone") ||
    type.includes("earbud") ||
    type.includes("airpod") ||
    type.includes("audio")
  ) {
    return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85";
  }

  if (
    type.includes("phone") ||
    type.includes("mobile") ||
    type.includes("smartphone")
  ) {
    return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85";
  }

  if (
    type.includes("laptop") ||
    type.includes("computer")
  ) {
    return "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85";
  }

  if (type.includes("tablet")) {
    return "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=85";
  }

  return "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=85";
};

// =========================================================
// APP
// =========================================================

function App() {
  // =======================================================
  // SEARCH STATE
  // =======================================================

  const [query, setQuery] = useState("");

  const [showResults, setShowResults] =
    useState(false);

  const [searchResults, setSearchResults] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // =======================================================
  // PRODUCT DETAILS STATE
  // =======================================================

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  // =======================================================
  // CART STATE
  // =======================================================

  const [cart, setCart] = useState([]);

  const [isCartOpen, setIsCartOpen] =
    useState(false);

  // =======================================================
  // CHECKOUT STATE
  // =======================================================

  const [showCheckout, setShowCheckout] =
    useState(false);

  const [orderConfirmed, setOrderConfirmed] =
    useState(false);

  const [orderId, setOrderId] =
    useState("");

  // =======================================================
  // CHECKOUT FORM
  // =======================================================

  const [checkoutForm, setCheckoutForm] =
    useState({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      paymentMethod: "Cash on Delivery",
    });

  const [checkoutError, setCheckoutError] =
    useState("");

  // =======================================================
  // SEARCH
  // =======================================================

  const handleSearch = async (
    searchQuery = query
  ) => {
    const trimmedQuery =
      searchQuery.trim();

    if (!trimmedQuery) {
      return;
    }

    setLoading(true);
    setError("");

    setSelectedProduct(null);

    try {
      const response = await fetch(
        "https://shoppilot-ai-k6dz.onrender.com/api/search", 
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            query: trimmedQuery,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Search failed"
        );
      }

      console.log(
        "AI Search Response:",
        data
      );

      const formattedProducts =
        (data.products || []).map(
          (product) => ({
            ...product,

            price: `₹${Number(
              product.price
            ).toLocaleString(
              "en-IN"
            )}`,

            rating: String(
              product.rating
            ),

            reason:
              product.recommendationReason ||
              product.reason ||
              product.description ||
              "Recommended based on your shopping requirements.",

            image:
              product.image ||
              getProductImage(
                product.category
              ),

            tag: `${product.match}% Match`,
          })
        );

      setSearchResults(
        formattedProducts
      );

      setShowResults(true);

      setTimeout(() => {
        document
          .getElementById(
            "recommendations"
          )
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 100);

    } catch (error) {
      console.error(
        "Search Error:",
        error
      );

      setError(
        "Unable to get recommendations right now. Please make sure the ShopPilot AI server is running."
      );

      setSearchResults([]);

    } finally {
      setLoading(false);
    }
  };

  // =======================================================
  // SUGGESTION
  // =======================================================

  const useSuggestion = (text) => {
    setQuery(text);

    handleSearch(text);
  };

  // =======================================================
  // PRODUCTS TO DISPLAY
  // =======================================================

  const displayedProducts =
    searchResults.length > 0
      ? searchResults
      : products;

  // =======================================================
  // OPEN PRODUCT
  // =======================================================

  const openProduct = (product) => {
    setSelectedProduct(product);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =======================================================
  // CLOSE PRODUCT
  // =======================================================

  const closeProduct = () => {
    setSelectedProduct(null);

    setTimeout(() => {
      document
        .getElementById(
          "recommendations"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  // =======================================================
  // ADD TO CART
  // =======================================================

  const addToCart = (product) => {
    setCart((previousCart) => {
      const existingProduct =
        previousCart.find(
          (item) =>
            item.id === product.id
        );

      if (existingProduct) {
        return previousCart.map(
          (item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity:
                    item.quantity + 1,
                }
              : item
        );
      }

      return [
        ...previousCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  // =======================================================
  // BUY NOW
  // =======================================================

  const buyNow = (product) => {
    addToCart(product);

    setSelectedProduct(null);

    setTimeout(() => {
      setIsCartOpen(true);
    }, 100);
  };

  // =======================================================
  // CART COUNT
  // =======================================================

  const cartCount =
    cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  // =======================================================
  // CART CONTROLS
  // =======================================================

  const increaseQuantity = (productId) => {
    setCart((previousCart) =>
      previousCart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  };

  const removeFromCart = (productId) => {
    setCart((previousCart) =>
      previousCart.filter(
        (item) =>
          item.id !== productId
      )
    );
  };

  // =======================================================
  // PRICE
  // =======================================================

  const getNumericPrice = (price) => {
    return (
      Number(
        String(price)
          .replace(/₹/g, "")
          .replace(/,/g, "")
      ) || 0
    );
  };

  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      getNumericPrice(
        item.price
      ) *
        item.quantity,
    0
  );

  // =======================================================
  // CHECKOUT FORM HANDLER
  // =======================================================

  const handleCheckoutChange = (e) => {
    const { name, value } =
      e.target;

    setCheckoutForm(
      (previousForm) => ({
        ...previousForm,
        [name]: value,
      })
    );

    setCheckoutError("");
  };

  // =======================================================
  // OPEN CHECKOUT
  // =======================================================

  const openCheckout = () => {
    if (cart.length === 0) {
      return;
    }

    setIsCartOpen(false);
    setSelectedProduct(null);
    setShowCheckout(true);
    setCheckoutError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =======================================================
  // BACK TO CART
  // =======================================================

  const backToCart = () => {
    setShowCheckout(false);
    setIsCartOpen(true);
  };

  // =======================================================
  // PLACE ORDER
  // =======================================================

  const placeOrder = async (e) => {
    e.preventDefault();

    if (
      !checkoutForm.fullName.trim() ||
      !checkoutForm.email.trim() ||
      !checkoutForm.phone.trim() ||
      !checkoutForm.address.trim() ||
      !checkoutForm.city.trim() ||
      !checkoutForm.state.trim() ||
      !checkoutForm.pincode.trim()
    ) {
      setCheckoutError(
        "Please fill in all required fields."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    if (!/^\d{6}$/.test(checkoutForm.pincode)) {
      setCheckoutError(
        "Please enter a valid 6-digit PIN code."
      );

      return;
    }

    try {
      setCheckoutError("");

      const orderItems = cart.map((item) => ({
        productId: String(item.id),
        name: item.name,
        price: getNumericPrice(item.price),
        quantity: Number(item.quantity),
        image:
          item.image ||
          getProductImage(item.category),
      }));

      const response = await fetch(
        "https://shoppilot-ai-k6dz.onrender.com/api/orders", 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer: {
              name: checkoutForm.fullName,
              email: checkoutForm.email,
              phone: checkoutForm.phone,
            },
            shippingAddress: {
              address: checkoutForm.address,
              city: checkoutForm.city,
              state: checkoutForm.state,
              pincode: checkoutForm.pincode,
            },
            items: orderItems,
            subtotal: cartTotal,
            totalAmount: cartTotal,
            paymentMethod: checkoutForm.paymentMethod,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to place your order."
        );
      }

      console.log(
        "Order saved successfully:",
        data
      );

      const generatedOrderId =
        data.order?._id ||
        "SP" +
          Date.now()
            .toString()
            .slice(-8);

      setOrderId(generatedOrderId);
      setOrderConfirmed(true);
      setCart([]);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(
        "Order placement error:",
        error
      );

      setCheckoutError(
        error.message ||
          "Something went wrong while placing your order. Please try again."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // =======================================================
  // CONTINUE SHOPPING
  // =======================================================

  const continueShopping = () => {
    setShowCheckout(false);
    setOrderConfirmed(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // CHECKOUT PAGE
  // =========================================================

  if (showCheckout) {
    return (
      <div className="app">

        {/* BACKGROUND */}

        <div className="orb orb-one"></div>
        <div className="orb orb-two"></div>

        {/* NAVBAR */}

        <nav className="navbar">

          <div
            className="brand"
            onClick={continueShopping}
            style={{
              cursor: "pointer",
            }}
          >
            <div className="brand-mark">
              <FiZap />
            </div>

            <span>
              ShopPilot
              <span className="brand-ai">
                AI
              </span>
            </span>
          </div>

          <div className="nav-links">

            <a
              href="#home"
              onClick={
                continueShopping
              }
            >
              Home
            </a>

            <a
              href="#how"
              onClick={
                continueShopping
              }
            >
              How it works
            </a>

            <a
              href="#recommendations"
              onClick={
                continueShopping
              }
            >
              Recommendations
            </a>

          </div>

          <button
            className="nav-cta"
            onClick={() =>
              setIsCartOpen(true)
            }
          >
            <FiShoppingBag />

            {cartCount > 0 && (
              <span
                style={{
                  marginLeft: "6px",
                }}
              >
                {cartCount}
              </span>
            )}
          </button>

        </nav>

        {/* =================================================
            ORDER CONFIRMATION
        ================================================= */}

        {orderConfirmed ? (

          <main
            style={{
              paddingTop: "130px",
            }}
          >

            <section
              style={{
                minHeight:
                  "70vh",
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                padding:
                  "40px 7%",
              }}
            >

              <div
                style={{
                  width:
                    "min(650px, 100%)",
                  background:
                    "rgba(255,255,255,0.82)",
                  backdropFilter:
                    "blur(20px)",
                  borderRadius:
                    "30px",
                  padding:
                    "50px",
                  textAlign:
                    "center",
                  boxShadow:
                    "0 25px 70px rgba(0,0,0,0.08)",
                }}
              >

                <div
                  style={{
                    width: "90px",
                    height: "90px",
                    margin:
                      "0 auto 25px",
                    borderRadius:
                      "50%",
                    background:
                      "#e9f8ee",
                    display:
                      "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                  }}
                >
                  <FiCheck
                    size={45}
                  />
                </div>

                <div
                  className="eyebrow"
                  style={{
                    marginBottom:
                      "12px",
                  }}
                >
                  ORDER CONFIRMED
                </div>

                <h1
                  style={{
                    fontSize:
                      "clamp(34px, 5vw, 58px)",
                    margin:
                      "0 0 15px",
                  }}
                >
                  Thank you
                  <br />
                  for your order!
                </h1>

                <p
                  style={{
                    fontSize:
                      "17px",
                    lineHeight:
                      "1.7",
                    opacity: 0.7,
                    maxWidth:
                      "500px",
                    margin:
                      "0 auto 25px",
                  }}
                >
                  Your order has been
                  successfully placed.
                  We’ll use the contact
                  information you provided
                  for order updates.
                </p>

                <div
                  style={{
                    background:
                      "#f7f7f7",
                    borderRadius:
                      "16px",
                    padding:
                      "18px",
                    marginBottom:
                      "30px",
                  }}
                >
                  <span
                    style={{
                      display:
                        "block",
                      fontSize:
                        "13px",
                      opacity: 0.6,
                      marginBottom:
                        "5px",
                    }}
                  >
                    ORDER ID
                  </span>

                  <strong
                    style={{
                      fontSize:
                        "20px",
                    }}
                  >
                    {orderId}
                  </strong>
                </div>

                <div
                  style={{
                    display:
                      "flex",
                    gap: "12px",
                    justifyContent:
                      "center",
                    flexWrap:
                      "wrap",
                  }}
                >

                  <button
                    className="cta-button"
                    onClick={
                      continueShopping
                    }
                  >
                    Continue Shopping
                    <FiArrowRight />
                  </button>

                </div>

              </div>

            </section>

          </main>

        ) : (

          /* =================================================
              CHECKOUT
          ================================================= */

          <main
            style={{
              paddingTop: "120px",
            }}
          >

            <section
              style={{
                padding:
                  "40px 7% 80px",
                maxWidth:
                  "1400px",
                margin: "0 auto",
              }}
            >

              {/* CHECKOUT HEADER */}

              <div
                style={{
                  marginBottom:
                    "40px",
                }}
              >

                <button
                  onClick={
                    backToCart
                  }
                  style={{
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap: "8px",
                    border:
                      "none",
                    background:
                      "transparent",
                    cursor:
                      "pointer",
                    marginBottom:
                      "20px",
                    fontSize:
                      "15px",
                  }}
                >
                  <FiArrowRight
                    style={{
                      transform:
                        "rotate(180deg)",
                    }}
                  />

                  Back to cart
                </button>

                <div className="eyebrow">
                  SECURE CHECKOUT
                </div>

                <h1
                  style={{
                    fontSize:
                      "clamp(38px, 6vw, 68px)",
                    margin:
                      "10px 0 10px",
                  }}
                >
                  Complete your
                  <br />
                  <span>
                    order.
                  </span>
                </h1>

                <p
                  style={{
                    opacity: 0.65,
                    fontSize:
                      "17px",
                  }}
                >
                  Enter your details
                  and choose your
                  preferred payment
                  method.
                </p>

              </div>

              {/* ERROR */}

              {checkoutError && (
                <div
                  style={{
                    padding:
                      "15px 18px",
                    marginBottom:
                      "25px",
                    borderRadius:
                      "12px",
                    background:
                      "#fff0f0",
                    color:
                      "#c62828",
                    fontSize:
                      "14px",
                  }}
                >
                  {checkoutError}
                </div>
              )}

              <form
                onSubmit={
                  placeOrder
                }
              >

             <div
  className="product-detail-grid"
  style={{
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
    gap: "60px",
    alignItems: "center",
    width: "100%",
    minWidth: 0,
  }}
>

                

                  {/* =================================================
                      LEFT SIDE
                  ================================================= */}

                  <div
                    style={{
                      display:
                        "flex",
                      flexDirection:
                        "column",
                      gap: "22px",
                    }}
                  >

                    {/* CONTACT */}

                    <div
                      style={{
                        background:
                          "rgba(255,255,255,0.8)",
                        borderRadius:
                          "24px",
                        padding:
                          "30px",
                        boxShadow:
                          "0 15px 45px rgba(0,0,0,0.05)",
                      }}
                    >

                      <div
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: "12px",
                          marginBottom:
                            "25px",
                        }}
                      >

                        <div
                          style={{
                            width:
                              "42px",
                            height:
                              "42px",
                            borderRadius:
                              "12px",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            background:
                              "#f1f1f1",
                          }}
                        >
                          <FiUser />
                        </div>

                        <div>
                          <h2
                            style={{
                              margin:
                                0,
                              fontSize:
                                "22px",
                            }}
                          >
                            Contact
                            information
                          </h2>

                          <span
                            style={{
                              fontSize:
                                "13px",
                              opacity:
                                0.6,
                            }}
                          >
                            How can we
                            reach you?
                          </span>
                        </div>

                      </div>

                      <div
                        style={{
                          display:
                            "grid",
                          gridTemplateColumns:
                            "1fr 1fr",
                          gap: "16px",
                        }}
                      >

                        {/* NAME */}

                        <div
                          style={{
                            gridColumn:
                              "1 / -1",
                          }}
                        >

                          <label
                            style={{
                              display:
                                "block",
                              fontSize:
                                "13px",
                              fontWeight:
                                "600",
                              marginBottom:
                                "7px",
                            }}
                          >
                            Full Name *
                          </label>

                          <div
                            style={{
                              position:
                                "relative",
                            }}
                          >

                            <FiUser
                              style={{
                                position:
                                  "absolute",
                                left:
                                  "14px",
                                top:
                                  "50%",
                                transform:
                                  "translateY(-50%)",
                                opacity:
                                  0.5,
                              }}
                            />

                            <input
                              type="text"
                              name="fullName"
                              value={
                                checkoutForm.fullName
                              }
                              onChange={
                                handleCheckoutChange
                              }
                              placeholder="Enter your full name"
                              style={{
                                width:
                                  "100%",
                                boxSizing:
                                  "border-box",
                                padding:
                                  "14px 14px 14px 42px",
                                border:
                                  "1px solid #ddd",
                                borderRadius:
                                  "12px",
                                outline:
                                  "none",
                                fontSize:
                                  "14px",
                              }}
                            />

                          </div>

                        </div>

                        {/* EMAIL */}

                        <div>

                          <label
                            style={{
                              display:
                                "block",
                              fontSize:
                                "13px",
                              fontWeight:
                                "600",
                              marginBottom:
                                "7px",
                            }}
                          >
                            Email *
                          </label>

                          <div
                            style={{
                              position:
                                "relative",
                            }}
                          >

                            <FiMail
                              style={{
                                position:
                                  "absolute",
                                left:
                                  "14px",
                                top:
                                  "50%",
                                transform:
                                  "translateY(-50%)",
                                opacity:
                                  0.5,
                              }}
                            />

                            <input
                              type="email"
                              name="email"
                              value={
                                checkoutForm.email
                              }
                              onChange={
                                handleCheckoutChange
                              }
                              placeholder="you@example.com"
                              style={{
                                width:
                                  "100%",
                                boxSizing:
                                  "border-box",
                                padding:
                                  "14px 14px 14px 42px",
                                border:
                                  "1px solid #ddd",
                                borderRadius:
                                  "12px",
                                outline:
                                  "none",
                                fontSize:
                                  "14px",
                              }}
                            />

                          </div>

                        </div>

                        {/* PHONE */}

                        <div>

                          <label
                            style={{
                              display:
                                "block",
                              fontSize:
                                "13px",
                              fontWeight:
                                "600",
                              marginBottom:
                                "7px",
                            }}
                          >
                            Phone *
                          </label>

                          <div
                            style={{
                              position:
                                "relative",
                            }}
                          >

                            <FiPhone
                              style={{
                                position:
                                  "absolute",
                                left:
                                  "14px",
                                top:
                                  "50%",
                                transform:
                                  "translateY(-50%)",
                                opacity:
                                  0.5,
                              }}
                            />

                            <input
                              type="tel"
                              name="phone"
                              value={
                                checkoutForm.phone
                              }
                              onChange={
                                handleCheckoutChange
                              }
                              placeholder="10-digit mobile number"
                              style={{
                                width:
                                  "100%",
                                boxSizing:
                                  "border-box",
                                padding:
                                  "14px 14px 14px 42px",
                                border:
                                  "1px solid #ddd",
                                borderRadius:
                                  "12px",
                                outline:
                                  "none",
                                fontSize:
                                  "14px",
                              }}
                            />

                          </div>

                        </div>

                      </div>

                    </div>

                    {/* =================================================
                        ADDRESS
                    ================================================= */}

                    <div
                      style={{
                        background:
                          "rgba(255,255,255,0.8)",
                        borderRadius:
                          "24px",
                        padding:
                          "30px",
                        boxShadow:
                          "0 15px 45px rgba(0,0,0,0.05)",
                      }}
                    >

                      <div
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: "12px",
                          marginBottom:
                            "25px",
                        }}
                      >

                        <div
                          style={{
                            width:
                              "42px",
                            height:
                              "42px",
                            borderRadius:
                              "12px",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            background:
                              "#f1f1f1",
                          }}
                        >
                          <FiMapPin />
                        </div>

                        <div>
                          <h2
                            style={{
                              margin:
                                0,
                              fontSize:
                                "22px",
                            }}
                          >
                            Delivery
                            address
                          </h2>

                          <span
                            style={{
                              fontSize:
                                "13px",
                              opacity:
                                0.6,
                            }}
                          >
                            Where should we
                            deliver your
                            order?
                          </span>
                        </div>

                      </div>

                      <div
                        style={{
                          display:
                            "grid",
                          gridTemplateColumns:
                            "1fr 1fr",
                          gap: "16px",
                        }}
                      >

                        {/* ADDRESS */}

                        <div
                          style={{
                            gridColumn:
                              "1 / -1",
                          }}
                        >

                          <label
                            style={{
                              display:
                                "block",
                              fontSize:
                                "13px",
                              fontWeight:
                                "600",
                              marginBottom:
                                "7px",
                            }}
                          >
                            Address *
                          </label>

                          <textarea
                            name="address"
                            value={
                              checkoutForm.address
                            }
                            onChange={
                              handleCheckoutChange
                            }
                            placeholder="House no., street, area"
                            rows="3"
                            style={{
                              width:
                                "100%",
                              boxSizing:
                                "border-box",
                              padding:
                                "14px",
                              border:
                                "1px solid #ddd",
                              borderRadius:
                                "12px",
                              outline:
                                "none",
                              resize:
                                "vertical",
                              fontSize:
                                "14px",
                              fontFamily:
                                "inherit",
                            }}
                          />

                        </div>

                        {/* CITY */}

                        <div>

                          <label
                            style={{
                              display:
                                "block",
                              fontSize:
                                "13px",
                              fontWeight:
                                "600",
                              marginBottom:
                                "7px",
                            }}
                          >
                            City *
                          </label>

                          <input
                            type="text"
                            name="city"
                            value={
                              checkoutForm.city
                            }
                            onChange={
                              handleCheckoutChange
                            }
                            placeholder="City"
                            style={{
                              width:
                                "100%",
                              boxSizing:
                                "border-box",
                              padding:
                                "14px",
                              border:
                                "1px solid #ddd",
                              borderRadius:
                                "12px",
                              outline:
                                "none",
                              fontSize:
                                "14px",
                            }}
                          />

                        </div>

                        {/* STATE */}

                        <div>

                          <label
                            style={{
                              display:
                                "block",
                              fontSize:
                                "13px",
                              fontWeight:
                                "600",
                              marginBottom:
                                "7px",
                            }}
                          >
                            State *
                          </label>

                          <input
                            type="text"
                            name="state"
                            value={
                              checkoutForm.state
                            }
                            onChange={
                              handleCheckoutChange
                            }
                            placeholder="State"
                            style={{
                              width:
                                "100%",
                              boxSizing:
                                "border-box",
                              padding:
                                "14px",
                              border:
                                "1px solid #ddd",
                              borderRadius:
                                "12px",
                              outline:
                                "none",
                              fontSize:
                                "14px",
                            }}
                          />

                        </div>

                        {/* PIN */}

                        <div>

                          <label
                            style={{
                              display:
                                "block",
                              fontSize:
                                "13px",
                              fontWeight:
                                "600",
                              marginBottom:
                                "7px",
                            }}
                          >
                            PIN Code *
                          </label>

                          <input
                            type="text"
                            name="pincode"
                            value={
                              checkoutForm.pincode
                            }
                            onChange={
                              handleCheckoutChange
                            }
                            placeholder="6-digit PIN"
                            maxLength="6"
                            style={{
                              width:
                                "100%",
                              boxSizing:
                                "border-box",
                              padding:
                                "14px",
                              border:
                                "1px solid #ddd",
                              borderRadius:
                                "12px",
                              outline:
                                "none",
                              fontSize:
                                "14px",
                            }}
                          />

                        </div>

                      </div>

                    </div>

                    {/* =================================================
                        PAYMENT
                    ================================================= */}

                    <div
                      style={{
                        background:
                          "rgba(255,255,255,0.8)",
                        borderRadius:
                          "24px",
                        padding:
                          "30px",
                        boxShadow:
                          "0 15px 45px rgba(0,0,0,0.05)",
                      }}
                    >

                      <div
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: "12px",
                          marginBottom:
                            "25px",
                        }}
                      >

                        <div
                          style={{
                            width:
                              "42px",
                            height:
                              "42px",
                            borderRadius:
                              "12px",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            background:
                              "#f1f1f1",
                          }}
                        >
                          <FiCreditCard />
                        </div>

                        <div>
                          <h2
                            style={{
                              margin:
                                0,
                              fontSize:
                                "22px",
                            }}
                          >
                            Payment
                            method
                          </h2>

                          <span
                            style={{
                              fontSize:
                                "13px",
                              opacity:
                                0.6,
                            }}
                          >
                            Choose how you
                            want to pay
                          </span>
                        </div>

                      </div>

                      <div
                        style={{
                          display:
                            "grid",
                          gap: "12px",
                        }}
                      >

                        {[
                          {
                            value:
                              "Cash on Delivery",
                            icon:
                              <FiTruck />,
                            description:
                              "Pay when your order arrives.",
                          },
                          {
                            value:
                              "UPI",
                            icon:
                              <FiCreditCard />,
                            description:
                              "Pay securely using UPI.",
                          },
                          {
                            value:
                              "Credit / Debit Card",
                            icon:
                              <FiCreditCard />,
                            description:
                              "Pay using your card.",
                          },
                        ].map(
                          (
                            method
                          ) => (

                            <label
                              key={
                                method.value
                              }
                              style={{
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                gap: "14px",
                                padding:
                                  "16px",
                                border:
                                  checkoutForm.paymentMethod ===
                                  method.value
                                    ? "2px solid #111"
                                    : "1px solid #ddd",
                                borderRadius:
                                  "14px",
                                cursor:
                                  "pointer",
                                background:
                                  checkoutForm.paymentMethod ===
                                  method.value
                                    ? "#fafafa"
                                    : "#fff",
                              }}
                            >

                              <input
                                type="radio"
                                name="paymentMethod"
                                value={
                                  method.value
                                }
                                checked={
                                  checkoutForm.paymentMethod ===
                                  method.value
                                }
                                onChange={
                                  handleCheckoutChange
                                }
                              />

                              <span
                                style={{
                                  display:
                                    "flex",
                                  alignItems:
                                    "center",
                                  justifyContent:
                                    "center",
                                  width:
                                    "35px",
                                  height:
                                    "35px",
                                  borderRadius:
                                    "10px",
                                  background:
                                    "#f2f2f2",
                                }}
                              >
                                {
                                  method.icon
                                }
                              </span>

                              <span>

                                <strong
                                  style={{
                                    display:
                                      "block",
                                    marginBottom:
                                      "3px",
                                  }}
                                >
                                  {
                                    method.value
                                  }
                                </strong>

                                <small
                                  style={{
                                    opacity:
                                      0.6,
                                  }}
                                >
                                  {
                                    method.description
                                  }
                                </small>

                              </span>

                            </label>

                          )
                        )}

                      </div>

                    </div>

                  </div>

                  {/* =================================================
                      RIGHT SIDE — ORDER SUMMARY
                  ================================================= */}

                  <div
                    style={{
                      position:
                        "sticky",
                      top: "110px",
                      background:
                        "rgba(255,255,255,0.88)",
                      borderRadius:
                        "24px",
                      padding:
                        "28px",
                      boxShadow:
                        "0 15px 45px rgba(0,0,0,0.06)",
                    }}
                  >

                    <div
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "space-between",
                        marginBottom:
                          "25px",
                      }}
                    >

                      <h2
                        style={{
                          margin: 0,
                          fontSize:
                            "22px",
                        }}
                      >
                        Order summary
                      </h2>

                      <span
                        style={{
                          fontSize:
                            "13px",
                          opacity:
                            0.6,
                        }}
                      >
                        {cartCount}{" "}
                        {cartCount ===
                        1
                          ? "item"
                          : "items"}
                      </span>

                    </div>

                    {/* PRODUCTS */}

                    <div
                      style={{
                        display:
                          "flex",
                        flexDirection:
                          "column",
                        gap: "16px",
                        marginBottom:
                          "25px",
                      }}
                    >

                      {cart.map(
                        (item) => (

                          <div
                            key={
                              item.id
                            }
                            style={{
                              display:
                                "flex",
                              gap: "12px",
                            }}
                          >

                            <img
                              src={
                                item.image ||
                                getProductImage(
                                  item.category
                                )
                              }
                              alt={
                                item.name
                              }
                              style={{
                                width:
                                  "65px",
                                height:
                                  "65px",
                                objectFit:
                                  "cover",
                                borderRadius:
                                  "12px",
                                flexShrink:
                                  0,
                              }}
                            />

                            <div
                              style={{
                                flex:
                                  1,
                                minWidth:
                                  0,
                              }}
                            >

                              <strong
                                style={{
                                  display:
                                    "block",
                                  fontSize:
                                    "14px",
                                  marginBottom:
                                    "3px",
                                }}
                              >
                                {
                                  item.name
                                }
                              </strong>

                              <span
                                style={{
                                  fontSize:
                                    "12px",
                                  opacity:
                                    0.55,
                                }}
                              >
                                Qty:{" "}
                                {
                                  item.quantity
                                }
                              </span>

                              <strong
                                style={{
                                  display:
                                    "block",
                                  marginTop:
                                    "5px",
                                  fontSize:
                                    "14px",
                                }}
                              >
                                {
                                  item.price
                                }
                              </strong>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                    <div
                      style={{
                        borderTop:
                          "1px solid #eee",
                        paddingTop:
                          "20px",
                      }}
                    >

                      {/* SUBTOTAL */}

                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          marginBottom:
                            "12px",
                        }}
                      >

                        <span>
                          Subtotal
                        </span>

                        <strong>
                          ₹
                          {cartTotal.toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </div>

                      {/* DELIVERY */}

                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          marginBottom:
                            "18px",
                        }}
                      >

                        <span
                          style={{
                            opacity:
                              0.65,
                          }}
                        >
                          Delivery
                        </span>

                        <span
                          style={{
                            fontSize:
                              "13px",
                            opacity:
                              0.65,
                          }}
                        >
                          Calculated
                        </span>

                      </div>

                      {/* TOTAL */}

                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "center",
                          borderTop:
                            "1px solid #eee",
                          paddingTop:
                            "18px",
                          marginBottom:
                            "22px",
                        }}
                      >

                        <strong
                          style={{
                            fontSize:
                              "18px",
                          }}
                        >
                          Total
                        </strong>

                        <strong
                          style={{
                            fontSize:
                              "24px",
                          }}
                        >
                          ₹
                          {cartTotal.toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </div>

                      {/* PLACE ORDER */}

                      <button
                        type="submit"
                        className="cta-button"
                        style={{
                          width:
                            "100%",
                          justifyContent:
                            "center",
                          fontSize:
                            "16px",
                          padding:
                            "16px",
                        }}
                      >
                        Place Order

                        <FiArrowRight />
                      </button>

                      {/* SECURITY */}

                      <div
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          gap: "7px",
                          marginTop:
                            "16px",
                          fontSize:
                            "12px",
                          opacity:
                            0.55,
                        }}
                      >
                        <FiShield />

                        Secure checkout
                      </div>

                    </div>

                  </div>

                </div>

              </form>

            </section>

          </main>

        )}

        {/* FOOTER */}

        <footer>

          <div className="brand">

            <div className="brand-mark">
              <FiZap />
            </div>

            <span>
              ShopPilot
              <span className="brand-ai">
                AI
              </span>
            </span>

          </div>

          <p>
            Intelligent commerce,
            powered by AI.
          </p>

          <span className="footer-copy">
            © 2026 ShopPilot AI
          </span>

        </footer>

      </div>
    );
  }

  // =========================================================
  // PRODUCT DETAILS VIEW
  // =========================================================

  if (selectedProduct) {
    return (
      <div className="app">

        <div className="orb orb-one"></div>
        <div className="orb orb-two"></div>

        {/* NAVBAR */}

        <nav className="navbar">

          <div
            className="brand"
            onClick={closeProduct}
            style={{
              cursor: "pointer",
            }}
          >
            <div className="brand-mark">
              <FiZap />
            </div>

            <span>
              ShopPilot
              <span className="brand-ai">
                AI
              </span>
            </span>
          </div>

          <div className="nav-links">

            <a
              href="#home"
              onClick={
                closeProduct
              }
            >
              Home
            </a>

            <a
              href="#how"
              onClick={
                closeProduct
              }
            >
              How it works
            </a>

            <a
              href="#recommendations"
              onClick={
                closeProduct
              }
            >
              Recommendations
            </a>

          </div>

          {/* CART */}

          <button
            className="nav-cta"
            onClick={() =>
              setIsCartOpen(true)
            }
          >
            <FiShoppingBag />

            {cartCount > 0 && (
              <span
                style={{
                  marginLeft: "6px",
                }}
              >
                {cartCount}
              </span>
            )}
          </button>

        </nav>

        {/* PRODUCT DETAILS */}

        <main
          style={{
            paddingTop:
              "120px",
          }}
        >

          <section
            className="product-details"
            style={{
              minHeight:
                "75vh",
              padding:
                "40px 7%",
            }}
          >

            {/* BACK BUTTON */}

            <button
              onClick={
                closeProduct
              }
              style={{
                display:
                  "flex",
                alignItems:
                  "center",
                gap: "8px",
                background:
                  "transparent",
                border: "none",
                cursor:
                  "pointer",
                marginBottom:
                  "30px",
                fontSize:
                  "15px",
              }}
            >
              <FiArrowRight
                style={{
                  transform:
                    "rotate(180deg)",
                }}
              />

              Back to
              recommendations
            </button>

            {/* PRODUCT */}

            <div
              className="product-detail-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                gap: "60px",
                alignItems: "center",
                width: "100%",
                minWidth: 0,
              }}
            >

              {/* IMAGE */}

              <div
                style={{
                  position:
                    "relative",
                  borderRadius:
                    "24px",
                  overflow:
                    "hidden",
                  minHeight:
                    "450px",
                  display:
                    "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  background:
                    "rgba(255,255,255,0.6)",
                }}
              >

                <img
                  src={
                    selectedProduct.image ||
                    getProductImage(
                      selectedProduct.category
                    )
                  }
                  alt={
                    selectedProduct.name
                  }
                  style={{
                    width:
                      "100%",
                    height:
                      "450px",
                    objectFit:
                      "cover",
                  }}
                />

                <div
                  style={{
                    position:
                      "absolute",
                    top: "20px",
                    left: "20px",
                    padding:
                      "10px 16px",
                    borderRadius:
                      "999px",
                    background:
                      "rgba(255,255,255,0.9)",
                    fontWeight:
                      "700",
                  }}
                >
                  <FiZap
                    style={{
                      marginRight:
                        "6px",
                      verticalAlign:
                        "middle",
                    }}
                  />

                  {selectedProduct.match ||
                    selectedProduct.tag}
                </div>

              </div>

              {/* INFORMATION */}

              <div>

                <div
                  className="eyebrow"
                  style={{
                    marginBottom:
                      "12px",
                  }}
                >
                  {
                    selectedProduct.category
                  }
                </div>

                <h1
                  style={{
                    fontSize:
                      "clamp(36px, 5vw, 64px)",
                    margin:
                      "0 0 20px",
                  }}
                >
                  {
                    selectedProduct.name
                  }
                </h1>

                <div
                  style={{
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap: "8px",
                    marginBottom:
                      "20px",
                  }}
                >
                  <FiStar />

                  <strong>
                    {
                      selectedProduct.rating
                    }
                  </strong>

                  <span>
                    / 5
                  </span>
                </div>

                <div
                  style={{
                    fontSize:
                      "32px",
                    fontWeight:
                      "800",
                    marginBottom:
                      "20px",
                  }}
                >
                  {
                    selectedProduct.price
                  }
                </div>

                <div
                  style={{
                    padding:
                      "20px",
                    borderRadius:
                      "18px",
                    background:
                      "rgba(255,255,255,0.7)",
                    marginBottom:
                      "20px",
                  }}
                >

                  <div
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: "8px",
                      fontWeight:
                        "700",
                      marginBottom:
                        "8px",
                    }}
                  >
                    <FiZap />

                    Why ShopPilot
                    recommends it
                  </div>

                  <p
                    style={{
                      margin:
                        0,
                    }}
                  >
                    {
                      selectedProduct.reason ||
                      selectedProduct.recommendationReason ||
                      "This product matches your shopping requirements."
                    }
                  </p>

                </div>

                <p
                  style={{
                    fontSize:
                      "17px",
                    lineHeight:
                      "1.7",
                    marginBottom:
                      "30px",
                  }}
                >
                  {
                    selectedProduct.description ||
                    selectedProduct.reason ||
                    "A product selected by ShopPilot based on your requirements."
                  }
                </p>

                {/* ACTION BUTTONS */}

                <div
                  style={{
                    display:
                      "flex",
                    gap: "14px",
                    flexWrap:
                      "wrap",
                  }}
                >

                  <button
                    className="cta-button"
                    onClick={() =>
                      addToCart(
                        selectedProduct
                      )
                    }
                  >
                    <FiShoppingBag />

                    Add to Cart
                  </button>

                  <button
                    className="nav-cta"
                    onClick={() =>
                      buyNow(
                        selectedProduct
                      )
                    }
                  >
                    Buy Now

                    <FiArrowRight />
                  </button>

                </div>

                {cart.some(
                  (item) =>
                    item.id ===
                    selectedProduct.id
                ) && (
                  <div
                    style={{
                      marginTop:
                        "18px",
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: "8px",
                    }}
                  >
                    <FiCheck />

                    Added to your cart
                  </div>
                )}

              </div>

            </div>

          </section>

        </main>

        {/* FOOTER */}

        <footer>

          <div className="brand">

            <div className="brand-mark">
              <FiZap />
            </div>

            <span>
              ShopPilot
              <span className="brand-ai">
                AI
              </span>
            </span>

          </div>

          <p>
            Intelligent commerce,
            powered by AI.
          </p>

          <span className="footer-copy">
            © 2026 ShopPilot AI
          </span>

        </footer>

      </div>
    );
  }

  // =========================================================
  // MAIN APPLICATION
  // =========================================================

  return (
    <div className="app">

      {/* ===================================================
          CART DRAWER
      =================================================== */}

      {isCartOpen && (
        <>

          {/* BACKDROP */}

          <div
            onClick={() =>
              setIsCartOpen(false)
            }
            style={{
              position:
                "fixed",
              inset: 0,
              background:
                "rgba(0, 0, 0, 0.35)",
              backdropFilter:
                "blur(4px)",
              zIndex: 9998,
            }}
          />

          {/* CART PANEL */}

          <aside
            style={{
              position:
                "fixed",
              top: 0,
              right: 0,
              width:
                "min(420px, 92vw)",
              height:
                "100vh",
              background:
                "#ffffff",
              zIndex: 9999,
              boxShadow:
                "-10px 0 40px rgba(0,0,0,0.15)",
              display:
                "flex",
              flexDirection:
                "column",
            }}
          >

            {/* CART HEADER */}

            <div
              style={{
                padding:
                  "24px",
                display:
                  "flex",
                alignItems:
                  "center",
                justifyContent:
                  "space-between",
                borderBottom:
                  "1px solid #eeeeee",
              }}
            >

              <div>

                <h2
                  style={{
                    margin:
                      0,
                    fontSize:
                      "24px",
                  }}
                >
                  Your Cart
                </h2>

                <span
                  style={{
                    fontSize:
                      "14px",
                    opacity:
                      0.65,
                  }}
                >
                  {cartCount}{" "}
                  {cartCount ===
                  1
                    ? "item"
                    : "items"}
                </span>

              </div>

              <button
                onClick={() =>
                  setIsCartOpen(
                    false
                  )
                }
                style={{
                  width:
                    "40px",
                  height:
                    "40px",
                  borderRadius:
                    "50%",
                  border:
                    "none",
                  background:
                    "#f4f4f4",
                  cursor:
                    "pointer",
                  display:
                    "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  fontSize:
                    "20px",
                }}
              >
                <FiX />
              </button>

            </div>

            {/* CART CONTENT */}

            <div
              style={{
                flex: 1,
                overflowY:
                  "auto",
                padding:
                  "20px",
              }}
            >

              {cart.length ===
              0 ? (

                /* EMPTY CART */

                <div
                  style={{
                    height:
                      "100%",
                    display:
                      "flex",
                    flexDirection:
                      "column",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    textAlign:
                      "center",
                    padding:
                      "30px",
                  }}
                >

                  <div
                    style={{
                      width:
                        "80px",
                      height:
                        "80px",
                      borderRadius:
                        "50%",
                      background:
                        "#f5f5f5",
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      marginBottom:
                        "20px",
                    }}
                  >
                    <FiShoppingBag
                      size={
                        32
                      }
                    />
                  </div>

                  <h3>
                    Your cart is
                    empty
                  </h3>

                  <p
                    style={{
                      opacity:
                        0.65,
                      lineHeight:
                        1.6,
                    }}
                  >
                    Find something
                    you love and
                    add it to your
                    cart.
                  </p>

                  <button
                    className="cta-button"
                    onClick={() =>
                      setIsCartOpen(
                        false
                      )
                    }
                  >
                    Start shopping

                    <FiArrowRight />
                  </button>

                </div>

              ) : (

                /* CART PRODUCTS */

                <div
                  style={{
                    display:
                      "flex",
                    flexDirection:
                      "column",
                    gap:
                      "18px",
                  }}
                >

                  {cart.map(
                    (item) => (

                      <div
                        key={
                          item.id
                        }
                        style={{
                          display:
                            "flex",
                          gap:
                            "14px",
                          paddingBottom:
                            "18px",
                          borderBottom:
                            "1px solid #eeeeee",
                        }}
                      >

                        <img
                          src={
                            item.image ||
                            getProductImage(
                              item.category
                            )
                          }
                          alt={
                            item.name
                          }
                          style={{
                            width:
                              "85px",
                            height:
                              "85px",
                            objectFit:
                              "cover",
                            borderRadius:
                              "14px",
                            flexShrink:
                              0,
                          }}
                        />

                        <div
                          style={{
                            flex:
                              1,
                            minWidth:
                              0,
                          }}
                        >

                          <h3
                            style={{
                              margin:
                                "0 0 5px",
                              fontSize:
                                "16px",
                            }}
                          >
                            {
                              item.name
                            }
                          </h3>

                          <span
                            style={{
                              fontSize:
                                "13px",
                              opacity:
                                0.6,
                            }}
                          >
                            {
                              item.category
                            }
                          </span>

                          <div
                            style={{
                              fontWeight:
                                "800",
                              marginTop:
                                "8px",
                            }}
                          >
                            {
                              item.price
                            }
                          </div>

                          {/* QUANTITY */}

                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap:
                                "10px",
                              marginTop:
                                "10px",
                            }}
                          >

                            <button
                              onClick={() =>
                                decreaseQuantity(
                                  item.id
                                )
                              }
                              style={{
                                width:
                                  "28px",
                                height:
                                  "28px",
                                borderRadius:
                                  "7px",
                                border:
                                  "1px solid #ddd",
                                background:
                                  "#fff",
                                cursor:
                                  "pointer",
                              }}
                            >
                              −
                            </button>

                            <strong>
                              {
                                item.quantity
                              }
                            </strong>

                            <button
                              onClick={() =>
                                increaseQuantity(
                                  item.id
                                )
                              }
                              style={{
                                width:
                                  "28px",
                                height:
                                  "28px",
                                borderRadius:
                                  "7px",
                                border:
                                  "1px solid #ddd",
                                background:
                                  "#fff",
                                cursor:
                                  "pointer",
                              }}
                            >
                              +
                            </button>

                            <button
                              onClick={() =>
                                removeFromCart(
                                  item.id
                                )
                              }
                              style={{
                                marginLeft:
                                  "auto",
                                border:
                                  "none",
                                background:
                                  "transparent",
                                cursor:
                                  "pointer",
                                opacity:
                                  0.6,
                              }}
                              title="Remove item"
                            >
                              <FiX />
                            </button>

                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

            {/* CART FOOTER */}

            {cart.length >
              0 && (
              <div
                style={{
                  padding:
                    "22px",
                  borderTop:
                    "1px solid #eeeeee",
                  background:
                    "#ffffff",
                }}
              >

                <div
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    marginBottom:
                      "8px",
                  }}
                >

                  <span>
                    Subtotal
                  </span>

                  <strong>
                    ₹
                    {cartTotal.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

                <div
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    marginBottom:
                      "18px",
                    fontSize:
                      "13px",
                    opacity:
                      0.6,
                  }}
                >

                  <span>
                    Delivery
                  </span>

                  <span>
                    Calculated at
                    checkout
                  </span>

                </div>

                <button
                  className="cta-button"
                  style={{
                    width:
                      "100%",
                    justifyContent:
                      "center",
                  }}
                  onClick={
                    openCheckout
                  }
                >
                  Proceed to
                  Checkout

                  <FiArrowRight />
                </button>

              </div>
            )}

          </aside>

        </>
      )}

      {/* ===================================================
          BACKGROUND
      =================================================== */}

      <div className="orb orb-one"></div>
      <div className="orb orb-two"></div>

      {/* ===================================================
          NAVBAR
      =================================================== */}

      <nav className="navbar">

        <div className="brand">

          <div className="brand-mark">
            <FiZap />
          </div>

          <span>
            ShopPilot
            <span className="brand-ai">
              AI
            </span>
          </span>

        </div>

        <div className="nav-links">

          <a href="#home">
            Home
          </a>

          <a href="#how">
            How it works
          </a>

          <a href="#recommendations">
            Recommendations
          </a>

        </div>

        {/* NAV CART */}

        <button
          className="nav-cta"
          onClick={() =>
            setIsCartOpen(true)
          }
        >
          <FiShoppingBag />

          {cartCount > 0 && (
            <span
              style={{
                marginLeft:
                  "6px",
              }}
            >
              {cartCount}
            </span>
          )}

        </button>

      </nav>

      {/* ===================================================
          HERO
      =================================================== */}

      <main id="home">

        <section className="hero">

          <div className="hero-content">

            <div className="eyebrow">

              <span className="live-dot"></span>

              AI-POWERED COMMERCE

            </div>

            <h1>
              Shopping,
              <br />

              <span>
                reimagined.
              </span>
            </h1>

            <p className="hero-description">
              Tell ShopPilot what
              you're looking for.
              Our AI understands
              your needs, finds the
              right products and
              helps you make the
              smartest decision.
            </p>

            {/* SEARCH */}

            <div className="ai-search-wrapper">

              <div className="search-icon">
                <FiMessageCircle />
              </div>

              <input
                type="text"
                value={
                  query
                }
                onChange={(
                  e
                ) =>
                  setQuery(
                    e.target.value
                  )
                }
                onKeyDown={(
                  e
                ) => {
                  if (
                    e.key ===
                    "Enter"
                  ) {
                    handleSearch();
                  }
                }}
                placeholder="Ask anything... e.g. laptop for coding under ₹70,000"
                disabled={
                  loading
                }
              />

              <button
                className="search-button"
                onClick={() =>
                  handleSearch()
                }
                disabled={
                  loading
                }
                aria-label="Search"
              >
                {loading
                  ? "..."
                  : (
                    <FiArrowRight />
                  )}
              </button>

            </div>

            {/* ERROR */}

            {error && (
              <p
                style={{
                  marginTop:
                    "12px",
                  color:
                    "#d93025",
                  fontSize:
                    "14px",
                }}
              >
                {error}
              </p>
            )}

            {/* SUGGESTIONS */}

            <div className="suggestions">

              <span>
                Try asking:
              </span>

              <button
                onClick={() =>
                  useSuggestion(
                    "Laptop for coding"
                  )
                }
                disabled={
                  loading
                }
              >
                Laptop for coding
              </button>

              <button
                onClick={() =>
                  useSuggestion(
                    "Phone under ₹30K"
                  )
                }
                disabled={
                  loading
                }
              >
                Phone under ₹30K
              </button>

              <button
                onClick={() =>
                  useSuggestion(
                    "Best headphones"
                  )
                }
                disabled={
                  loading
                }
              >
                Best headphones
              </button>

            </div>

          </div>

          {/* HERO PRODUCT */}

          <div className="hero-visual">

            <div className="floating-card card-small card-top">

              <FiStar />

              <div>
                <strong>
                  4.9
                </strong>

                <span>
                  AI Rating
                </span>
              </div>

            </div>

            <div className="product-platform">

              <div className="platform-glow"></div>

              <div className="product-image-wrapper">

                <img
                  src={
                    products[0]
                      .image
                  }
                  alt="MacBook"
                  className="hero-product"
                />

                <div className="ai-badge">

                  <FiZap />

                  AI Pick

                </div>

              </div>

              <div className="platform-info">

                <div>

                  <span>
                    RECOMMENDED
                    FOR YOU
                  </span>

                  <h3>
                    MacBook Air M3
                  </h3>

                </div>

                <strong>
                  ₹89,990
                </strong>

              </div>

            </div>

            <div className="floating-card card-small card-bottom">

              <div className="mini-icon">
                <FiShield />
              </div>

              <div>

                <strong>
                  98%
                </strong>

                <span>
                  Match score
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            TRUST STRIP
        ================================================= */}

        <section className="trust-strip">

          <div>
            <FiZap />

            <span>
              AI-Powered
              Recommendations
            </span>
          </div>

          <div>
            <FiShield />

            <span>
              Decision-focused
              shopping
            </span>
          </div>

          <div>
            <FiShoppingBag />

            <span>
              Built for modern
              commerce
            </span>
          </div>

        </section>

        {/* =================================================
            HOW IT WORKS
        ================================================= */}

        <section
          id="how"
          className="how-section"
        >

          <div className="section-heading">

            <div className="eyebrow">
              THE AI SHOPPING
              EXPERIENCE
            </div>

            <h2>
              From search
              <br />

              <span>
                to decision.
              </span>
            </h2>

            <p>
              ShopPilot turns a
              simple conversation
              into an intelligent
              shopping journey.
            </p>

          </div>

          <div className="steps-grid">

            <div className="step-card">

              <div className="step-number">
                01
              </div>

              <div className="step-icon">
                <FiMessageCircle />
              </div>

              <h3>
                Tell the AI
              </h3>

              <p>
                Describe what you
                need in natural
                language. No
                complicated filters
                or endless searching.
              </p>

            </div>

            <div className="step-card featured-step">

              <div className="step-number">
                02
              </div>

              <div className="step-icon">
                <FiZap />
              </div>

              <h3>
                AI understands
              </h3>

              <p>
                ShopPilot analyzes
                your requirements,
                preferences, budget
                and intent.
              </p>

            </div>

            <div className="step-card">

              <div className="step-number">
                03
              </div>

              <div className="step-icon">
                <FiStar />
              </div>

              <h3>
                Choose confidently
              </h3>

              <p>
                Get intelligent
                recommendations
                with clear reasons
                behind every
                suggestion.
              </p>

            </div>

          </div>

        </section>

        {/* =================================================
            RECOMMENDATIONS
        ================================================= */}

        <section
          id="recommendations"
          className={`recommendations-section ${
            showResults
              ? "results-visible"
              : ""
          }`}
        >

          <div className="results-header">

            <div>

              <div className="eyebrow">
                AI RECOMMENDATIONS
              </div>

              <h2>
                Picks made

                <span>
                  {" "}
                  for you.
                </span>
              </h2>

            </div>

            <button
              className="view-all"
              onClick={() => {
                document
                  .getElementById(
                    "recommendations"
                  )
                  ?.scrollIntoView({
                    behavior:
                      "smooth",
                  });
              }}
            >
              Explore all

              <FiChevronRight />

            </button>

          </div>

          {/* PRODUCT GRID */}

          <div className="product-grid">

            {displayedProducts.map(
              (product) => (

                <article
                  className="product-card"
                  key={
                    product.id
                  }
                >

                  {/* IMAGE */}

                  <div className="product-image">

                    <img
                      src={
                        product.image ||
                        getProductImage(
                          product.category
                        )
                      }
                      alt={
                        product.name
                      }
                    />

                    <span className="product-tag">
                      {
                        product.tag
                      }
                    </span>

                    <button
                      className="product-arrow"
                      onClick={() =>
                        openProduct(
                          product
                        )
                      }
                      aria-label={`View ${product.name}`}
                    >
                      <FiArrowRight />
                    </button>

                  </div>

                  {/* INFORMATION */}

                  <div className="product-info">

                    <div className="product-category">
                      {
                        product.category
                      }
                    </div>

                    <div className="product-title-row">

                      <h3>
                        {
                          product.name
                        }
                      </h3>

                      <div className="rating">

                        <FiStar />

                        {
                          product.rating
                        }

                      </div>

                    </div>

                    <p>
                      {
                        product.reason ||
                        product.recommendationReason ||
                        product.description
                      }
                    </p>

                    <div className="product-footer">

                      <strong>
                        {
                          product.price
                        }
                      </strong>

                      <button
                        onClick={() =>
                          openProduct(
                            product
                          )
                        }
                      >
                        View product

                        <FiArrowRight />

                      </button>

                    </div>

                  </div>

                </article>

              )
            )}

          </div>

        </section>

        {/* =================================================
            FINAL CTA
        ================================================= */}

        <section className="final-cta">

          <div className="cta-glow"></div>

          <div className="cta-content">

            <div className="eyebrow">
              YOUR PERSONAL
              SHOPPING AGENT
            </div>

            <h2>
              Stop searching.
              <br />

              <span>
                Start asking.
              </span>
            </h2>

            <p>
              Let AI turn your
              next shopping
              decision into a
              simple conversation.
            </p>

            <button
              className="cta-button"
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior:
                    "smooth",
                });
              }}
            >
              Start shopping
              with AI

              <FiArrowRight />

            </button>

          </div>

        </section>

      </main>

      {/* ===================================================
          FOOTER
      =================================================== */}

      <footer>

        <div className="brand">

          <div className="brand-mark">
            <FiZap />
          </div>

          <span>
            ShopPilot

            <span className="brand-ai">
              AI
            </span>
          </span>

        </div>

        <p>
          Intelligent commerce,
          powered by AI.
        </p>

        <span className="footer-copy">
          © 2026 ShopPilot AI
        </span>

      </footer>

    </div>
  );
}

export default App;