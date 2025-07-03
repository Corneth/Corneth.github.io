
// components/shared/TypewriterText.jsx
import { useState, useEffect } from 'react';

export default function TypewriterText({
                                           text,
                                           delay = 50,
                                           startDelay = 0,
                                           className = ""
                                       }) {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isStarted, setIsStarted] = useState(false);

    useEffect(() => {
        const startTimer = setTimeout(() => {
            setIsStarted(true);
        }, startDelay);

        return () => clearTimeout(startTimer);
    }, [startDelay]);

    useEffect(() => {
        if (!isStarted) return;

        if (currentIndex < text.length) {
            const timer = setTimeout(() => {
                setDisplayText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, delay);

            return () => clearTimeout(timer);
        }
    }, [currentIndex, text, delay, isStarted]);

    return (
        <span className={className}>
      {displayText}
            {currentIndex < text.length && (
                <span className="animate-pulse">|</span>
            )}
    </span>
    );
}
