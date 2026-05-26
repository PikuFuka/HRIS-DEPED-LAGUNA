import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";
import { Skeleton } from "./Skeleton";

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  placeholderClassName?: string;
  fetchPriority?: "high" | "low" | "auto";
  loading?: "eager" | "lazy";
}

export function SmartImage({ 
  src, 
  alt, 
  className, 
  placeholderClassName,
  fallback = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  ...props 
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) return;
    
    // Reset state when src changes
    setLoaded(false);
    setError(false);

    const img = new Image();
    img.src = src;
    img.onload = () => setLoaded(true);
    img.onerror = () => {
      setError(true);
      setLoaded(true); // Stop loading indicator even on error
    };
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <AnimatePresence>
        {!loaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-10"
          >
            <Skeleton className={cn("w-full h-full rounded-none", placeholderClassName)} />
          </motion.div>
        )}
      </AnimatePresence>

      <img
        src={error ? fallback : src}
        alt={alt}
        className={cn("w-full h-full object-cover", className)}
        style={{
          opacity: loaded ? 1 : 0,
          transform: loaded ? "scale(1)" : "scale(1.05)",
          transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
        }}
        {...props}
      />
    </div>
  );
}
