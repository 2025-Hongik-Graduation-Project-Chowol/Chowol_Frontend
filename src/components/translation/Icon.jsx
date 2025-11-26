

export function Icon({ className }) {
  return (
    <div
      className={
        "flex items-center justify-center rounded-full bg-white text-[10px] font-semibold text-purple-700 " +
        (className || "")
      }
    >
      AI
    </div>
  );
}

