import React, { useState, useEffect } from 'react';
import Remembrance from './components/Remembrance';
import Comments from './components/Comments';
import contentData from './data/content.json';

const PUBLIC_BASE = (import.meta?.env?.BASE_URL && import.meta.env.BASE_URL !== '/')
    ? import.meta.env.BASE_URL
    : '/Mike_in_Vietnam2/';

const normalizeBase = (base) => {
    if (!base.startsWith('/')) {
        base = `/${base}`;
    }
    if (!base.endsWith('/')) {
        base = `${base}/`;
    }
    return base;
};

const resolveAssetPath = (path) => {
    if (!path) return path;
    if (/^https?:\/\//i.test(path)) return path;

    const base = normalizeBase(PUBLIC_BASE);
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;

    if (typeof window !== 'undefined' && window.location?.origin) {
        return new URL(`${base}${normalizedPath}`, window.location.origin).href;
    }

    return `${base}${normalizedPath}`;
};

function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        // In a real app, we might fetch this, but here we import it directly.
        // However, to simulate loading or if we switch to fetch later:
        const normalizedData = {
            ...contentData,
            clippings: (contentData.clippings || []).map((clip) => ({
                ...clip,
                path: resolveAssetPath(clip.path)
            })),
        };
        setData(normalizedData);
    }, []);

    // Lightbox state
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageClick = (imagePath) => {
        setSelectedImage(resolveAssetPath(imagePath));
    }

    const closeLightbox = () => {
        setSelectedImage(null);
    };

    if (!data) {
        return (
            <div className="min-h-screen bg-paper flex items-center justify-center">
                <div className="animate-pulse text-sepia-dark font-serif text-xl">Loading history...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-paper text-ink font-serif selection:bg-sepia-light selection:text-sepia-dark relative">
            {/* Lightbox Overlay */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center cursor-pointer animate-in fade-in duration-200"
                    onClick={closeLightbox}
                >
                    <button
                        className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors z-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            closeLightbox();
                        }}
                        aria-label="Close lightbox"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    <img
                        src={selectedImage}
                        alt="Magnified view"
                        className="w-full h-full object-contain p-4 md:p-8"
                    />
                </div>
            )}

            <header className="py-16 text-center bg-sepia-dark text-paper shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]"></div>
                <h1 className="text-5xl md:text-7xl font-bold mb-4 relative z-10 tracking-wider">Mike Fitzpatrick in Vietnam</h1>
                <p className="text-xl md:text-2xl italic opacity-90 relative z-10 font-light">Newspaper clippings and thoughts from 2003</p>
                <p className="text-xl md:text-2xl italic opacity-90 relative z-10 font-light">Reflecting on fellow Air Guardsmen heading to the Middle East</p>
                <p className="text-xl md:text-2xl italic opacity-90 relative z-10 font-light">Content by Mike Fitzpatrick and reporters to the <a href="https://weepingwaterne.advantage-preservation.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">Weeping Water Republican.</a></p>
                <p className="text-xl md:text-2xl italic opacity-90 relative z-10 font-light">Summaries, link choices, and most programming courtesy Google AI.</p>
                <p className="text-xl md:text-2xl italic opacity-90 relative z-10 font-light"><a href="https://en.wikipedia.org/wiki/Entry-level_job" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">Grunt work</a> by Denis Fitzpatrick.</p>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    {data.remembrances.map((item, index) => (
                        <Remembrance
                            key={index}
                            text={item.text}
                            summary={item.summary}
                            gruesome={item.gruesome}
                            index={index}
                            clippings={[]} // Still empty for now as per previous code
                            onImageClick={handleImageClick}
                        />
                    ))}


                </div>

                <aside className="hidden lg:block lg:col-span-1 relative">
                    <div className="sticky top-12">
                        <div
                            className="bg-white p-6 shadow-lg border-t-4 border-sepia-dark overflow-y-auto no-scrollbar"
                            style={{ maxHeight: 'calc(100vh - 6rem)' }}
                        >
                            <h3 className="font-serif text-xl mb-2 text-sepia-dark border-b border-stone-200 pb-2">Newspaper Clippings</h3>
                            <p className="text-base text-stone-500 italic font-bold mb-4">Click on a summary to view the original clipping - click again to return.</p>
                            <ul className="space-y-4">
                                {data.clippings.map((clip) => (
                                    <li key={clip.id} className="group cursor-pointer" onClick={() => handleImageClick(clip.path)}>
                                        <p className="font-serif text-sepia-dark group-hover:text-red-800 transition-colors duration-300 leading-tight">
                                            {clip.summary}
                                        </p>
                                        <div className="h-px w-12 bg-stone-300 mt-2 group-hover:w-full transition-all duration-500"></div>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8 text-center opacity-60">
                                <div className="inline-block w-8 h-px bg-stone-400 mb-1"></div>
                                <p className="text-xs text-stone-500 italic font-serif">End of Clippings</p>
                                <div className="inline-block w-8 h-px bg-stone-400 mt-1"></div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Mobile Clippings (visible only on small screens) */}
                <div className="lg:hidden space-y-8 mt-12">
                    <h3 className="text-2xl font-bold text-sepia-dark border-b-2 border-sepia-dark pb-2">Clippings</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {data.clippings.map((clip) => (
                            <div key={clip.id} className="bg-white p-2 shadow-md cursor-pointer" onClick={() => handleImageClick(clip.path)}>
                                <img src={clip.path} alt="Clipping" className="w-full h-auto sepia-[.5]" />
                                <p className="text-sm mt-2 font-serif text-sepia-dark">{clip.summary}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <Comments />
                </div>
            </main>

            <footer className="bg-stone-800 text-stone-400 py-8 text-center mt-12">
                <p>&copy; {new Date().getFullYear()} Mike's Remembrances. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default App;
