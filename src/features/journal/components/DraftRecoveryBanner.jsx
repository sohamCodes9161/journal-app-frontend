export default function DraftRecoveryBanner({
  updatedAt,
  onResume,
  onDiscard,
}) {
  const formattedTime = new Date(updatedAt).toLocaleString();

  return (
    <div className="mb-5 rounded-2xl border border-amber-300/40 bg-amber-500/10 backdrop-blur px-5 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">Resume your unfinished journal?</p>

          <p className="text-sm opacity-70">Last saved {formattedTime}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onDiscard}
            className="rounded-xl border px-4 py-2 text-sm"
          >
            Discard
          </button>

          <button
            onClick={onResume}
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm text-white"
          >
            Resume
          </button>
        </div>
      </div>
    </div>
  );
}
