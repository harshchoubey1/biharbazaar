"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "customer" | "seller" | "admin";
}

export interface Address {
  id: string;
  label: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

interface Order {
  id: string;
  items: any[];
  total: number;
  status: string;
  date: string;
  address?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, role?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  addresses: Address[];
  addAddress: (addr: Address) => void;
  orders: Order[];
  placeOrder: (order: Omit<Order, "id" | "date" | "status">) => string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Load persisted user on mount
  useEffect(() => {
    const stored = localStorage.getItem("bb_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    setLoading(false);

    const storedAddr = localStorage.getItem("bb_addresses");
    if (storedAddr) setAddresses(JSON.parse(storedAddr));

    const storedOrders = localStorage.getItem("bb_orders");
    if (storedOrders) setOrders(JSON.parse(storedOrders));
  }, []);

  const persistUser = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem("bb_user", JSON.stringify(u));
    else localStorage.removeItem("bb_user");
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || "Login failed" };
      persistUser(data.user);
      return { success: true };
    } catch {
      // Fallback: check local registered users
      try {
        const registered = JSON.parse(localStorage.getItem("ekart-registered-users") || "{}");
        const lower = email.toLowerCase();
        const found = registered[lower];
        if (found) {
          const u: User = { id: found.id || "local-" + lower, name: found.name || lower, email: lower, role: found.role || "customer" };
          persistUser(u);
          return { success: true };
        }
      } catch {}
      return { success: false, error: "Network error – please try again." };
    }
  };

  const register = async (name: string, email: string, password: string, role = "customer") => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || "Registration failed" };
      persistUser(data.user);
      return { success: true };
    } catch {
      // Offline fallback
      const lower = email.toLowerCase();
      const newUser: User = { id: "local-" + Math.random().toString(36).slice(2), name, email: lower, role: role as any };
      try {
        const registered = JSON.parse(localStorage.getItem("ekart-registered-users") || "{}");
        if (registered[lower]) return { success: false, error: "Email already registered." };
        registered[lower] = { ...newUser, password };
        localStorage.setItem("ekart-registered-users", JSON.stringify(registered));
      } catch {}
      persistUser(newUser);
      return { success: true };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/login", { method: "DELETE" });
    } catch {}
    persistUser(null);
    window.location.href = "/";
  };

  const addAddress = (addr: Address) => {
    const updated = [...addresses, addr];
    setAddresses(updated);
    localStorage.setItem("bb_addresses", JSON.stringify(updated));
  };

  const placeOrder = (order: Omit<Order, "id" | "date" | "status">) => {
    const id = "ORD-" + Date.now().toString(36).toUpperCase();
    const newOrder: Order = { ...order, id, date: new Date().toISOString(), status: "Processing" };
    const updated = [newOrder, ...orders];
    setOrders(updated);
    localStorage.setItem("bb_orders", JSON.stringify(updated));

    // Also save to MongoDB in background
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...order, orderId: id }),
    }).catch(() => {});

    return id;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, addresses, addAddress, orders, placeOrder }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
