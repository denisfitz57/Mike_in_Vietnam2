import React, { useState, useEffect } from 'react';
import Remembrance from './components/Remembrance';
import Comments from './components/Comments';
import contentData from './data/content.json';

function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        // In a real app, we might fetch this, but here we import it directly.
        // However, to simulate loading or if we switch to fetch later:
        setData(contentData);
    }, []);

    // Lightbox state
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageClick = (imagePath) => {
        setSelectedImage(imagePath);
    };

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
                    <img
                        src={selectedImage}
                        alt="Magnified view"
                        className="w-full h-full object-contain"
                    />
                </div>
            )}

            <header className="py-16 text-center bg-sepia-dark text-paper shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]"></div>
                <h1 className="text-5xl md:text-7xl font-bold mb-4 relative z-10 tracking-wider">Mike in Vietnam</h1>
                <p className="text-xl md:text-2xl italic opacity-90 relative z-10 font-light">Remembrances circa 2003</p>
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

                    <Comments />
                </div>

                <aside className="hidden lg:block lg:col-span-1 relative">
                    <div className="sticky top-12 space-y-8">
                        <div className="bg-white p-6 shadow-lg border-t-4 border-sepia-dark">
                            <h3 className="font-serif text-xl mb-2 text-sepia-dark border-b border-stone-200 pb-2">Clippings</h3>
                            <p className="text-sm text-stone-500 italic mb-4">Click on a summary to view the full clipping.</p>
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
            </main>

            <footer className="bg-stone-800 text-stone-400 py-8 text-center mt-12">
                <p>&copy; {new Date().getFullYear()} Mike's Remembrances. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default App;
