import { useParams, Link } from "wouter";
import { 
  useGetProject, 
  getGetProjectQueryKey,
  useListRooms,
  getListRoomsQueryKey,
  useListTimeEntries,
  getListTimeEntriesQueryKey
} from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowLeft, Edit, Users, MapPin, AlignLeft, CheckCircle2, 
  Clock, Plus, Calendar as CalendarIcon, FileText, Box
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ProjektDetail() {
  const { id } = useParams<{ id: string }>();
  
  const projectId = id ? parseInt(id, 10) : undefined;

  const { data: project, isLoading } = useGetProject(projectId ?? 0, {
    query: { enabled: !!projectId, queryKey: getGetProjectQueryKey(projectId ?? 0) }
  });

  const { data: rooms, isLoading: isLoadingRooms } = useListRooms(
    { projectId: projectId ?? 0 },
    { query: { enabled: !!projectId, queryKey: getListRoomsQueryKey({ projectId: projectId ?? 0 }) } }
  );
  const { data: timeEntries, isLoading: isLoadingTimes } = useListTimeEntries(
    { projectId: projectId ?? 0 },
    { query: { enabled: !!projectId, queryKey: getListTimeEntriesQueryKey({ projectId: projectId ?? 0 }) } }
  );

  if (isLoading) {
    return <div className="space-y-6">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-40 w-full" />
    </div>;
  }

  if (!project) {
    return <div className="p-8 text-center text-muted-foreground">Projekt nicht gefunden.</div>;
  }

  const totalHours = timeEntries?.reduce((sum, entry) => sum + entry.hoursWorked, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Link href="/projekte">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" /> Zurück zum Board
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Edit className="w-4 h-4" /> Bearbeiten
          </Button>
          <Button size="sm" className="gap-2 bg-teal-600 hover:bg-teal-700">
            <CheckCircle2 className="w-4 h-4" /> Status ändern
          </Button>
        </div>
      </div>

      <Card className="glass-card overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-teal-400 to-primary"></div>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">{project.status}</Badge>
                  {project.type && <Badge variant="secondary">{project.type}</Badge>}
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {formatDate(project.createdAt)}
                  </span>
                </div>
                <h1 className="text-3xl font-heading font-bold">{project.title}</h1>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href={`/kunden/${project.customerId}`}>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Kunde</p>
                      <p className="font-medium group-hover:underline underline-offset-4">{project.customerName}</p>
                    </div>
                  </div>
                </Link>

                <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-muted/20">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Montageort</p>
                    <p className="font-medium text-sm">
                      {project.street
                        ? `${project.street} ${project.houseNumber ?? ""}, ${project.zip ?? ""} ${project.city ?? ""}`.trim()
                        : "Beim Kunden"}
                    </p>
                  </div>
                </div>
              </div>
              
              {project.notes && (
                <div className="mt-4 p-4 bg-muted/10 rounded-lg border border-border/30">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                    <AlignLeft className="w-3 h-3" /> Notizen
                  </h4>
                  <p className="text-sm whitespace-pre-wrap">{project.notes}</p>
                </div>
              )}
            </div>
            
            <div className="w-full md:w-64 space-y-3 shrink-0">
              <Card className="bg-background/40 shadow-none">
                <CardHeader className="py-3 px-4 border-b border-border/50 bg-muted/20">
                  <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="p-2 flex flex-col gap-1">
                  <Button variant="ghost" className="justify-start text-sm h-8" size="sm">+ Raum hinzufügen</Button>
                  <Button variant="ghost" className="justify-start text-sm h-8" size="sm">+ Material planen</Button>
                  <Button variant="ghost" className="justify-start text-sm h-8" size="sm">+ Zeit erfassen</Button>
                  <Button variant="ghost" className="justify-start text-sm h-8 text-amber-600" size="sm">+ Angebot erstellen</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="raeume" className="w-full">
        <TabsList className="glass mb-4 border border-border/50 h-auto p-1 bg-background/40 w-full justify-start overflow-x-auto flex-nowrap hide-scrollbar">
          <TabsTrigger value="raeume" className="gap-2 py-2.5">
            <Box className="w-4 h-4" /> Räume <Badge variant="secondary" className="ml-1 h-5">{rooms?.length || 0}</Badge>
          </TabsTrigger>
          <TabsTrigger value="zeiten" className="gap-2 py-2.5">
            <Clock className="w-4 h-4" /> Zeiten
          </TabsTrigger>
          <TabsTrigger value="material" className="gap-2 py-2.5">Material</TabsTrigger>
          <TabsTrigger value="termine" className="gap-2 py-2.5">Termine</TabsTrigger>
          <TabsTrigger value="angebote" className="gap-2 py-2.5">Angebote</TabsTrigger>
        </TabsList>

        <TabsContent value="raeume">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle className="text-lg">Räume & Maße</CardTitle>
              <Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> Neuer Raum</Button>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingRooms ? (
                <div className="p-4 space-y-3"><Skeleton className="h-10 w-full"/><Skeleton className="h-10 w-full"/></div>
              ) : rooms && rooms.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Raumname</TableHead>
                      <TableHead>Dimensionen (L×B×H)</TableHead>
                      <TableHead>Fläche/Volumen</TableHead>
                      <TableHead>Fenster/Türen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rooms.map(room => {
                      const area = (room.length && room.width) ? (room.length * room.width).toFixed(1) : "-";
                      const volume = (room.length && room.width && room.height) ? (room.length * room.width * room.height).toFixed(1) : "-";
                      return (
                        <TableRow key={room.id}>
                          <TableCell className="font-medium">{room.name}</TableCell>
                          <TableCell className="font-mono text-xs">
                            {room.length || '-'}m × {room.width || '-'}m × {room.height || '-'}m
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {area} m² / {volume} m³
                          </TableCell>
                          <TableCell className="text-sm">
                            F: {room.windows || 0} / T: {room.doors || 0}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                  <Box className="w-8 h-8 mb-2 opacity-20" />
                  <p>Keine Räume erfasst.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zeiten">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle className="text-lg">Zeiterfassung</CardTitle>
              <Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> Zeit erfassen</Button>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingTimes ? (
                <div className="p-4 space-y-3"><Skeleton className="h-10 w-full"/></div>
              ) : timeEntries && timeEntries.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Datum</TableHead>
                        <TableHead>Techniker</TableHead>
                        <TableHead>Dauer</TableHead>
                        <TableHead className="text-right">Stunden</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {timeEntries.map(entry => (
                        <TableRow key={entry.id}>
                          <TableCell className="font-mono text-sm">{formatDate(entry.date)}</TableCell>
                          <TableCell>{entry.technician}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {entry.startTime} - {entry.endTime}
                            <div className="text-xs truncate max-w-[200px]">{entry.description}</div>
                          </TableCell>
                          <TableCell className="text-right font-mono font-medium">{entry.hoursWorked.toFixed(2)} h</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="p-4 bg-muted/20 border-t border-border flex justify-between items-center font-bold">
                    <span>Gesamtaufwand:</span>
                    <span className="font-mono text-lg text-primary">{totalHours.toFixed(2)} h</span>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                  <Clock className="w-8 h-8 mb-2 opacity-20" />
                  <p>Keine Zeiten erfasst.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="material">
          <Card className="glass-card p-12 flex flex-col items-center justify-center text-muted-foreground">
            <p>Materialplanung in Entwicklung...</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="termine">
          <Card className="glass-card p-12 flex flex-col items-center justify-center text-muted-foreground">
            <CalendarIcon className="w-8 h-8 mb-2 opacity-20" />
            <p>Projekttermine in Entwicklung...</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="angebote">
          <Card className="glass-card p-12 flex flex-col items-center justify-center text-muted-foreground">
            <FileText className="w-8 h-8 mb-2 opacity-20" />
            <p>Angebote in Entwicklung...</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
