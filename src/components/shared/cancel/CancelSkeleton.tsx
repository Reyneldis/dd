// src/components/cancel/CancelSkeleton.tsx
export function CancelSkeleton() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-6"></div>

        <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>

        <div className="space-y-2 mb-6">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
        </div>

        <div className="flex justify-center gap-4">
          <div className="h-10 bg-gray-200 rounded w-32"></div>
          <div className="h-10 bg-gray-200 rounded w-40"></div>
        </div>
      </div>
    </div>
  );
}
