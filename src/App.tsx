import { Switch, Route } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Kunden from "@/pages/Kunden";
import KundeDetail from "@/pages/KundeDetail";
import Projekte from "@/pages/Projekte";
import ProjektDetail from "@/pages/ProjektDetail";
import Kalender from "@/pages/Kalender";
import Materialien from "@/pages/Materialien";
import Angebote from "@/pages/Angebote";
import Bestellungen from "@/pages/Bestellungen";
import Einstellungen from "@/pages/Einstellungen";
import NotFound from "@/pages/not-found";

export default function App() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/kunden" component={Kunden} />
        <Route path="/kunden/:id" component={KundeDetail} />
        <Route path="/projekte" component={Projekte} />
        <Route path="/projekte/:id" component={ProjektDetail} />
        <Route path="/kalender" component={Kalender} />
        <Route path="/materialien" component={Materialien} />
        <Route path="/angebote" component={Angebote} />
        <Route path="/bestellungen" component={Bestellungen} />
        <Route path="/einstellungen" component={Einstellungen} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}
