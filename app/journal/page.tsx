"use client";

import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

type Journal = {
    id: string;
    title: string;
    content: string;
    author: string;
    status: string;
    created_at: string;
};

type Comment = {
    id: string;
    journal_id: string;
    content: string;
    author: string;
    status: string;
    created_at: string;
};

type LikeCount = Record<string, number>;

export default function JournalPage() {
    const [journals, setJournals] = useState<Journal[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [likeCounts, setLikeCounts] = useState<LikeCount>({});
    const [likedJournals, setLikedJournals] = useState<string[]>([]);

    const [visitorId, setVisitorId] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [showWrite, setShowWrite] = useState(false);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("anonymous");

    const [posting, setPosting] = useState(false);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<
        "normal" | "success" | "error"
    >("normal");

    const [openComments, setOpenComments] =
        useState<string | null>(null);

    const [commentText, setCommentText] = useState("");
    const [commentAuthor, setCommentAuthor] =
        useState("anonymous");

    const [commenting, setCommenting] = useState(false);

    const [reportingJournalId, setReportingJournalId] =
        useState<string | null>(null);

    const [likingJournalId, setLikingJournalId] =
        useState<string | null>(null);

    /* =====================================================
       MESSAGE
    ===================================================== */

    const showMessage = (
        text: string,
        type: "normal" | "success" | "error" = "normal"
    ) => {
        setMessage(text);
        setMessageType(type);
    };

    /* =====================================================
       VISITOR ID
    ===================================================== */

    const getVisitorId = () => {
        let id = window.localStorage.getItem(
            "alone3am_visitor_id"
        );

        if (!id) {
            if (
                typeof crypto !== "undefined" &&
                typeof crypto.randomUUID === "function"
            ) {
                id = crypto.randomUUID();
            } else {
                id =
                    Date.now().toString(36) +
                    Math.random().toString(36).slice(2);
            }

            window.localStorage.setItem(
                "alone3am_visitor_id",
                id
            );
        }

        return id;
    };

    /* =====================================================
       LOAD JOURNALS
    ===================================================== */

    const loadJournals = async (
        silent = false
    ) => {
        if (silent) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        const { data, error } = await supabase
            .from("journal_entries")
            .select(
                "id,title,content,author,status,created_at"
            )
            .eq("status", "approved")
            .order("created_at", {
                ascending: false,
            });

        if (error) {
            console.error(
                "Journal loading error:",
                error
            );

            showMessage(
                "Journal load nahi ho paya. Please try again.",
                "error"
            );
        } else {
            setJournals(data || []);
        }

        setLoading(false);
        setRefreshing(false);
    };

    /* =====================================================
       LOAD COMMENTS
    ===================================================== */

    const loadComments = async () => {
        const { data, error } = await supabase
            .from("journal_comments")
            .select(
                "id,journal_id,content,author,status,created_at"
            )
            .eq("status", "approved")
            .order("created_at", {
                ascending: true,
            });

        if (error) {
            console.error(
                "Comments loading error:",
                error
            );

            return;
        }

        setComments(data || []);
    };

    /* =====================================================
       LOAD LIKES
    ===================================================== */

    const loadLikes = async (
        currentVisitorId: string
    ) => {
        const { data, error } = await supabase
            .from("journal_likes")
            .select("journal_id,visitor_id");

        if (error) {
            console.error(
                "Likes loading error:",
                error
            );

            return;
        }

        const counts: LikeCount = {};
        const mine: string[] = [];

        (data || []).forEach((like) => {
            counts[like.journal_id] =
                (counts[like.journal_id] || 0) + 1;

            if (
                like.visitor_id ===
                currentVisitorId
            ) {
                mine.push(like.journal_id);
            }
        });

        setLikeCounts(counts);
        setLikedJournals(mine);
    };

    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {
        let cancelled = false;

        const start = async () => {
            const id = getVisitorId();

            if (cancelled) return;

            setVisitorId(id);

            await Promise.all([
                loadJournals(),
                loadComments(),
                loadLikes(id),
            ]);
        };

        void start();

        return () => {
            cancelled = true;
        };
    }, []);

    /* =====================================================
       CREATE JOURNAL
    ===================================================== */

    const createJournal = async () => {
        const cleanTitle = title.trim();
        const cleanContent = content.trim();
        const cleanAuthor =
            author.trim() || "anonymous";

        if (!cleanContent) {
            showMessage(
                "Pehle apni baat likho.",
                "error"
            );
            return;
        }

        if (cleanContent.length < 10) {
            showMessage(
                "Thoda aur likho. Kam se kam 10 characters.",
                "error"
            );
            return;
        }

        if (cleanContent.length > 2000) {
            showMessage(
                "Thought 2000 characters se zyada nahi ho sakta.",
                "error"
            );
            return;
        }

        setPosting(true);
        setMessage("");

        const { error } = await supabase
            .from("journal_entries")
            .insert({
                title:
                    cleanTitle || "Aaj ki raat",
                content: cleanContent,
                author: cleanAuthor,
                status: "pending",
            });

        if (error) {
            console.error(
                "Journal post error:",
                error
            );

            showMessage(
                "Post nahi ho paya. Please try again.",
                "error"
            );

            setPosting(false);
            return;
        }

        setTitle("");
        setContent("");
        setAuthor("anonymous");

        setPosting(false);
        setShowWrite(false);

        showMessage(
            "Tumhari baat save ho gayi. Admin approval ke baad ye Journal mein dikhegi.",
            "success"
        );
    };

    /* =====================================================
       CREATE COMMENT
    ===================================================== */

    const createComment = async (
        journalId: string
    ) => {
        const cleanComment =
            commentText.trim();

        const cleanAuthor =
            commentAuthor.trim() ||
            "anonymous";

        if (!cleanComment) {
            showMessage(
                "Comment likho pehle.",
                "error"
            );
            return;
        }

        if (cleanComment.length < 2) {
            showMessage(
                "Comment thoda aur likho.",
                "error"
            );
            return;
        }

        if (cleanComment.length > 500) {
            showMessage(
                "Comment 500 characters se zyada nahi ho sakta.",
                "error"
            );
            return;
        }

        setCommenting(true);

        const { error } = await supabase
            .from("journal_comments")
            .insert({
                journal_id: journalId,
                content: cleanComment,
                author: cleanAuthor,
                status: "pending",
            });

        if (error) {
            console.error(
                "Comment error:",
                error
            );

            showMessage(
                "Comment post nahi ho paya.",
                "error"
            );

            setCommenting(false);
            return;
        }

        setCommentText("");
        setCommentAuthor("anonymous");

        setCommenting(false);

        showMessage(
            "Comment save ho gaya. Approval ke baad dikhega.",
            "success"
        );
    };

    /* =====================================================
       LIKE / UNLIKE
    ===================================================== */

    const toggleLike = async (
        journalId: string
    ) => {
        if (!visitorId || likingJournalId) {
            return;
        }

        setLikingJournalId(journalId);

        const alreadyLiked =
            likedJournals.includes(journalId);

        if (alreadyLiked) {
            const { error } = await supabase
                .from("journal_likes")
                .delete()
                .eq("journal_id", journalId)
                .eq("visitor_id", visitorId);

            if (error) {
                console.error(
                    "Unlike error:",
                    error
                );

                showMessage(
                    "Like remove nahi ho paya.",
                    "error"
                );

                setLikingJournalId(null);
                return;
            }

            setLikedJournals((current) =>
                current.filter(
                    (id) => id !== journalId
                )
            );

            setLikeCounts((current) => ({
                ...current,
                [journalId]: Math.max(
                    0,
                    (current[journalId] || 0) - 1
                ),
            }));

            setLikingJournalId(null);
            return;
        }

        const { error } = await supabase
            .from("journal_likes")
            .insert({
                journal_id: journalId,
                visitor_id: visitorId,
            });

        if (error) {
            /*
             * If the database already contains
             * the visitor's like, simply sync
             * the local state instead of showing
             * a scary error.
             */
            if (
                error.code === "23505"
            ) {
                setLikedJournals((current) =>
                    current.includes(journalId)
                        ? current
                        : [...current, journalId]
                );

                setLikingJournalId(null);
                return;
            }

            console.error(
                "Like error:",
                error
            );

            showMessage(
                "Like nahi ho paya.",
                "error"
            );

            setLikingJournalId(null);
            return;
        }

        setLikedJournals((current) => [
            ...current,
            journalId,
        ]);

        setLikeCounts((current) => ({
            ...current,
            [journalId]:
                (current[journalId] || 0) + 1,
        }));

        setLikingJournalId(null);
    };

    /* =====================================================
       REPORT
    ===================================================== */

    const reportJournal = async (
        journalId: string
    ) => {
        const reason =
            window
                .prompt(
                    "What should we review about this entry?"
                )
                ?.trim();

        if (!reason) {
            return;
        }

        if (reason.length > 500) {
            showMessage(
                "Report 500 characters se zyada nahi ho sakti.",
                "error"
            );
            return;
        }

        setReportingJournalId(journalId);

        const { error } = await supabase
            .from("journal_reports")
            .insert({
                journal_id: journalId,
                reason,
            });

        setReportingJournalId(null);

        if (error) {
            console.error(
                "Report error:",
                error
            );

            showMessage(
                "Report submit nahi ho payi. Please try again.",
                "error"
            );

            return;
        }

        showMessage(
            "Thanks. We will review this entry quietly.",
            "success"
        );
    };

    /* =====================================================
       HELPERS
    ===================================================== */

    const formatDate = (
        date: string
    ) => {
        const d = new Date(date);

        if (Number.isNaN(d.getTime())) {
            return "";
        }

        return d.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );
    };

    const getComments = (
        journalId: string
    ) => {
        return comments.filter(
            (comment) =>
                comment.journal_id ===
                journalId
        );
    };

    /* =====================================================
       UI
    ===================================================== */

    return (
        <main className="
            min-h-screen
            bg-black
            text-white
        ">

            {/* =========================================
                NAVBAR
            ========================================= */}

            <div className="relative z-40">
                <Navbar />
            </div>

            {/* =========================================
                BACKGROUND
            ========================================= */}

            <div className="
                pointer-events-none
                fixed
                inset-0
                bg-[radial-gradient(circle_at_50%_20%,rgba(70,80,110,0.12),transparent_50%)]
            " />

            <div className="
                pointer-events-none
                fixed
                inset-0
                bg-gradient-to-b
                from-black
                via-black
                to-[#030303]
            " />

            {/* =========================================
                CONTENT
            ========================================= */}

            <div className="
                relative
                z-10
                mx-auto
                max-w-4xl
                px-5
                pb-32
                pt-32
                md:px-8
            ">

                {/* HEADER */}

                <header className="mb-14">

                    <p className="
                        text-xs
                        uppercase
                        tracking-[0.45em]
                        text-white/30
                    ">
                        आज की रात
                    </p>

                    <h1
                        className="
                            mt-4
                            text-5xl
                            font-semibold
                            tracking-tight
                            md:text-7xl
                        "
                        style={{
                            fontFamily:
                                "'Noto Serif Devanagari', 'Nirmala UI', serif",
                        }}
                    >
                        जर्नल
                    </h1>

                    <p className="
                        mt-5
                        max-w-xl
                        text-sm
                        leading-7
                        text-white/35
                    ">
                        कुछ बातें दुनिया को बताने के लिए
                        नहीं होतीं। बस लिख देने के लिए होती हैं।
                    </p>

                </header>

                {/* WRITE CARD */}

                <button
                    type="button"
                    onClick={() => {
                        setMessage("");
                        setShowWrite(true);
                    }}
                    className="
                        group
                        mb-10
                        w-full
                        rounded-[28px]
                        border
                        border-white/10
                        bg-white/[0.035]
                        p-6
                        text-left
                        transition-all
                        duration-500
                        hover:border-white/20
                        hover:bg-white/[0.06]
                        md:p-7
                    "
                >

                    <div className="
                        flex
                        items-center
                        justify-between
                        gap-5
                    ">

                        <div>

                            <p className="
                                text-[10px]
                                uppercase
                                tracking-[0.3em]
                                text-white/25
                            ">
                                अपना मन हल्का करो
                            </p>

                            <p className="
                                mt-3
                                text-xl
                                text-white/60
                            ">
                                कुछ लिखना है?
                            </p>

                            <p className="
                                mt-2
                                text-sm
                                text-white/25
                            ">
                                No login. No pressure. Just write.
                            </p>

                        </div>

                        <span className="
                            hidden
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-white/10
                            text-xl
                            text-white/30
                            transition
                            group-hover:border-white/20
                            group-hover:text-white
                            sm:flex
                        ">
                            +
                        </span>

                    </div>

                </button>

                {/* MESSAGE */}

                {message && (
                    <div
                        className={`
                            mb-8
                            rounded-2xl
                            border
                            px-5
                            py-4
                            text-sm
                            leading-6
                            ${messageType ===
                                "error"
                                ? "border-red-500/20 bg-red-500/[0.04] text-red-300/70"
                                : messageType ===
                                    "success"
                                    ? "border-white/10 bg-white/[0.035] text-white/50"
                                    : "border-white/10 bg-white/[0.03] text-white/50"
                            }
                        `}
                    >
                        {message}
                    </div>
                )}

                {/* REFRESH */}

                {!loading &&
                    journals.length > 0 && (
                        <div className="
                            mb-5
                            flex
                            justify-end
                        ">

                            <button
                                type="button"
                                onClick={() => {
                                    void Promise.all([
                                        loadJournals(true),
                                        loadComments(),
                                        visitorId
                                            ? loadLikes(
                                                visitorId
                                            )
                                            : Promise.resolve(),
                                    ]);
                                }}
                                disabled={refreshing}
                                className="
                                    text-[10px]
                                    uppercase
                                    tracking-[0.25em]
                                    text-white/20
                                    transition
                                    hover:text-white/50
                                    disabled:opacity-30
                                ">
                                {refreshing
                                    ? "Refreshing..."
                                    : "Refresh"}
                            </button>

                        </div>
                    )}

                {/* LOADING */}

                {loading && (
                    <div className="
                        py-28
                        text-center
                    ">

                        <div className="
                            mx-auto
                            h-5
                            w-5
                            animate-pulse
                            rounded-full
                            border
                            border-white/20
                        "/>

                        <p className="
                            mt-5
                            text-sm
                            text-white/25
                        ">
                            रात की बातें ढूंढ रहे हैं...
                        </p>

                    </div>
                )}

                {/* EMPTY */}

                {!loading &&
                    journals.length === 0 && (
                        <div className="
                            rounded-[28px]
                            border
                            border-white/10
                            bg-white/[0.02]
                            px-6
                            py-24
                            text-center
                        ">

                            <p
                                className="
                                    text-3xl
                                    text-white/65
                                    md:text-4xl
                                "
                                style={{
                                    fontFamily:
                                        "'Noto Serif Devanagari', 'Nirmala UI', serif",
                                }}
                            >
                                अभी रात शांत है।
                            </p>

                            <p className="
                                mt-4
                                text-sm
                                text-white/25
                            ">
                                पहली बात तुम लिख सकते हो।
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowWrite(true)
                                }
                                className="
                                    mt-8
                                    rounded-full
                                    border
                                    border-white/15
                                    px-6
                                    py-3
                                    text-xs
                                    tracking-[0.2em]
                                    text-white/50
                                    transition
                                    hover:bg-white
                                    hover:text-black
                                "
                            >
                                WRITE SOMETHING
                            </button>

                        </div>
                    )}

                {/* FEED */}

                {!loading &&
                    journals.length > 0 && (
                        <div className="space-y-5">

                            {journals.map(
                                (journal) => {
                                    const journalComments =
                                        getComments(
                                            journal.id
                                        );

                                    const commentsOpen =
                                        openComments ===
                                        journal.id;

                                    const liked =
                                        likedJournals.includes(
                                            journal.id
                                        );

                                    const liking =
                                        likingJournalId ===
                                        journal.id;

                                    return (
                                        <article
                                            key={
                                                journal.id
                                            }
                                            className="
                                                rounded-[28px]
                                                border
                                                border-white/10
                                                bg-white/[0.025]
                                                p-6
                                                transition
                                                hover:border-white/[0.15]
                                                md:p-8
                                            "
                                        >

                                            {/* META */}

                                            <div className="
                                                flex
                                                flex-wrap
                                                items-center
                                                justify-between
                                                gap-3
                                            ">

                                                <span className="
                                                    text-xs
                                                    text-white/30
                                                ">
                                                    {journal.author ||
                                                        "anonymous"}
                                                </span>

                                                <span className="
                                                    text-xs
                                                    text-white/20
                                                ">
                                                    {formatDate(
                                                        journal.created_at
                                                    )}
                                                </span>

                                            </div>

                                            {/* TITLE */}

                                            <h2
                                                className="
                                                    mt-6
                                                    text-2xl
                                                    font-medium
                                                    leading-tight
                                                    text-white/85
                                                    md:text-3xl
                                                "
                                                style={{
                                                    fontFamily:
                                                        "'Noto Serif Devanagari', 'Nirmala UI', serif",
                                                }}
                                            >
                                                {journal.title}
                                            </h2>

                                            {/* CONTENT */}

                                            <p className="
                                                mt-5
                                                whitespace-pre-wrap
                                                break-words
                                                text-[15px]
                                                leading-8
                                                text-white/55
                                            ">
                                                {
                                                    journal.content
                                                }
                                            </p>

                                            {/* ACTIONS */}

                                            <div className="
                                                mt-7
                                                flex
                                                flex-wrap
                                                items-center
                                                gap-2
                                                border-t
                                                border-white/10
                                                pt-5
                                            ">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        void toggleLike(
                                                            journal.id
                                                        )
                                                    }
                                                    disabled={
                                                        !visitorId ||
                                                        liking
                                                    }
                                                    className={`
                                                        rounded-full
                                                        border
                                                        px-4
                                                        py-2
                                                        text-xs
                                                        transition-all
                                                        ${liked
                                                            ? "border-white/30 bg-white text-black"
                                                            : "border-white/10 text-white/40 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                                                        }
                                                    `}
                                                >

                                                    {liking
                                                        ? "..."
                                                        : liked
                                                            ? "♥ Liked"
                                                            : "♡ Like"}

                                                    <span className="
                                                        ml-1
                                                        opacity-60
                                                    ">
                                                        {likeCounts[
                                                            journal.id
                                                        ] || 0}
                                                    </span>

                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setOpenComments(
                                                            commentsOpen
                                                                ? null
                                                                : journal.id
                                                        )
                                                    }
                                                    className="
                                                        rounded-full
                                                        border
                                                        border-white/10
                                                        px-4
                                                        py-2
                                                        text-xs
                                                        text-white/35
                                                        transition
                                                        hover:border-white/20
                                                        hover:bg-white/[0.06]
                                                        hover:text-white
                                                    "
                                                >
                                                    {commentsOpen
                                                        ? "Hide comments"
                                                        : `Comments${journalComments.length
                                                            ? ` (${journalComments.length})`
                                                            : ""
                                                        }`}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        void reportJournal(
                                                            journal.id
                                                        )
                                                    }
                                                    disabled={
                                                        reportingJournalId ===
                                                        journal.id
                                                    }
                                                    className="
                                                        rounded-full
                                                        px-3
                                                        py-2
                                                        text-xs
                                                        text-white/20
                                                        transition
                                                        hover:text-white/50
                                                        disabled:opacity-30
                                                    "
                                                >
                                                    {reportingJournalId ===
                                                        journal.id
                                                        ? "Sending..."
                                                        : "Report"}
                                                </button>

                                            </div>

                                            {/* COMMENTS */}

                                            {commentsOpen && (
                                                <div className="
                                                    mt-6
                                                    border-t
                                                    border-white/10
                                                    pt-6
                                                ">

                                                    {journalComments.length ===
                                                        0 && (
                                                            <p className="
                                                                text-sm
                                                                text-white/20
                                                            ">
                                                                Abhi koi comment nahi hai.
                                                            </p>
                                                        )}

                                                    <div className="
                                                        space-y-3
                                                    ">

                                                        {journalComments.map(
                                                            (
                                                                comment
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        comment.id
                                                                    }
                                                                    className="
                                                                        rounded-2xl
                                                                        bg-white/[0.025]
                                                                        p-4
                                                                    "
                                                                >

                                                                    <div className="
                                                                        flex
                                                                        items-center
                                                                        justify-between
                                                                        gap-3
                                                                    ">

                                                                        <span className="
                                                                            text-xs
                                                                            text-white/35
                                                                        ">
                                                                            {
                                                                                comment.author
                                                                            }
                                                                        </span>

                                                                        <span className="
                                                                            text-[10px]
                                                                            text-white/15
                                                                        ">
                                                                            {formatDate(
                                                                                comment.created_at
                                                                            )}
                                                                        </span>

                                                                    </div>

                                                                    <p className="
                                                                        mt-3
                                                                        whitespace-pre-wrap
                                                                        break-words
                                                                        text-sm
                                                                        leading-6
                                                                        text-white/45
                                                                    ">
                                                                        {
                                                                            comment.content
                                                                        }
                                                                    </p>

                                                                </div>
                                                            )
                                                        )}

                                                    </div>

                                                    {/* COMMENT INPUT */}

                                                    <div className="
                                                        mt-5
                                                        rounded-2xl
                                                        border
                                                        border-white/10
                                                        bg-black/30
                                                        p-4
                                                    ">

                                                        <input
                                                            value={
                                                                commentAuthor
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                setCommentAuthor(
                                                                    e.target.value
                                                                )
                                                            }
                                                            maxLength={
                                                                50
                                                            }
                                                            placeholder="Your name"
                                                            className="
                                                                w-full
                                                                border-b
                                                                border-white/10
                                                                bg-transparent
                                                                py-3
                                                                text-sm
                                                                text-white
                                                                outline-none
                                                                placeholder:text-white/20
                                                            "
                                                        />

                                                        <textarea
                                                            value={
                                                                commentText
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                setCommentText(
                                                                    e.target.value
                                                                )
                                                            }
                                                            maxLength={
                                                                500
                                                            }
                                                            rows={3}
                                                            placeholder="Say something..."
                                                            className="
                                                                mt-3
                                                                w-full
                                                                resize-none
                                                                bg-transparent
                                                                py-3
                                                                text-sm
                                                                leading-6
                                                                text-white
                                                                outline-none
                                                                placeholder:text-white/20
                                                            "
                                                        />

                                                        <div className="
                                                            mt-2
                                                            flex
                                                            items-center
                                                            justify-between
                                                        ">

                                                            <span className="
                                                                text-[10px]
                                                                text-white/15
                                                            ">
                                                                {
                                                                    commentText.length
                                                                }
                                                                /500
                                                            </span>

                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    commenting ||
                                                                    !commentText.trim()
                                                                }
                                                                onClick={() =>
                                                                    void createComment(
                                                                        journal.id
                                                                    )
                                                                }
                                                                className="
                                                                    rounded-full
                                                                    bg-white
                                                                    px-5
                                                                    py-2.5
                                                                    text-xs
                                                                    text-black
                                                                    transition
                                                                    hover:scale-105
                                                                    disabled:cursor-not-allowed
                                                                    disabled:opacity-30
                                                                "
                                                            >
                                                                {commenting
                                                                    ? "Posting..."
                                                                    : "Comment"}
                                                            </button>

                                                        </div>

                                                    </div>

                                                </div>
                                            )}

                                        </article>
                                    );
                                }
                            )}

                        </div>
                    )}

            </div>

            {/* =========================================
                WRITE MODAL
            ========================================= */}

            {showWrite && (
                <div className="
                    fixed
                    inset-0
                    z-[100]
                    flex
                    items-center
                    justify-center
                    bg-black/80
                    p-4
                    backdrop-blur-md
                    md:p-6
                ">

                    <div className="
                        relative
                        max-h-[92vh]
                        w-full
                        max-w-2xl
                        overflow-y-auto
                        rounded-[32px]
                        border
                        border-white/10
                        bg-[#090909]
                        p-6
                        shadow-2xl
                        md:p-10
                    ">

                        {/* CLOSE */}

                        <button
                            type="button"
                            aria-label="Close"
                            onClick={() =>
                                setShowWrite(false)
                            }
                            className="
                                absolute
                                right-5
                                top-4
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-full
                                text-2xl
                                text-white/25
                                transition
                                hover:bg-white/[0.06]
                                hover:text-white
                            "
                        >
                            ×
                        </button>

                        {/* HEADING */}

                        <p className="
                            text-xs
                            uppercase
                            tracking-[0.35em]
                            text-white/25
                        ">
                            आज की रात
                        </p>

                        <h2
                            className="
                                mt-4
                                text-4xl
                                text-white
                                md:text-5xl
                            "
                            style={{
                                fontFamily:
                                    "'Noto Serif Devanagari', 'Nirmala UI', serif",
                            }}
                        >
                            अपनी बात लिखो।
                        </h2>

                        <p className="
                            mt-4
                            text-sm
                            text-white/30
                        ">
                            No login. No pressure. Just write.
                        </p>

                        {/* AUTHOR */}

                        <input
                            value={author}
                            onChange={(e) =>
                                setAuthor(
                                    e.target.value
                                )
                            }
                            maxLength={50}
                            placeholder="Your name (optional)"
                            className="
                                mt-9
                                w-full
                                border-b
                                border-white/10
                                bg-transparent
                                py-4
                                text-white
                                outline-none
                                placeholder:text-white/20
                            "
                        />

                        {/* TITLE */}

                        <input
                            value={title}
                            onChange={(e) =>
                                setTitle(
                                    e.target.value
                                )
                            }
                            maxLength={100}
                            placeholder="Title (optional)"
                            className="
                                mt-4
                                w-full
                                border-b
                                border-white/10
                                bg-transparent
                                py-4
                                text-white
                                outline-none
                                placeholder:text-white/20
                            "
                        />

                        {/* CONTENT */}

                        <textarea
                            autoFocus
                            value={content}
                            onChange={(e) =>
                                setContent(
                                    e.target.value
                                )
                            }
                            maxLength={2000}
                            rows={9}
                            placeholder="Jo kehna hai, keh do..."
                            className="
                                mt-6
                                w-full
                                resize-none
                                rounded-3xl
                                border
                                border-white/10
                                bg-white/[0.025]
                                p-6
                                text-[15px]
                                leading-7
                                text-white
                                outline-none
                                transition
                                focus:border-white/20
                                placeholder:text-white/20
                            "
                        />

                        {/* FOOTER */}

                        <div className="
                            mt-3
                            flex
                            flex-col
                            gap-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        ">

                            <span className="
                                text-xs
                                text-white/20
                            ">
                                {content.length}/2000
                            </span>

                            <button
                                type="button"
                                disabled={
                                    posting ||
                                    !content.trim()
                                }
                                onClick={() =>
                                    void createJournal()
                                }
                                className="
                                    rounded-full
                                    bg-white
                                    px-8
                                    py-3
                                    text-sm
                                    font-medium
                                    text-black
                                    transition
                                    hover:scale-105
                                    disabled:cursor-not-allowed
                                    disabled:opacity-30
                                "
                            >
                                {posting
                                    ? "POSTING..."
                                    : "POST"}
                            </button>

                        </div>

                        <p className="
                            mt-5
                            text-center
                            text-[10px]
                            leading-5
                            text-white/15
                        ">
                            Your post will appear publicly after
                            moderation.
                        </p>

                    </div>

                </div>
            )}

        </main>
    );
}