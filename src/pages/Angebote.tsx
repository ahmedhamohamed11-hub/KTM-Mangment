import { useState } from "react";
import { Link } from "wouter";
import { useListOffers, OfferStatus } from "@/lib/api-client";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, FileText, Calendar as CalendarIcon, Filter } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function Angebote() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OfferStatus | "">("");
  
  const { data: offers, isLoading } = useListOffers({ status: statusFilter || undefined });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case OfferStatus.Angebot_offen: return <Badge variant="warning">Offen</Badge>;
      case OfferStatus.Angebot_gesendet: return <Badge variant="info">Gesendet</Badge>;
      case OfferStatus.Angebot_angenommen: return <Badge variant="success">Angenommen</Badge>;
      case OfferStatus.Angebot_abgelehnt: return <Badge variant="destructive">Abgelehnt</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredOffers = offers?.filter(offer => 
    !search || 
    offer.offerNumber.toLowerCase().includes(search.toLowerCase()) || 
    (offer.customerName && offer.customerName.toLowerCase().includes(search.toLowerCase())) ||
    (offer.projectTitle && offer.projectTitle.toLowerCase().includes(search.toLowerCase()))
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
              onChange={(e) => setStatusFilter(e.target.value as OfferStatus | "")}
            >
              <option value="">Alle Status</option>
              <option value={OfferStatus.Angebot_offen}>Offen</option>
              <option value={OfferStatus.Angebot_gesendet}>Gesendet</option>
              <option value={OfferStatus.Angebot_angenommen}>Angenommen</option>
              <option value={OfferStatus.Angebot_abgelehnt}>Abgelehnt</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Neues Angebot
        </Button>
      </div>

      <Card className="glass-card overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nummer</TableHead>
                <TableHead>Kunde / Projekt</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead className="text-right">Gesamtbetrag</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40 mb-1" /><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  </TableRow>
                ))
              ) : filteredOffers?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-8 h-8 opacity-20" />
                      Keine Angebote gefunden.
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOffers?.map((offer) => (
                  <TableRow key={offer.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-mono font-medium">{offer.offerNumber}</TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">{offer.customerName}</div>
                      <div className="text-xs text-muted-foreground mt-1">{offer.projectTitle}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="w-3.5 h-3.5 text-muted-foreground" />
                        {formatDate(offer.offerDate)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      {formatCurrency(offer.totalPrice)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(offer.status)}
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
