import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

const WikiTooltip = ({ term, children }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [wikiData, setWikiData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0, align: 'left' });
    const spanRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (isHovered && !wikiData && !loading && !error) {
            // Delay fetching slightly to avoid unnecessary API calls
            timeoutRef.current = setTimeout(() => {
                fetchWikiData();
            }, 300);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isHovered]);

    // Calculate tooltip position using fixed positioning
    useEffect(() => {
        if (isHovered && spanRef.current && (wikiData || loading)) {
            const rect = spanRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const tooltipWidth = 320; // w-80 in Tailwind

            // Calculate top position (below the element)
            // Using fixed positioning, so we use viewport coordinates directly (no scroll offset)
            const top = rect.bottom + 8;

            // Calculate horizontal position and alignment
            let left = rect.left;
            let align = 'left';

            // Check if tooltip would overflow on the right
            if (rect.left + tooltipWidth > viewportWidth - 20) {
                // Align to the right edge of the element
                left = rect.right;
                align = 'right';
            }

            setTooltipPos({ top, left, align });
        }
    }, [isHovered, wikiData, loading]);

    const fetchWikiData = async () => {
        setLoading(true);
        try {
            // Use Wikipedia API to get summary
            const response = await fetch(
                `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`
            );

            if (!response.ok) {
                throw new Error('Not found');
            }

            const data = await response.json();
            setWikiData({
                title: data.title,
                extract: data.extract,
                url: data.content_urls.desktop.page,
                thumbnail: data.thumbnail?.source
            });
            return data.content_urls.desktop.page;
        } catch (err) {
            setError(true);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Mobile/Touch handling:
        // If tooltip is not visible, show it first.
        if (!isHovered) {
            setIsHovered(true);
            return;
        }

        // If it IS visible (or on second click), open the link.
        if (wikiData?.url) {
            window.open(wikiData.url, '_blank', 'noopener,noreferrer');
        } else {
            // Otherwise, fetch the data first, then open
            const url = await fetchWikiData();
            if (url) {
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        }
    };

    const getTooltipStyle = () => {
        const baseStyle = {
            position: 'fixed',
            top: `${tooltipPos.top}px`,
            zIndex: 9999
        };

        if (tooltipPos.align === 'right') {
            return { ...baseStyle, right: `${window.innerWidth - tooltipPos.left}px` };
        } else {
            return { ...baseStyle, left: `${tooltipPos.left}px` };
        }
    };

    const tooltipContent = (
        <AnimatePresence>
            {isHovered && wikiData && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={getTooltipStyle()}
                    className="w-80 bg-white border-2 border-stone-300 shadow-2xl rounded-lg overflow-hidden"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {wikiData.thumbnail && (
                        <div className="w-full h-32 overflow-hidden bg-stone-100">
                            <img
                                src={wikiData.thumbnail}
                                alt={wikiData.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="p-4">
                        <h4 className="font-bold text-lg mb-2 text-stone-900 border-b border-stone-200 pb-2">
                            {wikiData.title}
                        </h4>
                        <p className="text-sm text-stone-700 leading-relaxed mb-3 line-clamp-4">
                            {wikiData.extract}
                        </p>
                        <a
                            href={wikiData.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            Read more on Wikipedia
                            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>

                    <div className="bg-stone-50 px-4 py-2 text-xs text-stone-500 border-t border-stone-200">
                        Source: Wikipedia
                    </div>
                </motion.div>
            )}

            {isHovered && loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={getTooltipStyle()}
                    className="w-48 bg-white border border-stone-300 shadow-lg rounded-lg p-3"
                >
                    <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-xs text-stone-600">Loading...</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <>
            <span
                ref={spanRef}
                className="cursor-pointer border-b-2 border-dotted border-blue-600 text-blue-700 hover:text-blue-900 hover:border-blue-900 transition-colors duration-200"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleClick}
            >
                {children}
            </span>
            {createPortal(tooltipContent, document.body)}
        </>
    );
};

export default WikiTooltip;
