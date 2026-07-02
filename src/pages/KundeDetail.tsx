import { useParams, Link, useLocation } from "wouter";
import { 
  useGetCustomerSummary, 
  useUpdateCustomer, 
  useDeleteCustomer,
  getGetCustomerSummaryQueryKey
} from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MapPin, Phone, Mail, Building, Briefcase, FileText, Calendar as CalendarIcon, 
  Edit, Trash2, ArrowLeft, Plus
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";

export default function KundeDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);
  
  const customerId = id ? parseInt(id, 10) : undefined;

  const { data: summary, isLoading } = useGetCustomerSummary(customerId ?? 0, {
    query: { enabled: !!customerId, queryKey: getGetCustomerSummaryQueryKey(customerId ?? 0) }
  });
  
  const deleteMutation = useDeleteCustomer();

  const handleDelete = () => {
    if (!customerId) return;
    deleteMutation.mutate({ id: customerId }, {
      onSuccess: () => {
        toast.success("Kunde gelöscht");
        setLocation("/kunden");
      },
      onError: () => {
        toast.error("Fehler beim Löschen des Kunden. Bitte zuerst alle Projekte entfernen.");
        setDeleteOpen(false);
      }
    });
  };

  if (isLoading) {
    return <div className="space-y-6">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-64 w-full" />
    </div>;
  }

  if (!summary) {
    return <div className="p-8 text-center">Kunde nicht gefunden.</div>;
  }

  const { customer, projects, offers, recentEvents } = summary;

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <Link href="/kunden">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" /> Zurück zur Übersicht
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Edit className="w-4 h-4" /> Bearbeiten
          </Button>
          
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 gap-2 border-destructive/20">
                <Trash2 className="w-4 h-4" /> Löschen
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Kunden löschen</DialogTitle>
              </DialogHeader>
              <p className="py-4 text-sm text-muted-foreground">
                Sind Sie sicher, dass Sie den Kunden <strong>{customer.firstName} {customer.lastName}</strong> löschen möchten? 
                Dies kann nicht rückgängig gemacht werden.
              </p>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Abbrechen</Button>
                </DialogClose>
                <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
                  {deleteMutation.isPending ? "Löscht..." : "Endgültig löschen"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Customer Profile Card */}
      <Card className="glass-card border-t-4 border-t-primary">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-heading font-bold shrink-0">
              {customer.firstName[0]}{customer.lastName[0]}
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">
                  {customer.firstName} {customer.lastName}
                </h1>
                {customer.company && (
                  <p className="text-lg text-muted-foreground flex items-center gap-2 mt-1">
                    <Building className="w-5 h-5" /> {customer.company}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-sm">
                    {customer.street ? (
                      <>
                        <p>{customer.street} {customer.houseNumber}</p>
                        <p>{customer.zip} {customer.city}</p>
                      </>
                    ) : (
                      <span className="text-muted-foreground italic">Keine Adresse hinterlegt</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm">{customer.phone || <span className="text-muted-foreground italic">Kein Telefon</span>}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm">{customer.email || <span className="text-muted-foreground italic">Keine E-Mail</span>}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="projekte" className="w-full">
        <TabsList className="glass mb-4 border border-border/50 h-auto p-1 bg-background/40">
          <TabsTrigger value="projekte" className="gap-2 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Briefcase className="w-4 h-4" /> Projekte <Badge variant="secondary" className="ml-1 h-5">{projects.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="angebote" className="gap-2 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <FileText className="w-4 h-4" /> Angebote <Badge variant="secondary" className="ml-1 h-5">{offers.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="termine" className="gap-2 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <CalendarIcon className="w-4 h-4" /> Termine <Badge variant="secondary" className="ml-1 h-5">{recentEvents.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projekte">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle className="text-lg">Projekte des Kunden</CardTitle>
              <Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> Neues Projekt</Button>
            </CardHeader>
            <CardContent className="p-0">
              {projects.length > 0 ? (
                <div className="divide-y divide-border/50">
                  {projects.map(project => (
                    <div key={project.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                      <div>
                        <Link href={`/projekte/${project.id}`} className="font-medium text-primary hover:underline underline-offset-4">
                          {project.title}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-1">Letzte Änderung: {formatDate(project.updatedAt)}</p>
                      </div>
                      <Badge variant="outline">{project.status}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">Keine Projekte vorhanden.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="angebote">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle className="text-lg">Angebote</CardTitle>
              <Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> Neues Angebot</Button>
            </CardHeader>
            <CardContent className="p-0">
              {offers.length > 0 ? (
                <div className="divide-y divide-border/50">
                  {offers.map(offer => (
                    <div key={offer.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                      <div>
                        <Link href={`/angebote/${offer.id}`} className="font-medium text-primary hover:underline underline-offset-4">
                          {offer.offerNumber} - {offer.projectTitle}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-1">Gültig bis: {formatDate(offer.validUntil)}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-medium">{formatCurrency(offer.totalPrice)}</div>
                        <Badge variant="outline" className="mt-1">{offer.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">Keine Angebote vorhanden.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="termine">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle className="text-lg">Letzte & Kommende Termine</CardTitle>
              <Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> Termin anlegen</Button>
            </CardHeader>
            <CardContent className="p-0">
              {recentEvents.length > 0 ? (
                <div className="divide-y divide-border/50">
                  {recentEvents.map(event => (
                    <div key={event.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                      <div>
                        <div className="font-medium">{event.title}</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <CalendarIcon className="w-3 h-3" /> {formatDate(event.date)} {event.time && `um ${event.time} Uhr`}
                        </p>
                      </div>
                      <Badge variant="outline">{event.type}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">Keine Termine vorhanden.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
