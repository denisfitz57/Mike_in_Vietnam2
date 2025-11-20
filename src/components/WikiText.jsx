import React from 'react';
import WikiTooltip from './WikiTooltip';
import { wikiTerms, createWikiPattern } from '../utils/wikiTerms';

const WikiText = ({ text }) => {
    const pattern = createWikiPattern();
    const parts = [];
    let lastIndex = 0;
    let match;
    let keyCounter = 0;

    // Reset regex lastIndex
    pattern.lastIndex = 0;

    // Find all matches
    const matches = [];
    while ((match = pattern.exec(text)) !== null) {
        matches.push({
            text: match[0],
            index: match.index,
            wikiTerm: wikiTerms[match[0]] || wikiTerms[match[0].toLowerCase()] || match[0]
        });
    }

    // Remove overlapping matches (keep the first/longest one)
    const filteredMatches = [];
    for (let i = 0; i < matches.length; i++) {
        const current = matches[i];
        const isOverlapping = filteredMatches.some(existing => {
            return (
                (current.index >= existing.index && current.index < existing.index + existing.text.length) ||
                (existing.index >= current.index && existing.index < current.index + current.text.length)
            );
        });

        if (!isOverlapping) {
            filteredMatches.push(current);
        }
    }

    // Sort by index
    filteredMatches.sort((a, b) => a.index - b.index);

    // Build the parts array with text and WikiTooltip components
    filteredMatches.forEach((match) => {
        // Add text before match
        if (match.index > lastIndex) {
            parts.push(
                <span key={`text-${keyCounter++}`}>
                    {text.substring(lastIndex, match.index)}
                </span>
            );
        }

        // Add WikiTooltip for the match
        parts.push(
            <WikiTooltip key={`wiki-${keyCounter++}`} term={match.wikiTerm}>
                {match.text}
            </WikiTooltip>
        );

        lastIndex = match.index + match.text.length;
    });

    // Add remaining text
    if (lastIndex < text.length) {
        parts.push(
            <span key={`text-${keyCounter++}`}>
                {text.substring(lastIndex)}
            </span>
        );
    }

    return <>{parts}</>;
};

export default WikiText;
