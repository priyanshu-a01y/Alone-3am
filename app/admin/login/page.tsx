"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setError("");

        const cleanEmail = email.trim();

        if (!cleanEmail || !password) {
            setError("Email and password are required.");
            return;
        }

        setLoading(true);

        try {
            const {
                data: authData,
                error: authError,
            } = await supabase.auth.signInWithPassword({
                email: cleanEmail,
                password,
            });

            if (authError || !authData.user) {
                setError(
                    authError?.message ||
                    "Invalid email or password."
                );
                setLoading(false);
                return;
            }

            /*
             * Check admin role.
             * This keeps normal users away from /admin.
             */

            const { data: profile, error: profileError } =
                await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", authData.user.id)
                    .maybeSingle();

            if (profileError) {
                console.error(
                    "Admin profile error:",
                    profileError
                );

                await supabase.auth.signOut();

                setError(
                    "Unable to verify admin account."
                );

                setLoading(false);
                return;
            }

            if (profile?.role !== "admin") {
                await supabase.auth.signOut();

                setError(
                    "This account does not have admin access."
                );

                setLoading(false);
                return;
            }

            router.replace("/admin/journal");
            router.refresh();
        } catch (err) {
            console.error(
                "Admin login error:",
                err
            );

            setError(
                "Something went wrong. Please try again."
            );

            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-black px-5 text-white">
            <div className="flex min-h-screen items-center justify-center">
                <div className="w-full max-w-md">

                    {/* BRAND */}

                    <div className="mb-10 text-center">

                        <p className="text-xs uppercase tracking-[0.5em] text-white/25">
                            ALONE 3AM
                        </p>

                        <h1
                            className="mt-5 text-5xl text-white"
                            style={{
                                fontFamily:
                                    "'Noto Serif Devanagari', 'Nirmala UI', serif",
                            }}
                        >
                            वापस आओ।
                        </h1>

                        <p className="mt-4 text-sm text-white/30">
                            Private space for the night.
                        </p>

                    </div>

                    {/* LOGIN CARD */}

                    <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl md:p-9">

                        <form
                            onSubmit={handleLogin}
                            className="space-y-5"
                        >

                            {/* EMAIL */}

                            <div>
                                <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-white/30">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                    autoComplete="email"
                                    placeholder="admin@email.com"
                                    disabled={loading}
                                    className="
                                        w-full
                                        rounded-2xl
                                        border
                                        border-white/10
                                        bg-white/[0.03]
                                        px-5
                                        py-4
                                        text-white
                                        outline-none
                                        transition
                                        placeholder:text-white/20
                                        focus:border-white/30
                                    "
                                />
                            </div>

                            {/* PASSWORD */}

                            <div>
                                <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-white/30">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    disabled={loading}
                                    className="
                                        w-full
                                        rounded-2xl
                                        border
                                        border-white/10
                                        bg-white/[0.03]
                                        px-5
                                        py-4
                                        text-white
                                        outline-none
                                        transition
                                        placeholder:text-white/20
                                        focus:border-white/30
                                    "
                                />
                            </div>

                            {/* ERROR */}

                            {error && (
                                <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.05] px-4 py-3 text-sm leading-6 text-red-300/80">
                                    {error}
                                </div>
                            )}

                            {/* LOGIN */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="
                                    w-full
                                    rounded-full
                                    bg-white
                                    py-4
                                    text-sm
                                    font-medium
                                    text-black
                                    transition
                                    hover:scale-[1.01]
                                    hover:bg-white/90
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                            >
                                {loading
                                    ? "ENTERING..."
                                    : "ENTER"}
                            </button>

                        </form>

                    </div>

                    <p className="mt-7 text-center text-xs text-white/15">
                        This place is not for everyone.
                    </p>

                </div>
            </div>
        </main>
    );
}