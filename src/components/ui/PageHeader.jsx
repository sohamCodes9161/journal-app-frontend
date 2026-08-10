import Typography from "@/components/ui/Typography";

function PageHeader({ title, description, className = "" }) {
  return (
    <div className={className}>
      <Typography variant="h1">{title}</Typography>
      {description && (
        <Typography
          variant="muted"
          className="mt-1 max-w-2xl text-xs sm:text-sm"
        >
          {description}
        </Typography>
      )}
    </div>
  );
}

export default PageHeader;
