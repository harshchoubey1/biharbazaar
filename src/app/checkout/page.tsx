"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth, Address } from "@/context/AuthContext";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, addresses, addAddress, placeOrder } = useAuth();
  const router = useRouter();
  const [selectedAddrIdx, setSelectedAddrIdx] = useState(0);
  const [showNewAddr, setShowNewAddr] = useState(addresses.length === 0);
  const [paymentMode, setPaymentMode] = useState("cod");
  const [placing, setPlacing] = useState(false);

  const [newAddr, setNewAddr] = useState<Address>({
    id: "addr-" + Date.now().toString(36),
    label: "Home",
    name: user?.name || "",
    phone: "",
    line1: "",
    city: "",
    state: "Bihar",
    pincode: "",
  });

  if (items.length === 0) {
    return (
      <div className="relative flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <h1 className="text-2xl font-bold mb-4">No items to checkout</h1>
          <Link href="/shop" className="text-primary hover:underline">Go to Shop</Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <h1 className="text-2xl font-bold mb-4">Please login to continue</h1>
          <Link href="/login" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:opacity-90">
            Login
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const deliveryCharge = totalPrice >= 500 ? 0 : 49;
  const grandTotal = totalPrice + deliveryCharge;

  const handlePlaceOrder = () => {
    let address: Address;
    if (showNewAddr || addresses.length === 0) {
      if (!newAddr.name || !newAddr.phone || !newAddr.line1 || !newAddr.city || !newAddr.pincode) {
        alert("Please fill all address fields.");
        return;
      }
      addAddress(newAddr);
      address = newAddr;
    } else {
      address = addresses[selectedAddrIdx];
    }

    setPlacing(true);
    setTimeout(() => {
      const orderId = placeOrder({
        items: items.map((i) => ({ productId: i.product.id, name: i.product.name, price: i.product.price, qty: i.quantity, image: i.product.image, vendor: i.product.vendor })),
        total: grandTotal,
        address,
      });
      clearCart();
      router.push(`/orders?success=${orderId}`);
    }, 1500);
  };

  return (
    <div className="relative flex flex-col min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Address Section */}
            <div className="p-6 border border-black/5 dark:border-white/5 rounded-2xl">
              <h2 className="text-xl font-bold mb-4">Delivery Address</h2>

              {addresses.length > 0 && !showNewAddr && (
                <div className="flex flex-col gap-3 mb-4">
                  {addresses.map((addr, idx) => (
                    <label key={idx} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${selectedAddrIdx === idx ? "border-primary bg-primary/5" : "border-black/5 dark:border-white/5"}`}>
                      <input type="radio" name="address" checked={selectedAddrIdx === idx} onChange={() => setSelectedAddrIdx(idx)} className="mt-1 accent-primary" />
                      <div>
                        <p className="font-semibold">{addr.name}</p>
                        <p className="text-sm text-black/60 dark:text-white/60">{addr.line1}, {addr.city}, {addr.state} - {addr.pincode}</p>
                        <p className="text-sm text-black/60 dark:text-white/60">Phone: {addr.phone}</p>
                      </div>
                    </label>
                  ))}
                  <button onClick={() => setShowNewAddr(true)} className="text-primary text-sm font-medium hover:underline">
                    + Add New Address
                  </button>
                </div>
              )}

              {(showNewAddr || addresses.length === 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input placeholder="Full Name" value={newAddr.name} onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  <input placeholder="Phone Number" value={newAddr.phone} onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  <input placeholder="Street Address" value={newAddr.line1} onChange={(e) => setNewAddr({ ...newAddr, line1: e.target.value })}
                    className="sm:col-span-2 px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  <input placeholder="City" value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  <input placeholder="PIN Code" value={newAddr.pincode} onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  <input placeholder="State" value={newAddr.state} onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  {addresses.length > 0 && (
                    <button onClick={() => setShowNewAddr(false)} className="text-sm text-black/50 hover:underline">Cancel</button>
                  )}
                </div>
              )}
            </div>

            {/* Payment Section */}
            <div className="p-6 border border-black/5 dark:border-white/5 rounded-2xl">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="flex flex-col gap-3">
                <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${paymentMode === "cod" ? "border-primary bg-primary/5" : "border-black/5 dark:border-white/5"}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMode === "cod"} onChange={(e) => setPaymentMode(e.target.value)} className="accent-primary" />
                  <div>
                    <p className="font-semibold">💵 Cash on Delivery</p>
                    <p className="text-xs text-black/50 dark:text-white/50">Pay when your order arrives</p>
                  </div>
                </label>
                <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${paymentMode === "online" ? "border-primary bg-primary/5" : "border-black/5 dark:border-white/5"}`}>
                  <input type="radio" name="payment" value="online" checked={paymentMode === "online"} onChange={(e) => setPaymentMode(e.target.value)} className="accent-primary" />
                  <div>
                    <p className="font-semibold">💳 Online Payment</p>
                    <p className="text-xs text-black/50 dark:text-white/50">UPI, Net Banking, Cards (mock)</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="p-6 border border-black/5 dark:border-white/5 rounded-2xl sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm mb-2">
                  <span className="text-black/60 dark:text-white/60 line-clamp-1 mr-2">{item.product.name} × {item.quantity}</span>
                  <span className="flex-shrink-0">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <hr className="my-4 border-black/5 dark:border-white/5" />
              <div className="flex justify-between text-sm mb-2">
                <span className="text-black/60 dark:text-white/60">Subtotal</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-black/60 dark:text-white/60">Delivery</span>
                <span className={deliveryCharge === 0 ? "text-green-600 font-medium" : ""}>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</span>
              </div>
              <hr className="my-4 border-black/5 dark:border-white/5" />
              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {placing ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
