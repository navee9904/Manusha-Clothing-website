"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const isLogin = mode === "login";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email || password.length < 6) return toast.error("Enter an email and 6 character password");
    setLoading(true);
    if (!isLogin) {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!response.ok) {
        setLoading(false);
        return toast.error("Registration failed");
      }
    }

    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) return toast.error("Invalid credentials");
    toast.success(isLogin ? "Signed in" : "Account created");
    router.push("/");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-serif text-6xl font-black uppercase">{isLogin ? "Login" : "Register"}</h1>
      <form onSubmit={submit} className="mt-10 space-y-4">
        {!isLogin ? (
          <input className="w-full border border-black px-4 py-3" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        ) : null}
        <input className="w-full border border-black px-4 py-3" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full border border-black px-4 py-3" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button disabled={loading} className="w-full bg-black px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-white disabled:bg-neutral-300">
          {loading ? "Please wait" : isLogin ? "Sign in" : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-sm text-neutral-600">
        {isLogin ? "No account?" : "Already registered?"}{" "}
        <Link className="font-bold underline" href={isLogin ? "/register" : "/login"}>
          {isLogin ? "Register" : "Login"}
        </Link>
      </p>
    </main>
  );
}
