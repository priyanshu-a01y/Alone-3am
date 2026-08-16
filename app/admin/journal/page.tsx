"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Journal = {
    id: string;
    title: string;
    content: string;
    author: string;
    status: string;
    created_at: string;
};

type Report = {
    id: string;
    journal_id: string | null;
    reason: string;
    created_at: string;
};

type JournalComment = {
    id: string;
    journal_id: string;
    content: string;
    author: string;
    status: string;
    created_at: string;
};
export default function AdminJournalPage() {
    const router = useRouter();

    const [sessionLoading, setSessionLoading] = useState(true);

    const [journals, setJournals] =
        useState<Journal[]>([]);

    const [reports, setReports] =
        useState<Report[]>([]);

    const [comments, setComments] =
        useState<JournalComment[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [message, setMessage] =
        useState("");

    useEffect(() => {
        let mounted = true;

        const checkAdmin = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!mounted) return;

            if (!session) {
                router.replace("/admin/login");
                return;
            }

            const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", session.user.id)
                .maybeSingle();

            if (!mounted) return;

            if (profileError || profile?.role !== "admin") {
                await supabase.auth.signOut();
                router.replace("/admin/login");
                return;
            }

            setSessionLoading(false);
        };

        checkAdmin();

        return () => {
            mounted = false;
        };
    }, [router]);

    const loadData = async () => {
        setLoading(true);

        const [
            journalsResult,
            reportsResult,
            commentsResult,
        ] = await Promise.all([
            supabase
                .from("journal_entries")
                .select("*")
                .order("created_at", {
                    ascending: false,
                }),

            supabase
                .from("journal_reports")
                .select("*")
                .order("created_at", {
                    ascending: false,
                }),

            supabase
                .from("journal_comments")
                .select("id,journal_id,content,author,status,created_at")
                .order("created_at", {
                    ascending: false,
                }),
        ]);

        if (journalsResult.error) {
            console.error(
                journalsResult.error
            );
        }

        if (reportsResult.error) {
            console.error(
                reportsResult.error
            );
        }

        if (commentsResult.error) {
            console.error(
                commentsResult.error
            );
        }

        setJournals(
            journalsResult.data || []
        );

        setReports(
            reportsResult.data || []
        );

        setComments(
            commentsResult.data || []
        );

        setLoading(false);
    };

    useEffect(() => {
        if (!sessionLoading) {
            const loadTimer = window.setTimeout(() => {
                void loadData();
            }, 0);

            return () => window.clearTimeout(loadTimer);
        }
    }, [sessionLoading]);

    const updateStatus = async (
        id: string,
        status: string
    ) => {
        setMessage("");

        const { error } =
            await supabase
                .from("journal_entries")
                .update({
                    status,
                })
                .eq("id", id);

        if (error) {
            console.error(error);

            setMessage(
                "Action failed."
            );

            return;
        }

        setJournals(
            (current) =>
                current.map((journal) =>
                    journal.id === id
                        ? {
                            ...journal,
                            status,
                        }
                        : journal
                )
        );

        setMessage(
            `Journal ${status}.`
        );
    };

    const deleteJournal = async (
        id: string
    ) => {
        const confirmed =
            window.confirm(
                "Delete this journal permanently?"
            );

        if (!confirmed) return;

        const { error } =
            await supabase
                .from("journal_entries")
                .delete()
                .eq("id", id);

        if (error) {
            console.error(error);

            setMessage(
                "Delete failed."
            );

            return;
        }

        setJournals(
            (current) =>
                current.filter(
                    (journal) =>
                        journal.id !== id
                )
        );

        setReports(
            (current) =>
                current.filter(
                    (report) =>
                        report.journal_id !==
                        id
                )
        );

        setMessage(
            "Journal deleted."
        );
    };

    const updateCommentStatus = async (
        id: string,
        status: "approved" | "hidden"
    ) => {
        setMessage("");

        const { error } = await supabase
            .from("journal_comments")
            .update({ status })
            .eq("id", id);

        if (error) {
            console.error(error);
            setMessage("Comment action failed.");
            return;
        }

        setComments((current) =>
            current.map((comment) =>
                comment.id === id
                    ? { ...comment, status }
                    : comment
            )
        );

        setMessage(`Comment ${status}.`);
    };

    if (sessionLoading) {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center">
                <p className="text-white/30">
                    Checking access...
                </p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black px-6 pb-32 pt-32 text-white">

            <div className="mx-auto max-w-6xl">

                {/* HEADER */}

                <div className="mb-12">

                    <p className="text-xs tracking-[0.4em] text-white/30">
                        ALONE 3AM
                    </p>

                    <h1 className="mt-3 text-5xl font-semibold">
                        Journal Admin
                    </h1>

                    <p className="mt-3 text-white/35">
                        Moderate the midnight
                        thoughts.
                    </p>

                </div>

                {message && (
                    <div className="
                        mb-6
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/[0.04]
                        px-5
                        py-3
                        text-sm
                        text-white/60
                    ">
                        {message}
                    </div>
                )}

                {/* STATS */}

                <div className="
                    mb-10
                    grid
                    gap-4
                    md:grid-cols-3
                ">

                    <div className="
                        rounded-3xl
                        border border-white/10
                        bg-white/[0.03]
                        p-6
                    ">
                        <p className="text-sm text-white/30">
                            Total Journals
                        </p>

                        <p className="mt-2 text-4xl">
                            {journals.length}
                        </p>
                    </div>

                    <div className="
                        rounded-3xl
                        border border-white/10
                        bg-white/[0.03]
                        p-6
                    ">
                        <p className="text-sm text-white/30">
                            Pending / Hidden
                        </p>

                        <p className="mt-2 text-4xl">
                            {
                                journals.filter(
                                    (j) =>
                                        j.status !==
                                        "approved"
                                ).length
                            }
                        </p>
                    </div>

                    <div className="
                        rounded-3xl
                        border border-white/10
                        bg-white/[0.03]
                        p-6
                    ">
                        <p className="text-sm text-white/30">
                            Reports
                        </p>

                        <p className="mt-2 text-4xl">
                            {reports.length}
                        </p>
                    </div>

                </div>

                {/* JOURNALS */}

                <section>

                    <div className="mb-5 flex items-center justify-between">

                        <h2 className="text-2xl">
                            Journals
                        </h2>

                        <button
                            onClick={loadData}
                            className="
                                rounded-full
                                border
                                border-white/10
                                px-4
                                py-2
                                text-xs
                                text-white/50
                                hover:bg-white/10
                            "
                        >
                            Refresh
                        </button>

                    </div>

                    {loading ? (
                        <p className="py-20 text-center text-white/30">
                            Loading...
                        </p>
                    ) : (
                        <div className="space-y-4">

                            {journals.map(
                                (journal) => (
                                    <article
                                        key={
                                            journal.id
                                        }
                                        className="
                                            rounded-3xl
                                            border
                                            border-white/10
                                            bg-white/[0.025]
                                            p-6
                                        "
                                    >

                                        <div className="
                                            flex
                                            items-start
                                            justify-between
                                            gap-5
                                        ">

                                            <div>

                                                <p className="text-xs text-white/25">
                                                    {
                                                        journal.author
                                                    }
                                                </p>

                                                <h3 className="mt-3 text-xl">
                                                    {
                                                        journal.title ||
                                                        "Untitled"
                                                    }
                                                </h3>

                                                <p className="
                                                    mt-3
                                                    whitespace-pre-wrap
                                                    leading-7
                                                    text-white/45
                                                ">
                                                    {
                                                        journal.content
                                                    }
                                                </p>

                                            </div>

                                            <span className="
                                                shrink-0
                                                rounded-full
                                                border
                                                border-white/10
                                                px-3
                                                py-1
                                                text-xs
                                                text-white/40
                                            ">
                                                {
                                                    journal.status
                                                }
                                            </span>

                                        </div>

                                        <div className="
                                            mt-6
                                            flex
                                            flex-wrap
                                            gap-2
                                            border-t
                                            border-white/10
                                            pt-5
                                        ">

                                            <button
                                                onClick={() =>
                                                    updateStatus(
                                                        journal.id,
                                                        "approved"
                                                    )
                                                }
                                                className="
                                                    rounded-full
                                                    bg-white
                                                    px-4
                                                    py-2
                                                    text-xs
                                                    text-black
                                                "
                                            >
                                                Approve
                                            </button>

                                            <button
                                                onClick={() =>
                                                    updateStatus(
                                                        journal.id,
                                                        "hidden"
                                                    )
                                                }
                                                className="
                                                    rounded-full
                                                    border
                                                    border-white/10
                                                    px-4
                                                    py-2
                                                    text-xs
                                                    text-white/60
                                                "
                                            >
                                                Hide
                                            </button>

                                            <button
                                                onClick={() =>
                                                    deleteJournal(
                                                        journal.id
                                                    )
                                                }
                                                className="
                                                    rounded-full
                                                    border
                                                    border-red-400/20
                                                    px-4
                                                    py-2
                                                    text-xs
                                                    text-red-300/60
                                                "
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </article>
                                )
                            )}

                        </div>
                    )}

                </section>

                {/* COMMENTS */}

                <section className="mt-20">

                    <h2 className="mb-5 text-2xl">
                        Comments
                    </h2>

                    <div className="space-y-3">

                        {comments.length === 0 ? (
                            <p className="text-white/25">
                                No comments.
                            </p>
                        ) : (
                            comments.map((comment) => (
                                <article
                                    key={comment.id}
                                    className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <p className="text-xs text-white/30">
                                            {comment.author || "anonymous"}
                                        </p>

                                        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/40">
                                            {comment.status}
                                        </span>
                                    </div>

                                    <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/60">
                                        {comment.content}
                                    </p>

                                    <p className="mt-3 text-[11px] text-white/20">
                                        Journal: {comment.journal_id}
                                    </p>

                                    <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                                        <button
                                            onClick={() => updateCommentStatus(comment.id, "approved")}
                                            className="rounded-full bg-white px-4 py-2 text-xs text-black"
                                        >
                                            Approve
                                        </button>

                                        <button
                                            onClick={() => updateCommentStatus(comment.id, "hidden")}
                                            className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/60"
                                        >
                                            Hide
                                        </button>
                                    </div>
                                </article>
                            ))
                        )}

                    </div>

                </section>

                {/* REPORTS */}

                <section className="mt-20">

                    <h2 className="mb-5 text-2xl">
                        Reports
                    </h2>

                    <div className="space-y-3">

                        {reports.length === 0 ? (
                            <p className="text-white/25">
                                No reports.
                            </p>
                        ) : (
                            reports.map(
                                (report) => (
                                    <div
                                        key={
                                            report.id
                                        }
                                        className="
                                            rounded-2xl
                                            border
                                            border-white/10
                                            bg-white/[0.025]
                                            p-5
                                        "
                                    >

                                        <p className="text-sm text-white/50">
                                            {
                                                report.reason
                                            }
                                        </p>

                                        <p className="mt-2 text-xs text-white/20">
                                            Journal:{" "}
                                            {
                                                report.journal_id
                                            }
                                        </p>

                                    </div>
                                )
                            )
                        )}

                    </div>

                </section>

            </div>

        </main>
    );
}
