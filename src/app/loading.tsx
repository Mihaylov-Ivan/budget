export default function Loading() {
  return (
    <div className="min-h-screen p-4 sm:p-8 bg-[var(--background)] text-[var(--foreground)] font-sans flex flex-col gap-6">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          {/* Outer ring */}
          <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
          {/* Spinning inner ring */}
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}
