import { useQuery, useMutation, type UseQueryOptions } from "@tanstack/react-query";
import { mockDb, delay } from "./store";
import type {
  Customer, Material, Project, Offer, Order, CalendarEvent,
  CustomerSummary, DashboardStats, ActivityItem,
} from "./types";

export * from "./types";

/**
 * Lokaler Ersatz für das fehlende Backend-Paket "@workspace/api-client-react".
 * Implementiert dieselbe Hook-Oberfläche (Namen, Query-Keys, Rückgabeform),
 * damit die Seiten unverändert bleiben. Daten liegen aktuell in localStorage
 * (siehe ./store.ts) - sobald ein echtes Backend existiert, wird nur diese
 * Datei ausgetauscht.
 */

type QueryOpts<T> = { query?: Partial<UseQueryOptions<T>> };

// ---------- Kunden ----------

export function getListCustomersQueryKey(params?: { search?: string }) {
  return ["customers", "list", params?.search ?? ""] as const;
}

export function useListCustomers(params?: { search?: string }) {
  return useQuery({
    queryKey: getListCustomersQueryKey(params),
    queryFn: async () => {
      const { customers } = mockDb.get();
      const q = params?.search?.toLowerCase().trim();
      const filtered = !q
        ? customers
        : customers.filter((c) =>
            `${c.firstName} ${c.lastName} ${c.company ?? ""} ${c.city ?? ""}`.toLowerCase().includes(q)
          );
      return delay(filtered);
    },
  });
}

export function useCreateCustomer() {
  return useMutation({
    mutationFn: async ({ data }: { data: Omit<Customer, "id"> }) => {
      const db = mockDb.get();
      const customer: Customer = { id: mockDb.nextId("customers"), ...data };
      db.customers.push(customer);
      mockDb.save();
      return delay(customer);
    },
  });
}

export function useUpdateCustomer() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Customer> }) => {
      const db = mockDb.get();
      const idx = db.customers.findIndex((c) => c.id === id);
      if (idx === -1) throw new Error("Kunde nicht gefunden");
      db.customers[idx] = { ...db.customers[idx], ...data };
      mockDb.save();
      return delay(db.customers[idx]);
    },
  });
}

export function useDeleteCustomer() {
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      const db = mockDb.get();
      const hasProjects = db.projects.some((p) => p.customerId === id);
      if (hasProjects) throw new Error("Kunde hat noch Projekte");
      db.customers = db.customers.filter((c) => c.id !== id);
      mockDb.save();
      return delay({ success: true });
    },
  });
}

export function getGetCustomerSummaryQueryKey(id: number) {
  return ["customers", "summary", id] as const;
}

export function useGetCustomerSummary(id: number, opts?: QueryOpts<CustomerSummary | undefined>) {
  return useQuery({
    queryKey: getGetCustomerSummaryQueryKey(id),
    queryFn: async () => {
      const db = mockDb.get();
      const customer = db.customers.find((c) => c.id === id);
      if (!customer) return delay(undefined);
      const projects = db.projects.filter((p) => p.customerId === id);
      const offers = db.offers.filter((o) => o.customerId === id);
      const recentEvents = db.events.filter((e) => e.customerName === `${customer.firstName} ${customer.lastName}`);
      const summary: CustomerSummary = { customer, projects, offers, recentEvents };
      return delay(summary);
    },
    enabled: opts?.query?.enabled,
  });
}

// ---------- Materialien ----------

export function useListMaterials(params?: { search?: string }) {
  return useQuery({
    queryKey: ["materials", "list", params?.search ?? ""],
    queryFn: async () => {
      const { materials } = mockDb.get();
      const q = params?.search?.toLowerCase().trim();
      const filtered = !q
        ? materials
        : materials.filter((m) =>
            `${m.name} ${m.articleNumber ?? ""} ${m.manufacturer ?? ""}`.toLowerCase().includes(q)
          );
      return delay(filtered);
    },
  });
}

// ---------- Projekte ----------

export function useListProjects() {
  return useQuery({
    queryKey: ["projects", "list"],
    queryFn: async () => delay(mockDb.get().projects),
  });
}

export function getGetProjectQueryKey(id: number) {
  return ["projects", "detail", id] as const;
}

export function useGetProject(id: number, opts?: QueryOpts<Project | undefined>) {
  return useQuery({
    queryKey: getGetProjectQueryKey(id),
    queryFn: async () => delay(mockDb.get().projects.find((p) => p.id === id)),
    enabled: opts?.query?.enabled,
  });
}

export function getListRoomsQueryKey(params: { projectId: number }) {
  return ["rooms", "list", params.projectId] as const;
}

export function useListRooms(params: { projectId: number }, opts?: QueryOpts<any>) {
  return useQuery({
    queryKey: getListRoomsQueryKey(params),
    queryFn: async () => delay(mockDb.get().rooms.filter((r) => r.projectId === params.projectId)),
    enabled: opts?.query?.enabled,
  });
}

export function getListTimeEntriesQueryKey(params: { projectId: number }) {
  return ["timeEntries", "list", params.projectId] as const;
}

export function useListTimeEntries(params: { projectId: number }, opts?: QueryOpts<any>) {
  return useQuery({
    queryKey: getListTimeEntriesQueryKey(params),
    queryFn: async () => delay(mockDb.get().timeEntries.filter((t) => t.projectId === params.projectId)),
    enabled: opts?.query?.enabled,
  });
}

// ---------- Angebote ----------

export function useListOffers(params?: { status?: string }) {
  return useQuery({
    queryKey: ["offers", "list", params?.status ?? ""],
    queryFn: async () => {
      const { offers } = mockDb.get();
      return delay(params?.status ? offers.filter((o) => o.status === params.status) : offers);
    },
  });
}

// ---------- Bestellungen ----------

export function useListOrders(params?: { status?: string }) {
  return useQuery({
    queryKey: ["orders", "list", params?.status ?? ""],
    queryFn: async () => {
      const { orders } = mockDb.get();
      return delay(params?.status ? orders.filter((o) => o.status === params.status) : orders);
    },
  });
}

// ---------- Kalender ----------

export function useListEvents(params?: { from?: string; to?: string }) {
  return useQuery({
    queryKey: ["events", "list", params?.from ?? "", params?.to ?? ""],
    queryFn: async () => {
      const { events } = mockDb.get();
      if (!params?.from || !params?.to) return delay(events);
      return delay(events.filter((e) => e.date >= params.from! && e.date <= params.to!));
    },
  });
}

// ---------- Dashboard ----------

export function useGetDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const db = mockDb.get();
      const today = new Date().toISOString().slice(0, 10);
      const stats: DashboardStats = {
        totalCustomers: db.customers.length,
        openProjects: db.projects.filter((p) => p.status !== "Fertig").length,
        totalProjects: db.projects.length,
        openOffers: db.offers.filter((o) => o.status === "Offen" || o.status === "Gesendet").length,
        totalOffers: db.offers.length,
        openOrders: db.orders.filter((o) => o.status !== "Abgeschlossen").length,
        totalOrders: db.orders.length,
        todayEvents: db.events.filter((e) => e.date === today).length,
        totalRevenue: db.offers.filter((o) => o.status === "Angenommen").reduce((s, o) => s + o.totalPrice, 0),
      };
      return delay(stats);
    },
  });
}

export function useGetRecentActivity() {
  return useQuery({
    queryKey: ["dashboard", "activity"],
    queryFn: async () => {
      const db = mockDb.get();
      const items: ActivityItem[] = [
        ...db.offers.slice(-3).map((o) => ({
          id: o.id, type: "offer" as const, title: `${o.offerNumber} - ${o.projectTitle ?? ""}`,
          subtitle: o.customerName, timestamp: o.offerDate, status: o.status,
        })),
        ...db.projects.slice(-3).map((p) => ({
          id: p.id, type: "project" as const, title: p.title,
          subtitle: p.customerName, timestamp: p.updatedAt, status: p.status,
        })),
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      return delay(items);
    },
  });
}

export function useGetUpcomingEvents() {
  return useQuery({
    queryKey: ["dashboard", "upcoming-events"],
    queryFn: async () => {
      const db = mockDb.get();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const upcoming = db.events
        .filter((e) => new Date(e.date) >= today)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 7);
      return delay(upcoming);
    },
  });
}
