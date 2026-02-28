"use client";
import React, { useState, useMemo, useEffect, useTransition } from 'react';
import Fuse from 'fuse.js';
import { 
  Search, Copy, Check, Share2, Facebook, Instagram,
  MessageCircle, Filter, Menu, X, ChevronLeft, ChevronRight,
  Loader2, Eye, BookOpen, LayoutGrid, List, Flame, Folder
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
    const [sortBy, setSortBy] = useState('views'); // Default to views
    
    const videosPerPage = 12;

    useEffect(() => {
        async function loadVideos() {
            try {
                const res = await fetch('/api');
                const data = await res.json();
                if (Array.isArray(data)) setVideos(data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        }
        loadVideos();
    }, []);

    // --- DYNAMIC CATEGORY GENERATOR ---
    const categories = useMemo(() => {
        // Automatically finds every unique Series name in your Excel data
        const uniqueSeriesNames = Array.from(new Set(videos.map(v => v.Category)));
        
        const dynamicCats = uniqueSeriesNames.map(name => ({
            id: name,
            name: name, // Directly uses the Urdu or English name from Excel
            icon: "📁" 
        }));

        return [{ id: 'All', name: 'All Videos', icon: '🌍' }, ...dynamicCats];
    }, [videos]);

    const categoryCounts = useMemo(() => {
        const counts = { All: videos.length };
        videos.forEach(v => {
            counts[v.Category] = (counts[v.Category] || 0) + 1;
        });
        return counts;
    }, [videos]);

    // --- VIEW HIGHLIGHTS (POPULARITY LOGIC) ---
    const getViewHighlight = (views) => {
        const v = Number(views) || 0;
        if (v >= 1000) return { color: 'text-red-600', badge: '🔥 POPULAR', bg: 'bg-red-50 border-red-200' };
        if (v >= 500) return { color: 'text-orange-600', badge: '⭐ TRENDING', bg: 'bg-orange-50 border-orange-200' };
        return { color: 'text-slate-500', badge: null, bg: '' };
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        startTransition(() => {
            setSearchQuery(value);
            setCurrentPage(1);
        });
    };

    // --- FILTERING & SORTING (DYNAMC) ---
    const filteredVideos = useMemo(() => {
        let result = selectedCat === 'All' ? [...videos] : videos.filter(v => v.Category === selectedCat);
        
        if (searchQuery.trim()) {
            const fuse = new Fuse(result, { keys: ['Title', 'Guest', 'Series', 'Tag 1'], threshold: 0.4 });
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

    if (loading) return (
        <div className="h-screen bg-slate-50 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
            <p className="mt-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Syncing Live Archive...</p>
        </div>
    );

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden font-sans relative">
            <header className="h-20 flex-shrink-0 bg-white border-b border-slate-200 z-[60] flex items-center px-4 md:px-8 justify-between gap-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => setShowMobileFilters(true)} className="lg:hidden p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100"><Menu/></button>
                    <div className="leading-tight">
                        <h1 className="text-xl font-black tracking-tighter text-slate-900">ZIKRE KITAB</h1>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Digital Library</p>
                    </div>
                </div>

                <div className="hidden lg:block relative flex-1 max-w-2xl">
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
                    <input type="text" placeholder="Search titles, series or guests..." className="w-full p-3.5 pl-12 rounded-2xl bg-slate-100 border-none focus:ring-4 focus:ring-red-600/10 text-sm transition-all focus:bg-white" value={query} onChange={handleSearchChange} dir="auto" />
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} className="p-2.5 bg-slate-50 rounded-xl">
                        {viewMode === 'grid' ? <List className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                <aside className="hidden lg:block w-72 h-full bg-white border-r border-slate-200 p-6 overflow-y-auto">
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-l-4 border-red-600 pl-3">Dynamic Series</h3>
                            <div className="space-y-1">
                                {categories.map(cat => (
                                    <button key={cat.id} onClick={() => {setSelectedCat(cat.id); setCurrentPage(1);}}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${selectedCat === cat.id ? 'bg-red-600 text-white shadow-xl shadow-red-200' : 'hover:bg-slate-50 text-slate-600'}`}>
                                        <div className="flex items-center gap-3"><span>{cat.icon}</span><span className="font-bold text-sm tracking-tight">{cat.name}</span></div>
                                        <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${selectedCat === cat.id ? 'bg-white/20' : 'bg-slate-100'}`}>{categoryCounts[cat.id] || 0}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Display Order</h3>
                            <select className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-xs" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
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
                                const h = getViewHighlight(video.Views);
                                return (
                                    <div key={i} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col relative">
                                        <div className="relative aspect-video bg-slate-200 overflow-hidden">
                                            {videoId && <img src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />}
                                            {h.badge && <div className="absolute top-3 left-3 px-3 py-1 bg-red-600 text-white text-[8px] font-black rounded-full z-10">{h.badge}</div>}
                                            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[9px] px-2 py-1 rounded font-bold">{video.Duration}</div>
                                        </div>

                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">{video.Category}</span>
                                                <div className={`flex items-center gap-1 text-[10px] font-bold ${h.color}`}><Eye className="w-3.5 h-3.5"/> {Number(video.Views).toLocaleString()}</div>
                                            </div>
                                            <h3 className="font-bold text-sm text-slate-800 line-clamp-2 mb-6 h-10 leading-snug" dir="auto">{video.Title}</h3>
                                            
                                            <div className="mt-auto flex gap-2">
                                                <a href={video['Video url']} target="_blank" className="flex-1 bg-red-600 text-white text-center py-3 rounded-2xl text-[10px] font-black hover:bg-black transition-all shadow-lg shadow-red-500/20">WATCH NOW</a>
                                                <button onClick={() => {navigator.clipboard.writeText(video['Video url']); setCopiedId(i); setTimeout(()=>setCopiedId(null),2000)}}
                                                    className={`px-5 py-3 rounded-2xl text-[10px] font-black transition-all ${copiedId === i ? 'bg-green-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>
                                                    {copiedId === i ? '✓' : '🔗'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-16 mb-20">
                                <button disabled={currentPage === 1} onClick={() => {setCurrentPage(p => p - 1); document.querySelector('main').scrollTo(0,0)}} className="p-4 bg-white rounded-2xl border border-slate-100 disabled:opacity-20 transition-all"><ChevronLeft/></button>
                                <span className="text-xs font-black text-slate-400">{currentPage} / {totalPages}</span>
                                <button disabled={currentPage === totalPages} onClick={() => {setCurrentPage(p => p + 1); document.querySelector('main').scrollTo(0,0)}} className="p-4 bg-white rounded-2xl border border-slate-100 disabled:opacity-20 transition-all"><ChevronRight/></button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}