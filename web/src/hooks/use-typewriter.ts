import { useState, useRef, useCallback, useEffect } from "react";

interface UseTypewriterOptions {
  text: string;
  speed?: number;
  interceptTrigger?: string;
  onIntercept?: () => void;
}

export function useTypewriter({
  text,
  speed = 30,
  interceptTrigger,
  onIntercept,
}: UseTypewriterOptions) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isIntercepted, setIsIntercepted] = useState(false);
  
  const currentIndex = useRef(0);
  const currentText = useRef("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Keep the latest onIntercept in a ref so we don't need to depend on it
  const onInterceptRef = useRef(onIntercept);
  useEffect(() => {
    onInterceptRef.current = onIntercept;
  }, [onIntercept]);

  const clearTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const start = useCallback((dynamicText?: string) => {
    clearTimer();
    setDisplayedText("");
    currentText.current = "";
    setIsIntercepted(false);
    setIsTyping(true);
    currentIndex.current = 0;
    
    const textToType = dynamicText !== undefined ? dynamicText : text;
    
    const typeNextChar = () => {
      if (currentIndex.current >= textToType.length) {
        setIsTyping(false);
        return;
      }

      currentText.current += textToType.charAt(currentIndex.current);
      setDisplayedText(currentText.current);
        
      if (interceptTrigger && currentText.current.includes(interceptTrigger)) {
        setIsIntercepted(true);
        setIsTyping(false);
        if (onInterceptRef.current) onInterceptRef.current();
        return;
      }
      
      currentIndex.current++;
      
      const variance = Math.random() * (speed * 0.8) - (speed * 0.4);
      const nextSpeed = Math.max(10, speed + variance);
      timeoutRef.current = setTimeout(typeNextChar, nextSpeed);
    };
    
    // Start after a tiny delay
    timeoutRef.current = setTimeout(typeNextChar, 50);
  }, [text, speed, interceptTrigger]);

  const reset = useCallback(() => {
    clearTimer();
    setDisplayedText("");
    currentText.current = "";
    setIsIntercepted(false);
    setIsTyping(false);
    currentIndex.current = 0;
  }, []);

  useEffect(() => {
    return () => clearTimer();
  }, []);

  return { displayedText, isTyping, start, reset, isIntercepted };
}
