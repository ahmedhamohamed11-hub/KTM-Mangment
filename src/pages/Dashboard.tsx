import { useGetDashboardStats, useGetRecentActivity, useGetUpcomingEvents } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Briefcase, FileText, ShoppingCart, Calendar as CalendarIcon, Euro, ArrowRight, Activity, Clock } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: activity, isLoading: activityLoading } = useGetRecentActivity();
  const { data: events, isLoading: eventsLoading } = useGetUpcomingEvents();

  const statCards = [
    { title: "Kunden", value: stats?.totalCustomers, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Offene Projekte", value: stats?.openProjects, total: stats?.totalProjects, icon: Briefcase, color: "text-teal-500", bg: "bg-teal-500/10" },
    { title: "Offene Angebote", value: stats?.openOffers, total: stats?.totalOffers, icon: FileText, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Offene Bestellungen", value: stats?.openOrders, total: stats?.totalOrders, icon: ShoppingCart, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Heutige Termine", value: stats?.todayEvents, icon: CalendarIcon, color: "text-rose-500", bg: "bg-rose-500/10" },
    { title: "Gesamtumsatz", value: stats ? formatCurrency(stats.totalRevenue) : undefined, icon: Euro, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  const quickNav = [
    { title: "Neuer Kunde", href: "/kunden?new=1", desc: "Kundenprofil anlegen" },
    { title: "Neues Projekt", href: "/projekte?new=1", desc: "Auftrag erfassen" },
    { title: "Angebot erstellen", href: "/angebote?new=1", desc: "Kostenvoranschlag" },
    { title: "Material bestellen", href: "/bestellungen?new=1", desc: "Teile ordern" },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="glass-card hover:translate-y-[-2px] transition-transform duration-200">
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                {statsLoading ? (
                  <Skeleton className="h-7 w-16" />
                ) : (
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-mono font-bold">{stat.value}</h3>
                    {stat.total !== undefined && (
                      <span className="text-sm text-muted-foreground font-mono">/ {stat.total}</span>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Main Activity */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Nav */}
          <section>
            <h2 className="text-lg font-heading font-bold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Schnellzugriff
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {quickNav.map((nav, i) => (
                <Link key={i} href={nav.href} className="group block">
                  <Card className="h-full bg-primary/5 hover:bg-primary/10 border-primary/20 transition-colors cursor-pointer border border-transparent">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-primary group-hover:underline decoration-primary/50 underline-offset-4">{nav.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{nav.desc}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* Recent Activity */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-bold flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> Kürzliche Aktivitäten
              </h2>
            </div>
            <Card className="glass-card">
              <CardContent className="p-0">
                {activityLoading ? (
                  <div className="p-6 space-y-4">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                  </div>
                ) : activity && activity.length > 0 ? (
                  <div className="divide-y divide-border/50">
                    {activity.map((item: NonNullable<typeof activity>[number]) => (
                      <div key={item.id} className="flex items-center p-4 hover:bg-muted/30 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mr-4 shrink-0">
                          {item.type === 'customer' && <Users className="w-4 h-4 text-primary" />}
                          {item.type === 'project' && <Briefcase className="w-4 h-4 text-teal-600" />}
                          {item.type === 'offer' && <FileText className="w-4 h-4 text-amber-600" />}
                          {item.type === 'order' && <ShoppingCart className="w-4 h-4 text-indigo-600" />}
                          {item.type === 'event' && <CalendarIcon className="w-4 h-4 text-rose-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                        </div>
                        <div className="text-right ml-4 shrink-0">
                          <p className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(item.timestamp)}</p>
                          {item.status && (
                            <Badge variant="outline" className="mt-1 text-[10px] py-0">{item.status}</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    Keine Aktivitäten gefunden.
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Right Column - Events */}
        <div className="space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-bold flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" /> Nächste 7 Tage
              </h2>
              <Link href="/kalender" className="text-sm text-primary hover:underline flex items-center">
                Alle <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
            <Card className="glass-card">
              <CardContent className="p-0">
                {eventsLoading ? (
                  <div className="p-6 space-y-4">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                  </div>
                ) : events && events.length > 0 ? (
                  <div className="divide-y divide-border/50">
                    {events.map((event: NonNullable<typeof events>[number]) => {
                      const isBesichtigung = event.type === 'Besichtigung';
                      const isMontage = event.type === 'Montage';
                      const isWartung = event.type === 'Wartung';
                      const isReparatur = event.type === 'Reparatur';
                      
                      type BadgeVariant = "default" | "warning" | "info" | "destructive" | "secondary" | "outline";
                      let badgeVar: BadgeVariant = "default";
                      if (isBesichtigung) badgeVar = "warning";
                      if (isMontage) badgeVar = "default";
                      if (isWartung) badgeVar = "info";
                      if (isReparatur) badgeVar = "destructive";

                      return (
                        <div key={event.id} className="p-4 hover:bg-muted/30 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-sm">{event.title}</h4>
                            <Badge variant={badgeVar} className="text-[10px]">{event.type}</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="w-3 h-3" />
                              <span>{formatDate(event.date)} {event.time && `• ${event.time}`}</span>
                            </div>
                            {(event.customerName || event.projectTitle) && (
                              <div className="flex items-center gap-2">
                                <Users className="w-3 h-3" />
                                <span className="truncate">{event.customerName} {event.projectTitle ? `/ ${event.projectTitle}` : ''}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                    <CalendarIcon className="w-8 h-8 mb-2 opacity-20" />
                    <p>Keine anstehenden Termine.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
