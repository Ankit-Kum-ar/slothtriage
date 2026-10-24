export default function Header() {
  return (
    <header className="border-b border-border pb-3 sm:pb-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Triage Workspace
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
          Drop messy threads, extract critical action items, and generate 1-click ready replies.
        </p>
      </div>
    </header>
  );
}
