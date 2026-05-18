import { Button } from "@/components/ui";

import useLogout from "@/features/auth/hooks/useLogout";

function Navbar() {
  const logoutMutation = useLogout();

  return (
    <header
      className="
        sticky
        top-0
        z-40
        border-b
        border-white/10
        bg-slate-950/40
        backdrop-blur-xl
      "
    >
      <div className="flex h-16 items-center justify-between px-4">
        <div>
          <h1 className="text-sm font-medium text-slate-300">Welcome back</h1>
        </div>

        <Button
          variant="secondary"
          size="sm"
          isLoading={logoutMutation.isPending}
          onClick={() => logoutMutation.mutate()}
        >
          Logout
        </Button>
      </div>
    </header>
  );
}

export default Navbar;
