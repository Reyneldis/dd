// src/components/shared/not-found/NotFoundSkeleton.tsx
export function NotFoundSkeleton() {
  return (
    <div className="text-center animate-pulse">
      <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
      <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-6"></div>
      <div className="h-4 bg-gray-300 rounded w-80 mx-auto mb-8"></div>
      <div className="space-y-4 flex flex-col items-center">
        <div className="h-10 bg-gray-300 rounded w-32"></div>
        <div className="h-10 bg-gray-300 rounded w-40"></div>
      </div>
    </div>
  );
}
