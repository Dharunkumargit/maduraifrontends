const Loader = ({
  text = "Loading, please wait...",
  fullScreen = false,
}) => {
  return (
    <div
      className={`flex flex-col justify-center items-center gap-3 ${
        fullScreen ? "fixed inset-0 bg-white z-50" : "py-10"
      }`}
    >
      {/* Spinner */}
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

      {/* Text */}
      <p className="text-sm text-gray-500 animate-pulse">
        {text}
      </p>
    </div>
  );
};

export default Loader;