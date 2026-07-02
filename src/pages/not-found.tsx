import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="text-6xl font-mono text-primary font-bold">404</div>
      <h2 className="text-2xl font-heading font-semibold">Seite nicht gefunden</h2>
      <p className="text-muted-foreground max-w-md">
        Die von Ihnen gesuchte Seite existiert nicht oder wurde verschoben.
      </p>
      <Link href="/">
        <Button>Zurück zum Dashboard</Button>
      </Link>
    </div>
  );
}
