import { useState } from "react";
import { useListOrders, OrderStatus } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, ShoppingCart, Calendar as CalendarIcon, Filter, Factory } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function Bestellungen() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  
  const { data: orders, isLoading } = useListOrders({ status: statusFilter || undefined });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case OrderStatus.Offen: return <Badge variant="warning">Offen</Badge>;
      case OrderStatus.Bestellt: return <Badge variant="info">Bestellt</Badge>;
      case OrderStatus.Geliefert: return <Badge variant="success">Geliefert</Badge>;
      case OrderStatus.Abgeschlossen: return <Badge variant="secondary">Abgeschlossen</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredOrders = orders?.filter(order => 
    !search || 
    (order.customerName && order.customerName.toLowerCase().includes(search.toLowerCase())) ||
    (order.projectTitle && order.projectTitle.toLowerCase().includes(search.toLowerCase())) ||
    (order.supplier && order.supplier.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Suchen..." 
              className="pl-9 glass"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <select 
              className="h-10 pl-3 pr-8 rounded-md border border-border bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "")}
            >
              <option value="">Alle Status</option>
              <option value={OrderStatus.Offen}>Offen</option>
              <option value={OrderStatus.Bestellt}>Bestellt</option>
              <option value={OrderStatus.Geliefert}>Geliefert</option>
              <option value={OrderStatus.Abgeschlossen}>Abgeschlossen</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Neue Bestellung
        </Button>
      </div>

      <Card className="glass-card overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Projekt / Kunde</TableHead>
                <TableHead>Lieferant</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead className="text-center">Artikel</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-40 mb-1" /><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-5 w-8 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  </TableRow>
                ))
              ) : filteredOrders?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <ShoppingCart className="w-8 h-8 opacity-20" />
                      Keine Bestellungen gefunden.
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders?.map((order) => (
                  <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <div className="font-medium text-foreground">{order.projectTitle}</div>
                      <div className="text-xs text-muted-foreground mt-1">{order.customerName}</div>
                    </TableCell>
                    <TableCell>
                      {order.supplier ? (
                        <div className="flex items-center gap-2 text-sm">
                          <Factory className="w-3.5 h-3.5 text-muted-foreground" />
                          {order.supplier}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="w-3.5 h-3.5 text-muted-foreground" />
                        {formatDate(order.orderDate)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="font-mono">{order.items?.length || 0}</Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(order.status)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
