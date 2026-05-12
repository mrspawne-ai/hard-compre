import { useState } from 'react';
import GlassCard from '../components/GlassCard';
import type { PageProps } from '../types';

export default function ServerError({ navigate }: PageProps) {
  const [retrying, setRetrying] = useState(false);
  const [retried, setRetried] = useState(false);

  const handleRetry = () => {
    setRetrying(true);
    // Simulate retry attempt
    setTimeout(() => {
      setRetrying(false);
      setRetried(true);
    }, 2000);
  };

  return (
    <div
      className="min-h-dvh flex items-center justify-center px-6 py-24 relative overflow-hidden"
      role="main"
      aria-labelledby="500-heading"
    >
      {/* Background blobs */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-72 h-72 rounded-full bg-apple-red/5 blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/3 w-56 h-56 rounded-full bg-orange-500/4 blur-[100px]" />
      </div>

      <GlassCard
        padding="none"
        radius="3xl"
        className="relative max-w-lg w-full text-center overflow-hidden"
        strength="strong"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-apple-red/4 via-transparent to-orange-500/3" aria-hidden="true" />
        <div className="relative p-12 lg:p-16">
          {/* 500 number */}
          <p
            className="text-[120px] lg:text-[160px] font-black leading-none text-gradient mb-2 select-none"
            aria-hidden="true"
          >
            500
          </p>

          <h1 id="500-heading" className="text-2xl font-bold text-apple-dark dark:text-apple-light mb-3">
            Something went wrong
          </h1>
          <p className="body-lg mb-4 max-w-sm mx-auto">
            We encountered an unexpected error on our end. Our team has been notified
            and is working to fix it.
          </p>

          {retried && !retrying && (
            <div className="mb-6 px-4 py-3 rounded-2xl bg-apple-red/10 text-apple-red text-sm" role="alert">
              Server still unavailable. Please try again later or contact support.
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              className="btn-primary"
              onClick={handleRetry}
              disabled={retrying}
              aria-busy={retrying}
            >
              {retrying ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" aria-hidden="true" />
                  Retrying…
                </>
              ) : 'Try Again'}
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate('home')}
            >
              Go to Home
            </button>
          </div>

          {/* Status info */}
          <div className="mt-10 pt-8 border-t border-black/6 dark:border-white/6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-apple-red animate-pulse" aria-hidden="true" />
              <p className="text-xs text-apple-gray dark:text-apple-mid-gray">
                Incident detected · Status: Investigating
              </p>
            </div>
            <button
              className="text-xs text-apple-blue hover:opacity-75 transition-opacity font-medium"
              onClick={() => navigate('contact')}
            >
              Contact Support →
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
