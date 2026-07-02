import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Einstellungen() {
  return (
    <div className="max-w-3xl space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Firmendaten</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Firmenname</Label>
            <Input defaultValue="KTM Kältetechnik Meister" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Straße & Hausnummer</Label>
              <Input defaultValue="Musterstraße 1" />
            </div>
            <div className="grid grid-cols-[1fr_2fr] gap-2">
              <div className="grid gap-2">
                <Label>PLZ</Label>
                <Input defaultValue="12345" />
              </div>
              <div className="grid gap-2">
                <Label>Ort</Label>
                <Input defaultValue="Musterstadt" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Telefon</Label>
              <Input defaultValue="+49 123 456789" />
            </div>
            <div className="grid gap-2">
              <Label>E-Mail</Label>
              <Input defaultValue="info@ktm-kaelte.de" />
            </div>
          </div>
          <Button className="mt-4">Speichern</Button>
        </CardContent>
      </Card>
      
      <Card className="glass-card bg-muted/20">
        <CardContent className="p-6 flex justify-between items-center">
          <div>
            <p className="font-medium">System</p>
            <p className="text-sm text-muted-foreground">Version 0.1.0-beta</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
