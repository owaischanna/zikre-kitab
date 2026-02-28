"use client";
import React, { useState, useMemo, useEffect, useTransition } from 'react';
import Fuse from 'fuse.js';
import { 
  Search, Youtube, Copy, Check, Share2, Facebook, Instagram,
  MessageCircle, Filter, Menu, X, ChevronLeft, ChevronRight,
  Loader2, Eye, BookOpen, LayoutGrid, List, Flame
} from 'lucide-react';

export default function VideoLibrary() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isPending, startTransition] = useTransition();

    const [selectedCat, setSelectedCat] = useState('All');
    const [copiedId, setCopiedId] = useState(null);
    const [activeShare, setActiveShare] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); 
    const [sortBy, setSortBy] = useState('views');
    
    const videosPerPage = 12;

    // --- UPDATED CATEGORIES BASED ON EXCEL SERIES ---
    const categories = [
        { id: 'All', name: 'All Videos', icon: '🌍' },
        { id: 'Afsana Zindagi Ka', name: 'Afsana Zindagi Ka', icon: '👤' },
        { id: 'Book Reviews', name: 'Book Reviews', icon: '📚' },
        { id: 'Shah Mohi-ul-Haq Columns', name: 'Shah Columns', icon: '✍️' },
        { id: 'Yaad-e-Raftagan', name: 'Yaad-e-Raftagan', icon: '🕊️' },
        { id: 'Selected Readings', name: 'Selected Readings', icon: '✨' },
        { id: 'Archive', name: 'General Archive', icon: '📦' },
    ];

    // --- HELPER TO MAP EXCEL SERIES TO UI CATEGORIES ---
    const processVideos = (rawVideos) => {
        return rawVideos.map(video => {
            let category = 'Archive';
            const series = video.Series || '';

            if (series.includes('افسانہ زندگی کا')) {
                category = 'Afsana Zindagi Ka';
            } else if (series.includes('کتابوں پر تبصرہ') || series.includes('کتابوں کے آئینے میں')) {
                category = 'Book Reviews';
            } else if (series.includes('کالم شاہ محی الحق فاروقی کے')) {
                category = 'Shah Mohi-ul-Haq Columns';
            } else if (series.includes('یاد رفتگاں')) {
                category = 'Yaad-e-Raftagan';
            } else if (series.includes('منتخب تحریں')) {
                category = 'Selected Readings';
            }

            return { ...video, Category: category };
        });
    };

    useEffect(() => {
        async function loadVideos() {
            try {
                const res = await fetch('/api');
                const data = await res.json();
                if (Array.isArray(data)) {
                    const processed = processVideos(data);
                    setVideos(processed);
                }
            } catch (err) { 
                console.error("Failed to load archive:", err); 
            } finally { 
                setLoading(false); 
            }
        }
        loadVideos();
    }, []);

    const categoryCounts = useMemo(() => {
        const counts = { All: videos.length };
        videos.forEach(v => {
            counts[v.Category] = (counts[v.Category] || 0) + 1;
        });
        return counts;
    }, [videos]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        startTransition(() => {
            setSearchQuery(value);
            setCurrentPage(1);
        });
    };

    const getViewHighlight = (views) => {
        const v = Number(views) || 0;
        if (v >= 1000) return { color: 'text-red-600', badge: '🔥 POPULAR', bg: 'bg-red-50 border-red-200' };
        if (v >= 500) return { color: 'text-orange-600', badge: '⭐ TRENDING', bg: 'bg-orange-50 border-orange-200' };
        return { color: 'text-slate-500', badge: null, bg: '' };
    };

    const filteredVideos = useMemo(() => {
        let result = selectedCat === 'All' ? [...videos] : videos.filter(v => v.Category === selectedCat);
        if (searchQuery.trim()) {
            const fuse = new Fuse(result, { keys: ['Title', 'Guest', 'Tag 1'], threshold: 0.4 });
            result = fuse.search(searchQuery).map(r => r.item);
        }
        return result.sort((a, b) => {
            if (sortBy === 'newest') return new Date(b['Uploaded Time'] || 0) - new Date(a['Uploaded Time'] || 0);
            if (sortBy === 'views') return (Number(b.Views) || 0) - (Number(a.Views) || 0);
            return a.Title.localeCompare(b.Title);
        });
    }, [searchQuery, selectedCat, videos, sortBy]);

    const currentVideos = filteredVideos.slice((currentPage - 1) * videosPerPage, currentPage * videosPerPage);
    const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

    const getYouTubeID = (url) => {
        const match = url?.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleShare = async (platform, url, title) => {
        const encodedUrl = encodeURIComponent(url);
        const encodedTitle = encodeURIComponent(title);
        if (platform === 'whatsapp') window.open(`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`, '_blank');
        else if (platform === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
        else if (platform === 'instagram') {
            if (navigator.share) await navigator.share({ title, url });
            else { navigator.clipboard.writeText(url); alert("Link copied!"); }
        }
        setActiveShare(null);
    };

    if (loading) return (
        <div className="h-screen bg-slate-50 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
            <p className="mt-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Syncing Archive...</p>
        </div>
    );

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden font-sans relative">
            
            <header className="h-20 flex-shrink-0 bg-white border-b border-slate-200 z-[60] flex items-center px-4 md:px-8 justify-between gap-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => setShowMobileFilters(true)} className="lg:hidden p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100 active:scale-90 transition-all">
                        <Menu className="w-6 h-6 text-slate-800" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-br from-red-500 to-red-700 rounded-xl shadow-lg hidden sm:block">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div className="leading-tight">
                            <h1 className="text-xl font-black tracking-tighter text-slate-900">ZIKRE KITAB</h1>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Library & Archive</p>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:block relative flex-1 max-w-2xl">
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isPending ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
                    <input
                        type="text" placeholder="Search titles, guests, or series..." className="w-full p-3.5 pl-12 rounded-2xl bg-slate-100 border-none focus:ring-4 focus:ring-red-600/10 text-sm transition-all focus:bg-white"
                        value={query} onChange={handleSearchChange} dir="auto"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-red-600 border border-transparent hover:border-red-100 transition-all">
                        {viewMode === 'grid' ? <List className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                <aside className="hidden lg:block w-72 h-full bg-white border-r border-slate-200 p-6 overflow-y-auto">
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-l-4 border-red-600 pl-3">Series Collections</h3>
                            <div className="space-y-1">
                                {categories.map(cat => (
                                    <button key={cat.id} onClick={() => {setSelectedCat(cat.id); setCurrentPage(1);}}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${selectedCat === cat.id ? 'bg-red-600 text-white shadow-xl shadow-red-200' : 'hover:bg-slate-50 text-slate-600'}`}>
                                        <div className="flex items-center gap-3"><span className="text-xl">{cat.icon}</span><span className="font-bold text-sm tracking-tight">{cat.name}</span></div>
                                        <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${selectedCat === cat.id ? 'bg-white/20' : 'bg-slate-100'}`}>{categoryCounts[cat.id] || 0}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 border-l-4 border-slate-200 pl-3">Sort By</h3>
                            <select className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 focus:ring-red-100 appearance-none" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option value="views">🔥 Most Viewed</option>
                                <option value="newest">📅 Latest First</option>
                                <option value="title">🔤 Title A-Z</option>
                            </select>
                        </div>
                    </div>
                </aside>

                <main className="flex-1 h-full overflow-y-auto p-4 md:p-8 pb-32 lg:pb-8 custom-scrollbar scroll-smooth">
                    <div className="max-w-6xl mx-auto">
                        <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                            {currentVideos.map((video, i) => {
                                const videoId = getYouTubeID(video['Video url']);
                                const globalIdx = (currentPage - 1) * videosPerPage + i;
                                const h = getViewHighlight(video.Views);
                                return (
                                    <div key={globalIdx} className={`group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col relative`}>
                                        <div className={`relative bg-slate-200 aspect-video overflow-hidden`}>
                                            {videoId && <img src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" alt="v" />}
                                            {h.badge && <div className="absolute top-3 left-3 px-3 py-1 bg-red-600 text-white text-[8px] font-black rounded-full shadow-lg animate-pulse z-10">{h.badge}</div>}
                                            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[9px] px-2 py-1 rounded font-bold">{video.Duration}</div>
                                            <button onClick={() => setActiveShare(activeShare === globalIdx ? null : globalIdx)} className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-md z-10 hover:bg-red-600 hover:text-white transition-all"><Share2 className="w-4 h-4" /></button>

                                            {activeShare === globalIdx && (
                                                <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center gap-4 z-20 animate-in fade-in duration-300">
                                                    <button onClick={() => handleShare('whatsapp', video['Video url'], video.Title)} className="p-3 bg-green-500 text-white rounded-full shadow-lg"><MessageCircle className="w-6 h-6" /></button>
                                                    <button onClick={() => handleShare('facebook', video['Video url'], video.Title)} className="p-3 bg-blue-600 text-white rounded-full shadow-lg"><Facebook className="w-6 h-6" /></button>
                                                    <button onClick={() => handleShare('instagram', video['Video url'], video.Title)} className="p-3 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white rounded-full shadow-lg"><Instagram className="w-6 h-6" /></button>
                                                    <button onClick={() => setActiveShare(null)} className="absolute top-3 right-3 text-white"><X className="w-6 h-6" /></button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">{video.Category}</span>
                                                <div className={`flex items-center gap-1 text-[10px] font-bold ${h.color}`}><Eye className="w-3.5 h-3.5"/> {Number(video.Views).toLocaleString()}</div>
                                            </div>
                                            <h3 className="font-bold text-sm text-slate-800 line-clamp-2 mb-6 h-10 leading-snug" dir="auto">{video.Title}</h3>
                                            
                                            <div className="mt-auto flex gap-2">
                                                <a href={video['Video url']} target="_blank" className="flex-1 bg-red-600 text-white text-center py-3 rounded-2xl text-[10px] font-black hover:bg-black transition-all shadow-lg shadow-red-500/20">WATCH NOW</a>
                                                <button onClick={() => {navigator.clipboard.writeText(video['Video url']); setCopiedId(globalIdx); setTimeout(()=>setCopiedId(null),2000)}}
                                                    className={`px-5 py-3 rounded-2xl text-[10px] font-black transition-all ${copiedId === globalIdx ? 'bg-green-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-200'}`}>
                                                    {copiedId === globalIdx ? '✓ COPIED' : '🔗 LINK'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-16 mb-20">
                                <button disabled={currentPage === 1} onClick={() => {setCurrentPage(p => p - 1); document.querySelector('main').scrollTo(0,0)}} className="p-4 bg-white rounded-2xl shadow hover:bg-slate-50 disabled:opacity-20 transition-all border border-slate-100"><ChevronLeft/></button>
                                <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{currentPage} / {totalPages}</span>
                                <button disabled={currentPage === totalPages} onClick={() => {setCurrentPage(p => p + 1); document.querySelector('main').scrollTo(0,0)}} className="p-4 bg-white rounded-2xl shadow hover:bg-slate-50 disabled:opacity-20 transition-all border border-slate-100"><ChevronRight/></button>
                            </div>
                        )}
                    </div>
                </main>

                <div className="lg:hidden fixed bottom-6 left-0 right-0 px-4 z-[100] transition-all duration-500 focus-within:bottom-[auto] focus-within:top-4">
                    <div className="max-w-md mx-auto relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-[2.2rem] blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
                        <div className="relative bg-white/90 backdrop-blur-2xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2rem] p-2 flex items-center gap-2">
                            <div className="p-3.5 bg-red-600 rounded-[1.4rem] text-white shadow-lg shadow-red-200">
                                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                            </div>
                            <input 
                                type="text" placeholder="Search archive..." 
                                className="flex-1 bg-transparent border-none outline-none text-slate-900 font-bold placeholder-slate-400 text-base"
                                value={query} onChange={handleSearchChange} dir="auto"
                            />
                            {query && <button onClick={() => {setQuery(''); setSearchQuery('');}} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><X className="w-5 h-5" /></button>}
                            <button onClick={() => setShowMobileFilters(true)} className="p-3.5 bg-slate-50 rounded-[1.4rem] text-slate-600 active:scale-95 transition-all">
                                <Filter className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {showMobileFilters && (
                    <div className="fixed inset-0 z-[110] lg:hidden">
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowMobileFilters(false)} />
                        <div className="absolute top-0 left-0 w-80 h-full bg-white shadow-2xl flex flex-col p-8 animate-in slide-in-from-left duration-500">
                            <div className="flex justify-between items-center mb-10 pb-4 border-b">
                                <div>
                                    <h2 className="font-black italic text-2xl tracking-tighter text-slate-900">MENU</h2>
                                    <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Archive Browser</p>
                                </div>
                                <button onClick={() => setShowMobileFilters(false)} className="p-3 bg-slate-50 rounded-2xl"><X className="w-6 h-6 text-slate-400"/></button>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-6 no-scrollbar">
                                <div className="space-y-2">
                                    {categories.map(cat => (
                                        <button key={cat.id} onClick={() => {setSelectedCat(cat.id); setShowMobileFilters(false); setCurrentPage(1);}} 
                                            className={`w-full flex justify-between items-center p-5 rounded-[1.8rem] font-bold text-sm transition-all ${selectedCat === cat.id ? 'bg-red-600 text-white shadow-2xl shadow-red-200' : 'bg-slate-50 text-slate-600 active:bg-slate-100'}`}>
                                            <div className="flex items-center gap-4"><span className="text-xl">{cat.icon}</span><span>{cat.name}</span></div>
                                            <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${selectedCat === cat.id ? 'bg-white/20' : 'bg-white shadow-sm'}`}>{categoryCounts[cat.id] || 0}</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="pt-6 border-t">
                                    <h3 className="text-[10px] font-black text-slate-400 mb-4 tracking-widest">SORT RESULTS</h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {[
                                            {id: 'views', label: 'Popularity'}, 
                                            {id: 'newest', label: 'Recent'}, 
                                            {id: 'title', label: 'Title'}
                                        ].map(opt => (
                                            <button key={opt.id} onClick={() => {setSortBy(opt.id); setShowMobileFilters(false);}}
                                                className={`p-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${sortBy === opt.id ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}>
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}