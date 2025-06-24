'use client';

import { useEffect, useState } from 'react';

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    totalImages: 0,
    loadedImages: 0,
    failedImages: 0,
    averageLoadTime: 0,
    totalLoadTime: 0
  });

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'resource' && entry.initiatorType === 'img') {
          setMetrics(prev => {
            const newTotal = prev.totalImages + 1;
            const newLoaded = entry.duration > 0 ? prev.loadedImages + 1 : prev.loadedImages;
            const newFailed = entry.duration === 0 ? prev.failedImages + 1 : prev.failedImages;
            const newTotalTime = prev.totalLoadTime + entry.duration;
            const newAverage = newLoaded > 0 ? newTotalTime / newLoaded : 0;

            return {
              totalImages: newTotal,
              loadedImages: newLoaded,
              failedImages: newFailed,
              averageLoadTime: Math.round(newAverage),
              totalLoadTime: newTotalTime
            };
          });
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });

    return () => observer.disconnect();
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs z-50">
      <div className="font-bold mb-1">Image Performance</div>
      <div>Total: {metrics.totalImages}</div>
      <div>Loaded: {metrics.loadedImages}</div>
      <div>Failed: {metrics.failedImages}</div>
      <div>Avg Time: {metrics.averageLoadTime}ms</div>
    </div>
  );
} 