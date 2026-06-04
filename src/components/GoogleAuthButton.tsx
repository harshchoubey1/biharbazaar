"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface GoogleAuthButtonProps {
  role?: "customer" | "seller";
  onSuccess?: () => void;
  onError?: (err: string) => void;
}

export default function GoogleAuthButton({ role = "customer", onSuccess, onError }: GoogleAuthButtonProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Load Google Identity Services script
    const id = "google-jssdk";
    if (document.getElementById(id)) {
      setScriptLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.id = id;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!scriptLoaded || !containerRef.current) return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "658333898323-sv08628s6se83va2nr3mvoh15cm2fckm.apps.googleusercontent.com";

    try {
      // @ts-ignore
      if (window.google?.accounts?.id) {
        // @ts-ignore
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: any) => {
            try {
              const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credential: response.credential, role }),
              });
              const data = await res.json();
              if (!res.ok) {
                if (onError) onError(data.error || "Google login failed");
                return;
              }
              // Save user info to local storage
              localStorage.setItem("bb_user", JSON.stringify(data.user));
              // Dispatch event to update components listening to localStorage
              window.dispatchEvent(new Event("storage"));
              // Redirect to corresponding page
              window.location.href = data.user.role === "seller" ? "/seller" : "/";
              if (onSuccess) onSuccess();
            } catch (err: any) {
              if (onError) onError(err.message || "Sign-in network error");
            }
          },
        });

        // @ts-ignore
        window.google.accounts.id.renderButton(containerRef.current, {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "continue_with",
          shape: "rectangular",
        });
      }
    } catch (e) {
      console.error("Google Script Init Error:", e);
    }
  }, [scriptLoaded, role]);

  return <div ref={containerRef} className="w-full flex justify-center items-center my-3 min-h-[44px]" />;
}
