import { useState, useEffect, useRef } from 'react';
import MarkdownRenderer from './MarkdownRenderer';

interface TypewriterTextProps {
  text: string;
  speed?: number; // words per minute
  onComplete?: () => void;
  className?: string;
  isMarkdown?: boolean;
  typeMode?: 'word' | 'character'; // New prop for typing mode
}

export default function TypewriterText({
  text,
  speed = 300, // 150 words per minute (fast like modern AI assistants)
  onComplete,
  className = '',
  isMarkdown = false,
  typeMode = 'word' // Default to word-by-word for faster, more natural feel
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const indexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Reset state when text changes
    setDisplayedText('');
    setIsTyping(true);
    indexRef.current = 0;

    const words = text.split(' ');

    const typeNext = () => {
      if (typeMode === 'word') {
        // Word-by-word typing
        if (indexRef.current < words.length) {
          const wordsToShow = words.slice(0, indexRef.current + 1).join(' ');
          setDisplayedText(wordsToShow);
          indexRef.current++;          // Calculate delay based on words per minute
          // Average word length is ~5 characters, so adjust accordingly
          const baseDelay = (60 / speed) * 1000; // Convert to milliseconds

          // Use consistent timing for faster feel
          const delay = baseDelay * 0.7; // Make it 30% faster than calculated

          timeoutRef.current = setTimeout(typeNext, delay);
        } else {
          setIsTyping(false);
          onComplete?.();
        }
      } else {
        // Character-by-character typing (fallback)
        if (indexRef.current < text.length) {
          setDisplayedText(text.slice(0, indexRef.current + 1));
          indexRef.current++;

          // Calculate delay based on speed (characters per second)
          let delay = 1000 / (speed * 5 / 60); // Convert WPM to characters per second
          const currentChar = text[indexRef.current - 1];

          if (currentChar === ' ') {
            delay *= 0.5; // Faster for spaces
          } else if (['.', '!', '?'].includes(currentChar)) {
            delay *= 3; // Pause at sentence endings
          } else if ([',', ';', ':'].includes(currentChar)) {
            delay *= 2; // Pause at commas and colons
          }

          timeoutRef.current = setTimeout(typeNext, delay);
        } else {
          setIsTyping(false);
          onComplete?.();
        }
      }
    };    // Start typing immediately with minimal delay
    timeoutRef.current = setTimeout(typeNext, 50);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, speed, onComplete, typeMode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (isMarkdown) {
    return (
      <div className={className}>
        <MarkdownRenderer content={displayedText} />        {isTyping && (
          <span className="inline-block w-0.5 h-4 bg-gray-600 ml-1 typing-cursor rounded-sm" />
        )}
      </div>
    );
  }

  return (
    <span className={className}>
      {displayedText}      {isTyping && (
        <span className="inline-block w-0.5 h-4 bg-current ml-1 typing-cursor rounded-sm" />
      )}
    </span>
  );
}
