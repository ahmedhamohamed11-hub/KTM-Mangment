import { useListMaterials } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Package, Factory, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

export default function Materialien() {
  const [search, setSearch] = useState("");
  const { data: materials, isLoading } = useListMaterials({ search: search || undefined });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Material suchen (Name, Art.-Nr.)..." 
            className="pl-9 glass"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Neues Material
        </Button>
      </div>

      <Card className="glass-card overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Artikel</TableHead>
                <TableHead>Kategorie</TableHead>
                <TableHead className="text-right">Preis</TableHead>
                <TableHead className="text-right">Bestand</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-40 mb-1" /><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-10 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : materials?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="w-8 h-8 opacity-20" />
                      Keine Materialien gefunden.
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                materials?.map((material) => (
                  <TableRow key={material.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <div className="font-medium text-foreground">{material.name}</div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        {material.articleNumber && <span className="font-mono">Art: {material.articleNumber}</span>}
                        {material.manufacturer && <span className="flex items-center gap-1"><Factory className="w-3 h-3" /> {material.manufacturer}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      {material.category ? (
                        <Badge variant="secondary" className="font-normal">{material.category}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {material.price ? (
                        <div className="font-mono">{formatCurrency(material.price)}</div>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                      {material.unit && <div className="text-[10px] text-muted-foreground">pro {material.unit}</div>}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {(material.stock !== undefined && material.stock !== null && material.stock < 5) && (
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        )}
                        <span className={`font-mono font-medium ${
                          (material.stock !== undefined && material.stock !== null && material.stock <= 0) 
                            ? 'text-destructive' 
                            : ''
                        }`}>
                          {material.stock ?? '-'}
                        </span>
                      </div>
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
