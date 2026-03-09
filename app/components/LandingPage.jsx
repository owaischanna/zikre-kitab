"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    BookOpen, Play, Users, Flame, Star, ChevronRight,
    Search, ArrowRight, Sparkles, Eye, Award, Heart, Quote,
    Menu, X, Youtube, Home, Facebook
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
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const vidCount = useCounter(vis ? totalVideos : 0, 2000);
    const catCount = useCounter(vis ? categories.length : 0, 1500);
    const marqueeRef = useRef(null);

    useEffect(() => {
        const t = setTimeout(() => setVis(true), 200);
        return () => clearTimeout(t);
    }, []);

    /* ── Scroll-aware navbar ────────────────────────────────── */
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
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

    /* nav links data */
    const navLinks = [
        { label: "Home", href: "/", icon: <Home className="w-4 h-4" /> },
        { label: "Library", href: "/library", icon: <Play className="w-4 h-4" /> },
        { label: "Collections", href: "#collections", icon: <BookOpen className="w-4 h-4" /> },
        { label: "About", href: "#about", icon: <Heart className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans overflow-x-hidden">

            {/* ─── NAVBAR ───────────────────────────────────────── */}
            <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-2xl shadow-lg shadow-slate-200/40 border-b border-slate-100" : "bg-white/90 backdrop-blur-xl border-b border-transparent"}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow-md shadow-red-200/50 flex-shrink-0 border border-white">
                            <Image src="/kitab.png" alt="Zikre Kitab Logo" width={44} height={44} className="object-cover" priority />
                        </div>
                        <div className="leading-none pt-1">
                            <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight block">Zikre Kitab</span>
                            <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] block mt-0.5">Literary Archive</span>
                        </div>
                    </Link>

                    {/* Desktop nav links */}
                    <div className="hidden md:flex items-center gap-4 lg:gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-red-600 transition-colors uppercase tracking-wider"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTA + Mobile hamburger */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Link
                            href="/library"
                            className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-black rounded-full transition-all shadow-lg shadow-red-200/50 hover:shadow-red-300/60 hover:-translate-y-0.5"
                        >
                            <Play className="w-3.5 h-3.5" />
                            Browse Library
                        </Link>

                        {/* Mobile hamburger button */}
                        <button
                            onClick={() => setMenuOpen(true)}
                            className="md:hidden flex items-center justify-center w-10 h-10 text-slate-900 hover:text-red-600 transition-colors"
                            aria-label="Open menu"
                        >
                            <Menu className="w-7 h-7" />
                        </button>
                    </div>
                </div>

                {/* Mobile Full-Screen Menu Overlay */}
                <div
                    className={`md:hidden fixed inset-0 w-full h-[100dvh] bg-[#0a0f1c] z-[99999] transition-all duration-500 ease-in-out flex flex-col items-center justify-center ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
                >
                    {/* Top Header of Mernly-style Overlay */}
                    <div className="absolute top-0 inset-x-0 h-16 sm:h-20 px-4 sm:px-6 flex items-center justify-between border-b border-white/5">
                        {/* Logo inside mobile menu */}
                        <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3">
                            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow-md shadow-red-200/50 flex-shrink-0 border border-white">
                                <Image src="/kitab.png" alt="Zikre Kitab Logo" width={44} height={44} className="object-cover" priority />
                            </div>
                            <div className="leading-none pt-1">
                                <span className="text-base sm:text-lg font-black text-white tracking-widest block italic">ZIKRE KITAB</span>
                            </div>
                        </Link>

                        <button
                            onClick={() => setMenuOpen(false)}
                            className="p-2 text-white hover:text-red-500 transition-colors"
                            aria-label="Close menu"
                        >
                            <X className="w-8 h-8" strokeWidth={3} />
                        </button>
                    </div>

                    <div className="flex flex-col items-center space-y-8 w-full px-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className="text-4xl sm:text-5xl font-black text-white hover:text-blue-500 transition-colors uppercase tracking-widest"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-10 w-full max-w-xs sm:max-w-sm">
                            <Link
                                href="/library"
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center justify-center w-full py-4 sm:py-5 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-black rounded-full transition-all tracking-widest uppercase shadow-xl shadow-blue-500/20"
                            >
                                BROWSE LIBRARY
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ─── HERO ─────────────────────────────────────────── */}
            <section className="relative pt-20 sm:pt-22 pb-8 sm:pb-12 overflow-hidden">
                {/* Decorative blobs */}
                <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
                    <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-red-100 to-rose-50 rounded-full blur-3xl opacity-50" />
                    <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-gradient-to-tr from-amber-50 to-orange-50 rounded-full blur-3xl opacity-60" />
                </div>

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6">

                    {/* ── Centered Headline ── */}
                    <div className="text-center mb-6 sm:mb-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-red-50 to-rose-50 border border-red-100/80 rounded-full text-red-600 text-[11px] font-bold mb-3 animate-glow">
                            <Sparkles className="w-3.5 h-3.5" />
                            Pakistan&apos;s Premier Urdu Literary Archive
                        </div>

                        {/* Urdu title */}
                        <h1
                            className="text-4xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-red-700 bg-clip-text text-transparent leading-none mb-2"
                            dir="rtl"
                            lang="ur"
                        >
                            ذِکرِ کتاب
                        </h1>

                        <p className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight mb-3">
                            Where Books Come <span className="text-red-600">Alive</span>
                        </p>

                        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                            Discover our curated world of book reviews, literary interviews, biographies &amp; Urdu poetry — beautifully organised for you.
                        </p>
                    </div>

                    {/* ── Moving Beta Banner ── */}
                    <div className="mb-8 relative overflow-hidden marquee-wrapper py-2">
                        {/* Edge fade overlays */}
                        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#fafafa] to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#fafafa] to-transparent z-10 pointer-events-none" />

                        <div className="marquee-track gap-12 sm:gap-16">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex-shrink-0 text-red-500/80 text-xs sm:text-sm font-black tracking-widest uppercase">
                                    Beta version is currently under development. Ongoing changes and improvements are expected.
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Top Social Row ── */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-8 flex-wrap justify-center">
                        <a
                            href="https://www.youtube.com/@ilmohunar4884"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-wrap items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white rounded-full transition-all shadow-xl shadow-pink-200/50 hover:shadow-pink-300/60 hover:-translate-y-0.5"
                        >
                            <span className="text-sm font-black tracking-tight">ASK</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-white/50 hidden sm:inline-block" />
                            <span className="text-xs font-black tracking-tight">Attitude, Skills & Knowledge</span>
                            <Play className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <div className="flex items-center gap-2.5 flex-wrap justify-center">
                            <a
                                href="https://www.youtube.com/@ZikreKitab"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-[11px] font-black rounded-full shadow-lg shadow-blue-200/50 transition-all hover:-translate-y-0.5"
                            >
                                <Youtube className="w-4 h-4 text-white" />
                                Zikre Kitab YT
                            </a>
                            <a
                                href="https://www.facebook.com/share/g/14Wco2PCiQ8/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-[11px] font-black rounded-full shadow-lg shadow-blue-200/50 transition-all hover:-translate-y-0.5"
                            >
                                <Facebook className="w-3.5 h-3.5 text-white" />
                                Zikre Kitab FB Group
                            </a>
                            <a
                                href="https://www.facebook.com/share/1SFQcSuNrU/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-[11px] font-black rounded-full shadow-lg shadow-blue-200/50 transition-all hover:-translate-y-0.5"
                            >
                                <Facebook className="w-3.5 h-3.5 text-white" />
                                Contact Admin
                            </a>
                        </div>
                    </div>

                    {/* ── Two Column: Categories + Video ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">

                        {/* Left: Search + Categories + CTA (3 cols) */}
                        <div className="lg:col-span-3 flex flex-col gap-6">

                            {/* Search bar */}
                            <Link
                                href="/library"
                                className="group flex items-center gap-3 px-6 py-4 bg-white border-2 border-slate-200 hover:border-red-300 rounded-2xl shadow-lg shadow-slate-200/30 hover:shadow-red-100/30 transition-all"
                            >
                                <Search className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors flex-shrink-0" />
                                <span className="text-slate-400 group-hover:text-slate-600 font-semibold transition-colors">
                                    Search {totalVideos.toLocaleString()} Sessions...
                                </span>
                                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-red-500 ml-auto transition-colors" />
                            </Link>

                            {/* Category pills */}
                            <div className="flex flex-wrap gap-2">
                                {displayCats.slice(0, 5).map((cat) => {
                                    const emoji = CAT_EMOJI[cat.name] || "📁";
                                    return (
                                        <Link
                                            key={cat.id}
                                            href={`/library?category=${encodeURIComponent(cat.id)}`}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-red-300 hover:bg-red-50/50 rounded-xl text-xs font-bold text-slate-600 hover:text-red-600 transition-all shadow-sm"
                                        >
                                            <span className="text-sm">{emoji}</span>
                                            <span dir="auto">{cat.name}</span>
                                        </Link>
                                    );
                                })}
                                <Link
                                    href="#collections"
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-xl text-xs font-bold text-slate-500 hover:text-red-500 transition-all shadow-sm"
                                >
                                    More <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>

                            {/* Divider */}
                            <div className="hidden lg:block border-t border-slate-200/60 my-2" />

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link
                                    href="/library"
                                    className="flex-1 group flex items-center justify-center gap-2.5 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black rounded-xl transition-all shadow-xl shadow-red-200/50 hover:shadow-red-300/60 hover:-translate-y-0.5"
                                >
                                    <Play className="w-4 h-4" />
                                    Explore Full Library
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <a
                                    href="#collections"
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-all border-2 border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                                >
                                    <BookOpen className="w-4 h-4" />
                                    View Collections
                                </a>
                            </div>

                            {/* Stats */}
                            <div className={`grid grid-cols-3 gap-3 transition-all duration-1000 mt-2 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                                {[
                                    { val: vidCount.toLocaleString() + "+", label: "Sessions", icon: <Play className="w-4 h-4" />, color: "text-red-600", bg: "bg-red-50" },
                                    { val: catCount + "+", label: "Collections", icon: <Flame className="w-4 h-4" />, color: "text-amber-500", bg: "bg-amber-50" },
                                    { val: "∞", label: "Hours", icon: <Eye className="w-4 h-4" />, color: "text-purple-600", bg: "bg-purple-50" },
                                ].map((s, i) => (
                                    <div key={i} className={`${s.bg} rounded-2xl p-4 text-center border-2 border-white shadow-md hover:shadow-xl transition-all hover:-translate-y-1`}>
                                        <div className={`text-2xl font-black ${s.color}`}>{s.val}</div>
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1.5 flex items-center justify-center gap-1">
                                            {s.icon} {s.label}
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>

                        {/* Right: Videos (2 cols) */}
                        <div className="lg:col-span-2 flex flex-col gap-4">
                            <p className="text-center text-xs font-black text-slate-500 uppercase tracking-widest mb-1 mt-1 sm:mt-0">
                                Featured Previews
                            </p>

                            {/* Video 1 */}
                            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-slate-300/30 border-2 border-white bg-slate-100" style={{ aspectRatio: '16 / 9' }}>
                                <iframe
                                    src="https://www.youtube.com/embed/1mVZ76fnJLY?rel=0&modestbranding=1"
                                    title="Zikre Kitab - Preview 1"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className="absolute inset-0 w-full h-full"
                                    loading="lazy"
                                />
                            </div>

                            {/* Video 2 */}
                            {featuredVideos && featuredVideos.length > 0 && (
                                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-slate-300/30 border-2 border-white bg-slate-100" style={{ aspectRatio: '16 / 9' }}>
                                    <iframe
                                        src={`https://www.youtube.com/embed/${featuredVideos[0]["Video url"]?.match(/(?:youtu\.be\/|v=)([^#&?]{11})/) ? featuredVideos[0]["Video url"]?.match(/(?:youtu\.be\/|v=)([^#&?]{11})/)[1] : '8-WpW11Vw5A'}?rel=0&modestbranding=1`}
                                        title="Zikre Kitab - Preview 2"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                        className="absolute inset-0 w-full h-full"
                                        loading="lazy"
                                    />
                                </div>
                            )}
                        </div>
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
                                className="group flex items-start gap-4 p-5 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-red-100/30 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
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





            {/* ─── COLLECTIONS — HORIZONTAL CARD STRIP ────────── */}
            <section id="collections" className="py-14 sm:py-20 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    {/* Header row */}
                    <div className="flex items-end justify-between mb-8 sm:mb-10">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-3">
                                <Award className="w-3 h-3 text-red-500" /> Collections
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                                Explore by Category
                            </h2>
                        </div>
                        <Link
                            href="/library"
                            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-full transition-all hover:-translate-y-0.5 shadow-lg"
                        >
                            View All <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>

                {/* Scrollable strip */}
                <div className="relative">
                    {/* Edge fades */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                    <div className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar px-4 sm:px-6 pb-4">
                        {displayCats.map((cat, i) => {
                            const p = PALETTES[i % PALETTES.length];
                            const emoji = CAT_EMOJI[cat.name] || "📁";
                            return (
                                <Link
                                    key={cat.id}
                                    href={`/library?category=${encodeURIComponent(cat.id)}`}
                                    className={`group relative flex-shrink-0 w-[180px] sm:w-[220px] p-5 sm:p-6 bg-white rounded-2xl border ${p.border} hover:shadow-xl ${p.shadow} transition-all duration-300 hover:-translate-y-1.5 overflow-hidden`}
                                >
                                    {/* Gradient blob */}
                                    <div className={`absolute -top-8 -right-8 w-24 h-24 ${p.bg} rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity`} />
                                    <div className="relative">
                                        <span className="text-2xl sm:text-3xl block mb-2">{emoji}</span>
                                        <h3 className="font-bold text-slate-900 text-xs sm:text-sm mb-1.5 leading-tight line-clamp-2" dir="auto">{cat.name}</h3>
                                        <div className="flex items-baseline gap-1.5 mb-3">
                                            <span className={`text-xl sm:text-2xl font-black ${p.accent}`}>{cat.count.toLocaleString()}</span>
                                            <span className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-widest">sessions</span>
                                        </div>
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r ${p.grad} text-white text-[10px] font-bold rounded-full shadow-md group-hover:gap-2.5 transition-all`}>
                                            Browse <ChevronRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}

                        {/* Browse All — end card */}
                        <Link
                            href="/library"
                            className="group flex-shrink-0 w-[160px] sm:w-[180px] flex flex-col items-center justify-center p-5 sm:p-6 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-all duration-300 hover:-translate-y-1.5"
                        >
                            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Search className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-sm font-black text-slate-900">Browse All</span>
                            <span className="text-[10px] text-slate-400 font-bold mt-0.5">{totalVideos.toLocaleString()} Sessions</span>
                        </Link>
                    </div>
                </div>

                {/* Mobile: View All button */}
                <div className="sm:hidden text-center mt-6 px-4">
                    <Link
                        href="/library"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-full transition-all shadow-lg"
                    >
                        <Search className="w-3.5 h-3.5" />
                        View All Sessions
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </section>

            {/* ─── MISSION / ABOUT ──────────────────────────────── */}
            <section id="about" className="py-14 sm:py-20 bg-gradient-to-b from-slate-50 to-white">
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
