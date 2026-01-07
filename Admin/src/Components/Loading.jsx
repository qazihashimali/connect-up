const Loading = () => {
  const spinnerClass =
    "w-12 h-12 border-4 border-gray-300 border-t-[#662d91] rounded-full animate-spin";

  return (
    <div className="fixed inset-0 h-screen w-screen top-0 left-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <div className={spinnerClass}></div>
      </div>
    </div>
  );
};

export default Loading;
