const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex h-screen w-screen flex-col items-center justify-center gap-3 bg-white/80 backdrop-blur-sm">
      <div className="progress-bordered"></div>
      <p className="text-[#256176] text-sm font-medium animate-pulse">
        Đang tải. Đợi xíu ...
      </p>
    </div>
  );
};

export default Loader;
