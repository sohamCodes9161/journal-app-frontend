import { Link } from "react-router-dom";

import PageHeader from "@/components/ui/PageHeader";

import { Button } from "@/components/ui";

import JournalCard from "../components/JournalCard";

import useJournals from "../hooks/useJournals";

function JournalFeedPage() {
  const { data, isLoading, isError } = useJournals();

  if (isLoading) {
    return (
      <div
        className="
          flex
          min-h-[60vh]
          items-center
          justify-center
        "
      >
        <div className="space-y-4 text-center">
          <div
            className="
              mx-auto
              h-12
              w-12
              animate-spin
              rounded-full
              border-2
              border-violet-400/30
              border-t-violet-400
            "
          />

          <p className="text-sm text-slate-400">
            Gathering your reflections...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="
          flex
          min-h-[60vh]
          flex-col
          items-center
          justify-center
          text-center
        "
      >
        <div
          className="
            rounded-3xl
            border
            border-red-500/20
            bg-red-500/10
            px-8
            py-6
            backdrop-blur-xl
          "
        >
          <h2 className="text-xl font-semibold text-white">
            Failed to load journals
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Something interrupted the connection. Please try again.
          </p>
        </div>
      </div>
    );
  }

  if (!data || data.journals.length === 0) {
    return (
      <div className="space-y-10">
        <PageHeader
          title="Your Journals"
          description="Moments, reflections, and thoughts captured over time."
        />

        <div
          className="
            relative
            flex
            min-h-[55vh]
            flex-col
            items-center
            justify-center
            overflow-hidden
            rounded-[32px]
            border
            border-white/10
            bg-gradient-to-br
            from-white/[0.06]
            to-white/[0.02]
            px-8
            py-16
            text-center
            backdrop-blur-xl
          "
        >
          {/* glow */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-br
              from-violet-500/10
              via-transparent
              to-cyan-500/10
            "
          />

          <div className="relative z-10 max-w-xl">
            <div
              className="
                mx-auto
                mb-6
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-white/5
                text-3xl
                backdrop-blur-xl
              "
            >
              ✨
            </div>

            <h2
              className="
                text-3xl
                font-semibold
                tracking-tight
                text-white
              "
            >
              Your thoughts will begin to gather here
            </h2>

            <p
              className="
                mt-4
                text-base
                leading-8
                text-slate-400
              "
            >
              Start writing gently. Every reflection, memory, and feeling
              becomes part of your journey over time.
            </p>

            <Link to="/app/journals/new">
              <Button className="mt-8">Write Your First Journal</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* top section */}
      <div
        className="
          flex
          flex-col
          gap-6
          md:flex-row
          md:items-end
          md:justify-between
        "
      >
        <PageHeader
          title="Your Journals"
          description="Moments, reflections, and thoughts captured over time."
        />

        <Link to="/app/journals/new">
          <Button
            className="
              shadow-lg
              shadow-violet-500/20
            "
          >
            New Journal
          </Button>
        </Link>
      </div>

      {/* subtle divider glow */}
      <div
        className="
          h-px
          w-full
          bg-gradient-to-r
          from-transparent
          via-white/10
          to-transparent
        "
      />

      {/* journals grid */}
      <div className="grid gap-6">
        {data?.journals?.map((journal) => (
          <JournalCard key={journal.id} journal={journal} />
        ))}
      </div>
    </div>
  );
}

export default JournalFeedPage;
