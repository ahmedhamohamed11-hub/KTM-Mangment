import { useState } from "react";
import { Link } from "wouter";
import { useListProjects, ProjectStatus } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Users, Calendar, MoreHorizontal } from "lucide-react";
import { formatDate } from "@/lib/utils";

// Kanban Columns
const COLUMNS = [
  ProjectStatus.Neu,
  ProjectStatus.Besichtigung,
  ProjectStatus.Angebot,
  ProjectStatus.Montage,
  ProjectStatus.Fertig
];

export default function Projekte() {
  const { data: projects, isLoading } = useListProjects();

  const getProjectsByStatus = (status: string) => {
    return projects?.filter(p => p.status === status) || [];
  };

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-sm text-muted-foreground">Projekt-Pipeline</h2>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Neues Projekt
        </Button>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden flex gap-4 pb-4 px-1 no-scrollbar">
        {COLUMNS.map((col) => {
          const colProjects = getProjectsByStatus(col);
          
          return (
            <div key={col} className="flex-shrink-0 w-80 flex flex-col h-full bg-muted/20 rounded-xl border border-border/50 overflow-hidden">
              <div className="p-3 border-b border-border/50 bg-background/50 backdrop-blur-sm flex justify-between items-center sticky top-0">
                <h3 className="font-heading font-semibold text-sm">{col}</h3>
                <Badge variant="secondary" className="rounded-full w-6 h-6 p-0 flex justify-center items-center text-xs">
                  {colProjects.length}
                </Badge>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {isLoading ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <Card key={i} className="glass-card shadow-sm border-white/20 dark:border-black/20">
                      <CardContent className="p-3 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardContent>
                    </Card>
                  ))
                ) : colProjects.length === 0 ? (
                  <div className="h-24 border-2 border-dashed border-border/50 rounded-lg flex items-center justify-center text-xs text-muted-foreground opacity-50">
                    Leer
                  </div>
                ) : (
                  colProjects.map(project => (
                    <Link key={project.id} href={`/projekte/${project.id}`}>
                      <Card className="glass-card shadow-sm hover:shadow-md transition-all hover:border-primary/30 cursor-pointer group bg-background/70 hover:bg-background">
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                              {project.title}
                            </h4>
                            <Button variant="ghost" size="icon" className="w-6 h-6 -mr-1 -mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          {project.customerName && (
                            <div className="flex items-center text-xs text-muted-foreground mt-2 gap-1.5">
                              <Users className="w-3 h-3" />
                              <span className="truncate">{project.customerName}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mt-3">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              {project.type || "Kälte"}
                            </Badge>
                            <div className="flex items-center text-[10px] text-muted-foreground gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(project.createdAt)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
