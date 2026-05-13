import AppLayout from "@/layouts/AppLayout";

function HomePage() {
  return (
    <AppLayout>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
        <h1 className="text-4xl font-bold">
          Journal App
        </h1>

        <p className="mt-4 text-slate-400">
          Your calm digital space.
        </p>
      </div>
    </AppLayout>
  );
}

export default HomePage;