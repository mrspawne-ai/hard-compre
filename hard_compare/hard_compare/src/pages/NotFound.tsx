import GlassCard from '../components/GlassCard';
import type { PageProps } from '../types';

export default function NotFound({ navigate }: PageProps) {
  return (
    <div
      className="min-h-dvh flex items-center justify-center px-6 py-24 relative overflow-hidden"
      role="main"
      aria-labelledby="404-heading"
    >
      {/* Background blobs */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-apple-blue/6 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-apple-indigo/5 blur-[80px]" />
      </div>

      <GlassCard
        padding="none"
        radius="3xl"
        className="relative max-w-lg w-full text-center overflow-hidden"
        strength="strong"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-apple-blue/5 via-transparent to-apple-indigo/5" aria-hidden="true" />
        <div className="relative p-12 lg:p-16">
          {/* 404 number */}
          <p
            className="text-[120px] lg:text-[160px] font-black leading-none text-gradient mb-2 select-none"
            aria-hidden="true"
          >
            404
          </p>

          <h1 id="404-heading" className="text-2xl font-bold text-apple-dark dark:text-apple-light mb-3">
            Page not found
          </h1>
          <p className="body-lg mb-10 max-w-sm mx-auto">
            The page you're looking for doesn't exist or may have moved.
            Let's get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              className="btn-primary"
              onClick={() => navigate('home')}
            >
              Go to Home
            </button>
            <button
              className="btn-secondary"
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>

          {/* Quick links */}
          <div className="mt-10 pt-8 border-t border-black/6 dark:border-white/6">
            <p className="text-xs text-apple-gray dark:text-apple-mid-gray mb-4">Or try one of these:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {(['laptops', 'compare', 'guides', 'support'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => navigate(r)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium glass hover:bg-apple-blue/8 hover:text-apple-blue transition-all duration-200 capitalize"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
