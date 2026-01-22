// "use client";
// import React, { useState, useMemo, useEffect } from 'react';
// import Fuse from 'fuse.js';

// export default function VideoLibrary() {
//     const [videos, setVideos] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [query, setQuery] = useState('');
//     const [selectedCat, setSelectedCat] = useState('All');
//     const [copiedId, setCopiedId] = useState(null);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [activeShare, setActiveShare] = useState(null);
//     const videosPerPage = 12;

//     const categories = ["All", "Media & Journalism", "History & Legacy", "Finance & Business", "Religion & Books", "Archive"];

//     useEffect(() => {
//         async function loadVideos() {
//             try {
//                 const res = await fetch('/api');
//                 const data = await res.json();
//                 if (Array.isArray(data)) setVideos(data);
//             } catch (err) { console.error(err); }
//             finally { setLoading(false); }
//         }
//         loadVideos();
//     }, []);

//     const getYouTubeID = (url) => {
//         const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
//         const match = url?.match(regExp);
//         return (match && match[2].length === 11) ? match[2] : null;
//     };

//     const fuse = useMemo(() => new Fuse(videos, {
//         keys: ['Title', 'Category'],
//         threshold: 0.3,
//         ignoreLocation: true,
//         useExtendedSearch: true
//     }), [videos]);

//     const filteredVideos = useMemo(() => {
//         let result = query ? fuse.search(query).map(r => r.item) : videos;
//         if (selectedCat !== 'All') result = result.filter(v => v.Category === selectedCat);
//         return result;
//     }, [query, selectedCat, videos, fuse]);

//     const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
//     const currentVideos = filteredVideos.slice((currentPage - 1) * videosPerPage, currentPage * videosPerPage);

//     const shareVideo = (platform, url, title) => {
//         const encodedUrl = encodeURIComponent(url);
//         const encodedTitle = encodeURIComponent(title);
//         let link = platform === 'wa' ? `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}` :
//                    platform === 'fb' ? `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` :
//                    `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
//         window.open(link, '_blank');
//         setActiveShare(null);
//     };

//     if (loading) return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
//             <div className="w-16 h-16 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
//             <p className="mt-4 text-slate-400 font-bold tracking-widest text-[10px] uppercase">Zikre Kitab Syncing...</p>
//         </div>
//     );

//     return (
//         <div className="min-h-screen bg-slate-50 pb-20 font-sans">
//             {/* STICKY HEADER */}
//             <div className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200 shadow-sm">
//                 <div className="max-w-7xl mx-auto px-4 py-6">
//                     <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-6">
//                         <div className="text-center lg:text-left">
//                             <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">ZIKRE KITAB <span className="text-red-600">LIVE</span></h1>
//                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{filteredVideos.length} Videos Found</p>
//                         </div>
//                         <div className="relative w-full max-w-2xl">
//                             <input
//                                 type="text" placeholder="Dhoondein: 'History', 'بینکاری', 'Jang'..." dir="auto"
//                                 className="w-full p-4 pl-12 rounded-2xl bg-slate-100 border-none focus:bg-white focus:ring-4 focus:ring-red-600/10 text-lg transition-all"
//                                 onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }}
//                             />
//                             <svg className="absolute left-4 top-5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
//                         </div>
//                     </div>
//                     {/* CATEGORY PILLS */}
//                     <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
//                         {categories.map(cat => (
//                             <button key={cat} onClick={() => { setSelectedCat(cat); setCurrentPage(1); }}
//                                 className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border ${selectedCat === cat ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-white border-slate-200 text-slate-500 hover:border-red-300'}`}>
//                                 {cat}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* VIDEO GRID */}
//             <div className="max-w-7xl mx-auto px-4 mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//                 {currentVideos.map((video, i) => {
//                     const videoId = getYouTubeID(video['Video url']);
//                     return (
//                         <div key={i} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 flex flex-col relative">
//                             <div className="aspect-video relative overflow-hidden bg-slate-200">
//                                 {videoId && <img src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" alt="thumb" />}
//                                 <button onClick={() => setActiveShare(activeShare === i ? null : i)} className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-md hover:bg-red-600 hover:text-white transition-all z-10">
//                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
//                                 </button>
//                                 {activeShare === i && (
//                                     <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center gap-4 z-20">
//                                         <button onClick={() => shareVideo('wa', video['Video url'], video.Title)} className="bg-green-500 p-4 rounded-full text-white font-bold">WA</button>
//                                         <button onClick={() => shareVideo('fb', video['Video url'], video.Title)} className="bg-blue-600 p-4 rounded-full text-white font-bold">FB</button>
//                                         <button onClick={() => setActiveShare(null)} className="absolute top-4 right-4 text-white text-2xl">×</button>
//                                     </div>
//                                 )}
//                             </div>
//                             <div className="p-6 flex flex-col flex-1">
//                                 <span className="text-[9px] font-black text-red-600 uppercase mb-2 block tracking-widest">{video.Category}</span>
//                                 <h3 className="font-bold text-slate-800 leading-snug mb-6 line-clamp-2 h-10 text-sm group-hover:text-red-600 transition-colors capitalize" dir="auto">{video.Title}</h3>
//                                 <div className="mt-auto flex gap-2">
//                                     <button onClick={() => {navigator.clipboard.writeText(video['Video url']); setCopiedId(i); setTimeout(() => setCopiedId(null), 2000);}}
//                                         className={`flex-1 py-3 rounded-2xl text-[10px] font-bold uppercase transition-all ${copiedId === i ? 'bg-green-600 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
//                                         {copiedId === i ? '✓ Copied' : '🔗 Copy'}
//                                     </button>
//                                     <a href={video['Video url']} target="_blank" className="flex-1 bg-red-600 text-white py-3 rounded-2xl text-[10px] font-bold text-center hover:bg-black transition-all shadow-md shadow-red-600/20">WATCH</a>
//                                 </div>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>

//             {/* PAGINATION */}
//             {totalPages > 1 && (
//                 <div className="mt-16 flex justify-center items-center gap-3">
//                     <button disabled={currentPage === 1} onClick={() => {setCurrentPage(p => p - 1); window.scrollTo(0,0);}}
//                         className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 disabled:opacity-20 hover:bg-red-600 hover:text-white transition-all font-bold">←</button>
//                     <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-200 text-xs font-bold">{currentPage} / {totalPages}</div>
//                     <button disabled={currentPage === totalPages} onClick={() => {setCurrentPage(p => p + 1); window.scrollTo(0,0);}}
//                         className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 disabled:opacity-20 hover:bg-red-600 hover:text-white transition-all font-bold">→</button>
//                 </div>
//             )}
//         </div>
//     );
// }