import { useState } from "react";
import { Link } from "wouter";
import { useListCustomers, useCreateCustomer, getListCustomersQueryKey } from "@/lib/api-client";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SmartInput } from "@/components/ui/smart-input";
import { SMART_TERM_CATEGORIES } from "@/hooks/use-smart-terms";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, MapPin, Phone, Mail, Building, Briefcase } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const customerSchema = z.object({
  firstName: z.string().min(2, "Vorname ist erforderlich"),
  lastName: z.string().min(2, "Nachname ist erforderlich"),
  company: z.string().optional(),
  email: z.string().email("Ungültige E-Mail").or(z.literal("")).optional(),
  phone: z.string().optional(),
  street: z.string().optional(),
  houseNumber: z.string().optional(),
  zip: z.string().optional(),
  city: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export default function Kunden() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: customers, isLoading } = useListCustomers({ search: search || undefined });
  const createMutation = useCreateCustomer();

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      firstName: "", lastName: "", company: "", email: "", phone: "", street: "", houseNumber: "", zip: "", city: ""
    }
  });

  const onSubmit = (data: CustomerFormValues) => {
    createMutation.mutate({ data }, {
      onSuccess: () => {
        toast.success("Kunde erfolgreich angelegt");
        setOpen(false);
        form.reset();
        queryClient.invalidateQueries({ queryKey: getListCustomersQueryKey() });
      },
      onError: () => {
        toast.error("Fehler beim Anlegen des Kunden");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Kunden suchen..." 
            className="pl-9 glass"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Neuer Kunde
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Neuen Kunden anlegen</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vorname *</FormLabel>
                        <FormControl><SmartInput category={SMART_TERM_CATEGORIES.KUNDE_VORNAME} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nachname *</FormLabel>
                        <FormControl><SmartInput category={SMART_TERM_CATEGORIES.KUNDE_NACHNAME} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Firma (Optional)</FormLabel>
                      <FormControl><SmartInput category={SMART_TERM_CATEGORIES.FIRMA} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-Mail</FormLabel>
                        <FormControl><Input type="email" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefon</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-[1fr_80px] gap-4">
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Straße</FormLabel>
                        <FormControl><SmartInput category={SMART_TERM_CATEGORIES.STRASSE} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="houseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nr.</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-4">
                  <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PLZ</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stadt</FormLabel>
                        <FormControl><SmartInput category={SMART_TERM_CATEGORIES.STADT} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Abbrechen</Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Speichert..." : "Speichern"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="glass-card overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Kunde</TableHead>
                <TableHead>Kontakt</TableHead>
                <TableHead>Standort</TableHead>
                <TableHead>Projekte</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-32 mb-1" /><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28 mb-1" /><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-8 rounded-full" /></TableCell>
                  </TableRow>
                ))
              ) : customers?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    Keine Kunden gefunden.
                  </TableCell>
                </TableRow>
              ) : (
                customers?.map((customer) => (
                  <TableRow key={customer.id} className="group cursor-pointer">
                    <TableCell>
                      <Link href={`/kunden/${customer.id}`} className="block">
                        <div className="font-semibold text-primary group-hover:underline underline-offset-4">
                          {customer.lastName}, {customer.firstName}
                        </div>
                        {customer.company && (
                          <div className="flex items-center text-xs text-muted-foreground mt-1 gap-1">
                            <Building className="w-3 h-3" /> {customer.company}
                          </div>
                        )}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {customer.phone && (
                          <div className="flex items-center text-sm gap-2">
                            <Phone className="w-3.5 h-3.5 text-muted-foreground" /> {customer.phone}
                          </div>
                        )}
                        {customer.email && (
                          <div className="flex items-center text-sm gap-2">
                            <Mail className="w-3.5 h-3.5 text-muted-foreground" /> {customer.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {customer.city ? (
                        <div className="flex items-center text-sm gap-2">
                          <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>{customer.zip} {customer.city}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">
                        {/* the summary endpoint has project counts, list endpoint doesn't include it yet, just show a badge */}
                        <Briefcase className="w-3 h-3 mr-1" /> ?
                      </Badge>
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
