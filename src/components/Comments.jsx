import React from 'react';
import Giscus from '@giscus/react';

const Comments = () => {
    return (
        <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-2xl font-serif font-bold mb-8 text-sepia-dark border-b border-sepia-light pb-2">Comments & Reflections</h2>
            <Giscus
                id="comments"
                repo="denis-user/mike-in-vietnam" // Placeholder, user needs to configure this
                repoId="R_kgDOL..."
                category="General"
                categoryId="DIC_kwDOL..."
                mapping="pathname"
                term="Welcome to Mike's Remembrances"
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="top"
                theme="light"
                lang="en"
                loading="lazy"
            />
            <div className="mt-4 text-sm text-stone-500 italic text-center">
                Note: Comments require a GitHub account.
            </div>
        </div>
    );
};

export default Comments;
