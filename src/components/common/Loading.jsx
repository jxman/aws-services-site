function Loading({ message = 'Loading AWS infrastructure data...' }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        {/* Spinner */}
        <div className="inline-block relative w-16 h-16 mb-4">
          <div className="absolute border-4 border-primary border-t-transparent rounded-full w-16 h-16 animate-spin"></div>
        </div>

        {/* Message */}
        <p className="text-text-secondary text-lg">
          {message}
        </p>
      </div>
    </div>
  );
}

export default Loading;
