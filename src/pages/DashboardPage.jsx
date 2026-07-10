import { Card, PageHeader } from "@/components/ui";
import { useTheme } from "../theme";

function DashboardPage() {
  const { themeId, setTheme } = useTheme();

  // Single function to handle the switch logic
  const toggleTheme = () => {
    if (themeId === "midnight-ink") {
      setTheme("forest-mist");
    } else {
      setTheme("midnight-ink");
    }
  };

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="A gentle overview of your thoughts, habits, and growth."
      />

      {/* Just ONE button to rule them all */}
      <button
        onClick={toggleTheme}
        className="mb-6 rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-white font-medium transition-transform active:scale-95"
      >
        ✨ Switch to{" "}
        {themeId === "midnight-ink" ? "Forest Theme" : "Midnight Theme"}
      </button>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card className="p-6">Mood Overview</Card>
        <Card className="p-6">Journal Activity</Card>
        <Card className="p-6">Weekly Reflection</Card>
      </div>
    </>
  );
}

export default DashboardPage;
