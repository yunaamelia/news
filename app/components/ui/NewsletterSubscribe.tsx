"use client";

import { useState } from "react";
import { FiMail, FiCheck } from "react-icons/fi";

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Terima kasih! Anda telah berlangganan newsletter kami.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Terjadi kesalahan. Silakan coba lagi.");
      }
    } catch {
      setStatus("error");
      setMessage("Terjadi kesalahan. Silakan coba lagi.");
    }

    setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 5000);
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
      <div className="flex items-center space-x-3 mb-4">
        <FiMail className="w-8 h-8" />
        <h3 className="text-2xl font-bold">Newsletter</h3>
      </div>
      <p className="text-blue-100 mb-6">
        Dapatkan ringkasan berita harian dan analisis pasar langsung ke inbox
        Anda
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Anda"
            required
            disabled={status === "loading"}
            className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {status === "success" ? (
              <>
                <FiCheck className="w-5 h-5" />
                <span>Berhasil</span>
              </>
            ) : (
              <span>{status === "loading" ? "Mengirim..." : "Langganan"}</span>
            )}
          </button>
        </div>

        {message && (
          <p
            className={`text-sm ${
              status === "success" ? "text-green-200" : "text-red-200"
            }`}
          >
            {message}
          </p>
        )}
      </form>

      <p className="text-xs text-blue-200 mt-4">
        * Kami menghormati privasi Anda. Berhenti berlangganan kapan saja.
      </p>
    </div>
  );
}
