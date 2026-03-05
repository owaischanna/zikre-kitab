"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    BookOpen, Play, Users, Flame, Star, ChevronRight,
    Search, ArrowRight, Sparkles, Eye, Award, Heart, Quote
} from "lucide-react";

/* ── animated counter ─────────────────────────────────────── */
function useCounter(target, duration = 2000) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const inc = target / (duration / 16);
        const t = setInterval(() => {
            start += inc;
            if (start >= target) { setCount(target); clearInterval(t); }
            else setCount(Math.floor(start));
        }, 16);
        return () => clearInterval(t);
    }, [target, duration]);
    return count;
}

/* ── category emoji mapping ───────────────────────────────── */
const CAT_EMOJI = {
    "General Archive": "📚",
    "کتابوں پر تبصرہ": "📖",
    "یاد رفتگاں": "🕯️",
    "منتخب تحریریں": "✍️",
    "افسانہ زندگی کا": "📝",
    "کلام شاہ محی الحق فاروقی کے": "🌹",
    "کتابوں کے آئینے میں": "🪞",
};

/* ── gradient palette ─────────────────────────────────────── */
const PALETTES = [
    { grad: "from-rose-500 to-pink-600", bg: "bg-rose-50", border: "border-rose-100", accent: "text-rose-600", shadow: "shadow-rose-200/60" },
    { grad: "from-amber-500 to-orange-600", bg: "bg-amber-50", border: "border-amber-100", accent: "text-amber-600", shadow: "shadow-amber-200/60" },
    { grad: "from-emerald-500 to-teal-600", bg: "bg-emerald-50", border: "border-emerald-100", accent: "text-emerald-600", shadow: "shadow-emerald-200/60" },
    { grad: "from-blue-500 to-indigo-600", bg: "bg-blue-50", border: "border-blue-100", accent: "text-blue-600", shadow: "shadow-blue-200/60" },
    { grad: "from-purple-500 to-violet-600", bg: "bg-purple-50", border: "border-purple-100", accent: "text-purple-600", shadow: "shadow-purple-200/60" },
    { grad: "from-pink-500 to-fuchsia-600", bg: "bg-pink-50", border: "border-pink-100", accent: "text-pink-600", shadow: "shadow-pink-200/60" },
    { grad: "from-cyan-500 to-sky-600", bg: "bg-cyan-50", border: "border-cyan-100", accent: "text-cyan-600", shadow: "shadow-cyan-200/60" },
    { grad: "from-red-500 to-rose-700", bg: "bg-red-50", border: "border-red-100", accent: "text-red-600", shadow: "shadow-red-200/60" },
];

/* ── featured video thumbnail helper ──────────────────────── */
function ytThumb(url) {
    const m = url?.match(/(?:youtu\.be\/|v=)([^#&?]{11})/);
    return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : null;
}

/* ══════════════════════════════════════════════════════════════
   LANDING PAGE
   ══════════════════════════════════════════════════════════════ */
export default function LandingPage({
    totalVideos = 0,
    categories = [],
    featuredVideos = [],
}) {
    const [vis, setVis] = useState(false);
    const vidCount = useCounter(vis ? totalVideos : 0, 2000);
    const catCount = useCounter(vis ? categories.length : 0, 1500);
    const marqueeRef = useRef(null);

    useEffect(() => {
        const t = setTimeout(() => setVis(true), 200);
        return () => clearTimeout(t);
    }, []);

    /* ── Touch pause for mobile marquee ─────────────────────── */
    const pauseMarquee = useCallback(() => {
        if (marqueeRef.current) {
            marqueeRef.current.style.animationPlayState = "paused";
        }
    }, []);

    const resumeMarquee = useCallback(() => {
        if (marqueeRef.current) {
            marqueeRef.current.style.animationPlayState = "running";
        }
    }, []);

    // filter out "All Videos" for the grid
    const displayCats = categories.filter(c => c.id !== "All");

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans overflow-x-hidden">

            {/* ─── NAVBAR ───────────────────────────────────────── */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-red-200/50 flex-shrink-0">
                            <Image src="/kitab.png" alt="Zikre Kitab Logo" width={36} height={36} className="object-cover" priority />
                        </div>
                        <div className="leading-none">
                            <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight block">Zikre Kitab</span>
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[.25em] hidden sm:block">Literary Archive</span>
                        </div>
                    </Link>

                    <Link
                        href="/library"
                        className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs sm:text-sm font-bold rounded-full transition-all shadow-lg shadow-red-200/50 hover:shadow-red-300/60 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <Play className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Browse</span> Library
                    </Link>
                </div>
            </nav>

            {/* ─── HERO ─────────────────────────────────────────── */}
            <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-28 overflow-hidden">
                {/* Decorative blobs */}
                <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
                    <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-red-100 to-rose-50 rounded-full blur-3xl opacity-60" />
                    <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-gradient-to-tr from-amber-50 to-orange-50 rounded-full blur-3xl opacity-70" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-50 rounded-full blur-3xl opacity-40" />
                </div>

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
                    {/* Logo display */}
                    <div className="mx-auto mb-6 w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden shadow-2xl shadow-red-200/40 border-2 border-white ring-4 ring-red-100/50">
                        <Image src="/kitab.png" alt="Zikre Kitab" width={96} height={96} className="object-cover w-full h-full" priority />
                    </div>

                    {/* Pill badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-red-50 to-rose-50 border border-red-100/80 rounded-full text-red-600 text-[11px] font-bold mb-6 animate-pulse">
                        <Sparkles className="w-3.5 h-3.5" />
                        Pakistan&apos;s Premier Urdu Literary Archive
                    </div>

                    {/* Urdu title */}
                    <h1
                        className="text-5xl sm:text-6xl md:text-8xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-red-700 bg-clip-text text-transparent leading-none mb-3"
                        dir="rtl"
                        lang="ur"
                    >
                        ذِکرِ کتاب
                    </h1>

                    <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight mb-4">
                        Where Books Come <span className="text-red-600">Alive</span>
                    </p>

                    <p className="text-slate-500 text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10">
                        Discover our curated world of book reviews, literary interviews, biographies &amp; Urdu poetry — beautifully organised for you.
                    </p>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-14">
                        <Link
                            href="/library"
                            className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black rounded-full text-sm transition-all shadow-2xl shadow-red-200/60 hover:shadow-red-300/70 hover:-translate-y-0.5"
                        >
                            <Play className="w-5 h-5" />
                            Explore Full Library
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a
                            href="#collections"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-full text-sm transition-all border border-slate-200 shadow-sm"
                        >
                            <BookOpen className="w-4 h-4" />
                            View Collections
                        </a>
                    </div>

                    {/* Animated stats */}
                    <div className={`grid grid-cols-3 gap-4 sm:gap-10 max-w-lg mx-auto transition-all duration-1000 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                        {[
                            { val: vidCount.toLocaleString() + "+", label: "Sessions", icon: <Play className="w-3.5 h-3.5" />, color: "text-red-600", bg: "bg-red-50" },
                            { val: catCount + "+", label: "Collections", icon: <Flame className="w-3.5 h-3.5" />, color: "text-amber-500", bg: "bg-amber-50" },
                            { val: "∞", label: "Hours", icon: <Eye className="w-3.5 h-3.5" />, color: "text-purple-600", bg: "bg-purple-50" },
                        ].map((s, i) => (
                            <div key={i} className={`${s.bg} rounded-2xl sm:rounded-3xl p-3 sm:p-5 text-center border border-white shadow-sm`}>
                                <div className={`text-2xl sm:text-4xl font-black ${s.color}`}>{s.val}</div>
                                <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center justify-center gap-1">
                                    {s.icon} {s.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── FEATURE CARDS ────────────────────────────────── */}
            <section className="py-12 sm:py-16 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        {[
                            { icon: <BookOpen className="w-6 h-6" />, color: "text-red-500", bg: "bg-red-50", title: "Book Reviews", desc: "In-depth analysis of Urdu & literary classics by expert reviewers." },
                            { icon: <Users className="w-6 h-6" />, color: "text-amber-500", bg: "bg-amber-50", title: "Author Interviews", desc: "Exclusive conversations with Pakistan's celebrated writers & poets." },
                            { icon: <Star className="w-6 h-6" />, color: "text-purple-500", bg: "bg-purple-50", title: "Life Stories", desc: "Biographies and memoirs of influential thinkers & literary icons." },
                        ].map((f, i) => (
                            <div
                                key={i}
                                className="group flex items-start gap-4 p-5 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className={`w-11 h-11 sm:w-12 sm:h-12 ${f.bg} rounded-2xl flex items-center justify-center flex-shrink-0 ${f.color}`}>{f.icon}</div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1">{f.title}</h3>
                                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── FEATURED VIDEOS — INFINITE MARQUEE ─────────── */}
            {featuredVideos.length > 0 && (
                <section className="py-14 sm:py-20 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-100 rounded-full text-red-600 text-[10px] font-bold uppercase tracking-widest mb-3">
                                <Flame className="w-3 h-3" /> Trending Now
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Popular Sessions</h2>
                            <p className="text-slate-400 text-xs mt-2">Touch or hover to pause • Click to watch</p>
                        </div>
                    </div>

                    {/* Marquee container */}
                    <div
                        className="marquee-wrapper relative overflow-hidden"
                        onMouseEnter={pauseMarquee}
                        onMouseLeave={resumeMarquee}
                        onTouchStart={pauseMarquee}
                        onTouchEnd={resumeMarquee}
                    >
                        {/* Edge fade overlays */}
                        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#fafafa] to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#fafafa] to-transparent z-10 pointer-events-none" />

                        {/* Scrolling track */}
                        <div ref={marqueeRef} className="marquee-track gap-4 sm:gap-5">
                            {/* Render videos twice for seamless loop */}
                            {[...featuredVideos, ...featuredVideos].map((v, i) => {
                                const thumb = ytThumb(v["Video url"]);
                                return (
                                    <a
                                        key={i}
                                        href={v["Video url"]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative flex-shrink-0 w-[260px] sm:w-[320px] rounded-2xl overflow-hidden bg-slate-100 aspect-video shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                                    >
                                        {thumb && (
                                            <img
                                                src={thumb}
                                                alt={v.Title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                                            <p className="text-white text-xs sm:text-sm font-bold line-clamp-2 leading-snug" dir="auto">{v.Title}</p>
                                            <div className="flex items-center gap-2 mt-1.5 text-white/70 text-[10px] font-bold">
                                                <Eye className="w-3 h-3" /> {Number(v.Views).toLocaleString()} views
                                            </div>
                                        </div>
                                        <div className="absolute top-2 right-2 w-8 h-8 bg-red-600/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                            <Play className="w-3.5 h-3.5 text-white ml-0.5" />
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* ─── URDU QUOTE BANNER ────────────────────────────── */}
            <section className="py-10 sm:py-14 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    <div className="absolute top-0 left-1/4 w-64 h-64 bg-red-500/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-3xl mx-auto px-6 text-center">
                    <Quote className="w-8 h-8 text-red-500/40 mx-auto mb-4" />
                    <blockquote className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-snug mb-3" dir="rtl" lang="ur">
                        &ldquo;کتاب ایک ایسا باغ ہے جو جیب میں رکھا جا سکتا ہے&rdquo;
                    </blockquote>
                    <cite className="text-slate-400 text-xs sm:text-sm font-bold not-italic">— Arabic Proverb</cite>
                </div>
            </section>

            {/* ─── QUICK ACCESS — SCROLL BANNERS (Design Inspired) ── */}
            <section className="py-14 sm:py-20 islamic-pattern-bg relative overflow-hidden">
                {/* Decorative corner ornaments */}
                <div className="absolute top-0 left-0 w-32 h-32 opacity-10 pointer-events-none" aria-hidden="true">
                    <div className="w-full h-full border-t-4 border-l-4 border-amber-700/30 rounded-tl-3xl" />
                </div>
                <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10 pointer-events-none" aria-hidden="true">
                    <div className="w-full h-full border-b-4 border-r-4 border-amber-700/30 rounded-br-3xl" />
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    {/* Section heading */}
                    <div className="text-center mb-10 sm:mb-14">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur border border-amber-200/80 rounded-full text-amber-800 text-[10px] font-bold uppercase tracking-widest mb-4">
                            <Sparkles className="w-3.5 h-3.5 text-red-600" /> Quick Access
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                            Browse Popular Topics
                        </h2>
                        <p className="text-amber-900/60 text-sm sm:text-base mt-3 max-w-lg mx-auto">
                            Jump straight to your favourite collection — each banner takes you directly to filtered sessions.
                        </p>
                    </div>

                    {/* Scroll banner grid — 2 columns */}
                    <div className="grid grid-cols-2 gap-4 sm:gap-5 max-w-3xl mx-auto mb-10 sm:mb-14">
                        {displayCats.slice(0, 10).map((cat, i) => {
                            const emoji = CAT_EMOJI[cat.name] || "📁";
                            return (
                                <Link
                                    key={cat.id}
                                    href={`/library?category=${encodeURIComponent(cat.id)}`}
                                    className="scroll-banner"
                                >
                                    <span className="ribbon-highlight top" />
                                    <span className="ribbon-highlight bottom" />
                                    <span className="flex items-center gap-2 justify-center flex-wrap">
                                        <span className="text-lg sm:text-xl">{emoji}</span>
                                        <span className="text-xs sm:text-sm leading-tight" dir="auto">{cat.name}</span>
                                        <span className="text-[9px] sm:text-[10px] opacity-70 font-normal">({cat.count})</span>
                                    </span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Golden search bar */}
                    <div className="max-w-xl mx-auto">
                        <Link
                            href="/library"
                            className="golden-search flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4"
                        >
                            <Search className="w-5 h-5 text-amber-900/60 flex-shrink-0" />
                            <span className="text-amber-900/80 text-sm sm:text-base font-bold">
                                Search All {totalVideos.toLocaleString()} Sessions...
                            </span>
                            <ArrowRight className="w-4 h-4 text-amber-900/50 ml-auto" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ─── ZIKREKITAB FAMILY GROUPS ─────────────────────── */}
            <section className="py-12 sm:py-16 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-y border-slate-100">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-8 sm:mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-4">
                            <Users className="w-3.5 h-3.5 text-red-500" /> Also Check
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Zikrekitab Family Groups
                        </h2>
                        <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
                            Explore our sister initiatives for holistic learning and growth.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8 max-w-2xl mx-auto">
                        {/* ASK Card */}
                        <a
                            href="https://www.youtube.com/@ZikreKitab"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="family-card ask-card group"
                        >
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                            <div className="relative">
                                <div className="text-4xl sm:text-5xl font-black tracking-tighter mb-1" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.3)' }}>
                                    ASK
                                </div>
                                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider opacity-90">
                                    Attitude, Skills &amp; Knowledge
                                </div>
                                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-bold opacity-80 group-hover:opacity-100 transition-opacity">
                                    <Play className="w-3 h-3" /> Watch Now
                                </div>
                            </div>
                        </a>

                        {/* BLJ Card */}
                        <a
                            href="https://www.youtube.com/@ZikreKitab"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="family-card blj-card group"
                        >
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                            <div className="relative">
                                <div className="text-4xl sm:text-5xl font-black tracking-tighter mb-1" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.3)' }}>
                                    BLJ
                                </div>
                                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider opacity-90">
                                    Beyond Legal Jargon
                                </div>
                                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-bold opacity-80 group-hover:opacity-100 transition-opacity">
                                    <Play className="w-3 h-3" /> Watch Now
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            {/* ─── COLLECTIONS GRID ─────────────────────────────── */}
            <section id="collections" className="py-14 sm:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-10 sm:mb-14">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-4">
                            <Award className="w-3.5 h-3.5 text-red-500" /> Our Collections
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                            Explore by Category
                        </h2>
                        <p className="text-slate-500 text-sm sm:text-base mt-3 max-w-lg mx-auto">
                            Dive into curated collections spanning book reviews, poetry, biographies, and much more.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                        {displayCats.map((cat, i) => {
                            const p = PALETTES[i % PALETTES.length];
                            const emoji = CAT_EMOJI[cat.name] || "📁";
                            return (
                                <Link
                                    key={cat.id}
                                    href={`/library?category=${encodeURIComponent(cat.id)}`}
                                    className={`group relative p-4 sm:p-8 bg-white rounded-2xl sm:rounded-[2rem] border ${p.border} hover:shadow-2xl ${p.shadow} transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
                                >
                                    <div className={`absolute -top-10 -right-10 w-32 h-32 ${p.bg} rounded-full blur-2xl opacity-50 group-hover:opacity-80 transition-opacity`} />
                                    <div className="relative">
                                        <span className="text-2xl sm:text-4xl block mb-2 sm:mb-3">{emoji}</span>
                                        <h3 className="font-black text-slate-900 text-sm sm:text-lg mb-1 leading-tight" dir="auto">{cat.name}</h3>
                                        <p className={`text-xl sm:text-3xl font-black ${p.accent} mb-0.5 sm:mb-1`}>{cat.count.toLocaleString()}</p>
                                        <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3 sm:mb-5">Sessions</p>
                                        <span className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r ${p.grad} text-white text-[10px] sm:text-xs font-bold rounded-full shadow-lg group-hover:gap-3 transition-all`}>
                                            Browse <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="text-center mt-10 sm:mt-14">
                        <Link
                            href="/library"
                            className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-full text-sm transition-all shadow-xl hover:-translate-y-0.5"
                        >
                            <Search className="w-4 h-4" />
                            Search All {totalVideos.toLocaleString()} Sessions
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ─── MISSION / ABOUT ──────────────────────────────── */}
            <section className="py-14 sm:py-20 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-50 border border-rose-100 rounded-full text-rose-600 text-[10px] font-bold uppercase tracking-widest mb-6">
                        <Heart className="w-3.5 h-3.5" /> Our Mission
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-4" dir="rtl" lang="ur">
                        اردو ادب کو فروغ دینا ہمارا مشن ہے
                    </h2>
                    <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8">
                        Zikre Kitab is dedicated to preserving and promoting Urdu literary heritage. Through book reviews, insightful author interviews, and biographies of influential thinkers, we aim to inspire a lifelong love of reading.
                    </p>
                    <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-lg border-2 border-white ring-4 ring-rose-100/50">
                        <Image src="/kitab.png" alt="Zikre Kitab" width={80} height={80} className="object-cover w-full h-full" />
                    </div>
                </div>
            </section>

            {/* ─── FOOTER ───────────────────────────────────────── */}
            <footer className="bg-slate-900 text-white py-10 sm:py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden">
                                <Image src="/kitab.png" alt="Zikre Kitab" width={40} height={40} className="object-cover" />
                            </div>
                            <div>
                                <div className="font-black text-xl tracking-tight">Zikre Kitab</div>
                                <div className="text-slate-400 text-[10px] uppercase tracking-widest">Literary Archive</div>
                            </div>
                        </div>

                        <p className="text-slate-400 text-sm text-center" dir="rtl" lang="ur">
                            اردو ادب کو فروغ دینے کے لیے وقف ایک ادبی پلیٹ فارم
                        </p>

                        <Link
                            href="/library"
                            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-full text-sm font-bold transition-all"
                        >
                            <Play className="w-4 h-4" /> Enter Library
                        </Link>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-800 text-center text-slate-500 text-xs">
                        © {new Date().getFullYear()} Zikre Kitab — All rights reserved | By Tasnim Farouqi
                    </div>
                </div>
            </footer>
        </div>
    );
}
