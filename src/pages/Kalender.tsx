import { useState } from "react";
import { useListEvents, EventType } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Users, MapPin } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import { de } from "date-fns/locale";

export default function Kalender() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfMonth(monthStart); // Would normally adjust for grid to start on Monday
  const endDate = endOfMonth(monthEnd); // Would normally adjust for grid to end on Sunday
  
  // Get events for current view
  const { data: events, isLoading } = useListEvents({
    from: format(monthStart, "yyyy-MM-dd"),
    to: format(monthEnd, "yyyy-MM-dd")
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const today = () => setCurrentMonth(new Date());

  const days = eachDayOfInterval({
    start: monthStart, // Simplified calendar, just showing days of month
    end: monthEnd
  });

  const getEventBadgeVar = (type: string) => {
    switch(type) {
      case EventType.Besichtigung: return "warning";
      case EventType.Montage: return "default";
      case EventType.Wartung: return "info";
      case EventType.Reparatur: return "destructive";
      case EventType.Service: return "secondary";
      default: return "outline";
    }
  };

  const getEventColor = (type: string) => {
    switch(type) {
      case EventType.Besichtigung: return "bg-[#c17a45] text-white";
      case EventType.Montage: return "bg-primary text-white";
      case EventType.Wartung: return "bg-[#5c63d1] text-white";
      case EventType.Reparatur: return "bg-destructive text-white";
      case EventType.Service: return "bg-purple-500 text-white";
      default: return "bg-muted text-foreground";
    }
  };

  // Find next 5 events
  const upcomingEvents = [...(events || [])]
    .filter(e => new Date(e.date) >= new Date(new Date().setHours(0,0,0,0)))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)]">
      {/* Calendar Main */}
      <Card className="glass-card flex-1 flex flex-col overflow-hidden border-t-4 border-t-primary">
        <CardHeader className="py-4 px-6 border-b border-border/50 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-heading font-bold min-w-[200px] capitalize">
              {format(currentMonth, "MMMM yyyy", { locale: de })}
            </h2>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={today} className="h-8">Heute</Button>
              <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" /> Termin
          </Button>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-y-auto no-scrollbar">
          {isLoading ? (
            <div className="p-8 space-y-4">
              <Skeleton className="h-[400px] w-full" />
            </div>
          ) : (
            <div className="grid grid-cols-7 border-l border-t border-border/50 min-h-full">
              {/* Day headers */}
              {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => (
                <div key={day} className="p-2 text-center font-semibold text-xs border-r border-b border-border/50 bg-muted/20">
                  {day}
                </div>
              ))}
              
              {/* Offset for first day (simplified: 1 is Mon, 0 is Sun) */}
              {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
                <div key={`empty-${i}`} className="p-2 min-h-[100px] border-r border-b border-border/50 bg-muted/5 opacity-50" />
              ))}
              
              {days.map(day => {
                const dayEvents = events?.filter(e => isSameDay(new Date(e.date), day)) || [];
                return (
                  <div 
                    key={day.toISOString()} 
                    className={`p-2 min-h-[100px] border-r border-b border-border/50 hover:bg-muted/10 transition-colors ${!isSameMonth(day, monthStart) ? 'opacity-50 bg-muted/5' : ''} ${isToday(day) ? 'bg-primary/5' : ''}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full ${isToday(day) ? 'bg-primary text-white' : ''}`}>
                        {format(day, 'd')}
                      </span>
                    </div>
                    <div className="space-y-1 mt-2">
                      {dayEvents.map(event => (
                        <div 
                          key={event.id} 
                          className={`text-xs p-1 px-2 rounded-md truncate cursor-pointer shadow-sm ${getEventColor(event.type)}`}
                          title={event.title}
                        >
                          {event.time && <span className="font-mono mr-1 opacity-80">{event.time}</span>}
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sidebar */}
      <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
        <Card className="glass-card flex-1">
          <CardHeader className="py-4 px-5 border-b border-border/50">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-primary" /> Anstehende Termine
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-sm">
                Keine Termine geplant.
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="p-4 hover:bg-muted/30 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-sm group-hover:text-primary transition-colors">{event.title}</h4>
                      <Badge variant={getEventBadgeVar(event.type) as any} className="text-[10px] ml-2 shrink-0">{event.type}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1.5 mt-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{format(new Date(event.date), "dd.MM.yyyy")} {event.time && `• ${event.time}`}</span>
                      </div>
                      {(event.customerName || event.projectTitle) && (
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5" />
                          <span className="truncate">{event.customerName} {event.projectTitle ? `/ ${event.projectTitle}` : ''}</span>
                        </div>
                      )}
                      {event.technician && (
                        <div className="flex items-center gap-2">
                          <div className="w-3.5 h-3.5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[8px]">
                            {event.technician[0]}
                          </div>
                          <span className="truncate">Tech: {event.technician}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
