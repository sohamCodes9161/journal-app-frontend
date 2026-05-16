import Spinner from "@/components/ui/Spinner";

function FullscreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner />

        <p className="text-sm text-slate-400">Restoring your space...</p>
      </div>
    </div>
  );
}

export default FullscreenLoader;
