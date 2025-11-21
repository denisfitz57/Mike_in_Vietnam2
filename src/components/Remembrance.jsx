import React from 'react';
import { motion } from 'framer-motion';
import WikiText from './WikiText';

const Remembrance = ({ text, index, clippings, onImageClick, summary, gruesome }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white p-8 shadow-lg border-l-4 border-sepia-dark relative overflow-hidden"
        >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Summary Column */}
                <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-stone-200 pb-4 md:pb-0 md:pr-4 flex flex-col justify-center text-right">
                    <p className="font-serif italic text-sepia-dark text-xl md:text-2xl font-medium leading-relaxed">
                        "{summary}"
                    </p>
                    {gruesome && (
                        <div className="mt-4 flex justify-end">
                            <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs font-bold uppercase tracking-widest border border-red-200 rounded-sm">
                                Warning: Graphic
                            </span>
                        </div>
                    )}
                </div>

                {/* Main Text Column */}
                <div className="md:col-span-3 relative">
                    <div className="absolute -right-4 -top-4 text-9xl text-sepia-light opacity-20 font-serif select-none">
                        "
                    </div>
                    <p className="text-lg leading-relaxed relative z-10 text-ink font-serif">
                        <WikiText text={text} />
                    </p>

                    {clippings && clippings.length > 0 && (
                        <div className="mt-6 grid grid-cols-1 gap-4">
                            {clippings.map((clip) => (
                                <div key={clip.id} className="bg-stone-200 p-2 rotate-1 hover:rotate-0 transition-transform duration-300 shadow-md cursor-pointer" onClick={() => onImageClick && onImageClick(clip.path)}>
                                    <img src={clip.path} alt="Newspaper clipping" className="w-full h-auto filter sepia-[.3] contrast-125" />
                                    <p className="text-xs mt-2 font-mono text-stone-600">{clip.ocr_text.substring(0, 100)}...</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Timeline connector */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-sepia-light -ml-8 hidden lg:block"></div>
            <div className="absolute left-0 top-8 w-4 h-4 rounded-full bg-sepia-dark -ml-[2.15rem] hidden lg:block border-4 border-paper"></div>
        </motion.div>
    );
};

export default Remembrance;
