import type {
  Customer, Material, Project, Room, TimeEntry, Offer, Order, CalendarEvent,
} from "./types";
import { ProjectStatus, OfferStatus, OrderStatus, EventType } from "./types";

const STORAGE_KEY = "ktm-mock-db-v1";

interface Db {
  customers: Customer[];
  materials: Material[];
  projects: Project[];
  rooms: Room[];
  timeEntries: TimeEntry[];
  offers: Offer[];
  orders: Order[];
  events: CalendarEvent[];
  nextId: Record<string, number>;
}

function seedDb(): Db {
  const customers: Customer[] = [
    { id: 1, firstName: "Ahmed", lastName: "Mohamed", company: "KTM Kältetechnik", email: "ahmed@ktm-kaelte.at", phone: "+43 660 1234567", street: "Hauptstraße", houseNumber: "12", zip: "1100", city: "Wien" },
    { id: 2, firstName: "Sabine", lastName: "Gruber", company: "Gruber Gastro GmbH", email: "s.gruber@gastro.at", phone: "+43 664 9988776", street: "Marktgasse", houseNumber: "4", zip: "1010", city: "Wien" },
    { id: 3, firstName: "Marko", lastName: "Novak", company: "", email: "marko.novak@gmail.com", phone: "+43 676 5544332", street: "Ringstraße", houseNumber: "22", zip: "4020", city: "Linz" },
  ];

  const materials: Material[] = [
    { id: 1, name: "Kupferrohr 22mm", category: "Kupferrohre", articleNumber: "CU-022", manufacturer: "Wieland", price: 8.9, unit: "m", stock: 120 },
    { id: 2, name: "R744 CO2 Kältemittel", category: "Kältemittel", articleNumber: "R744-10", manufacturer: "Linde", price: 24.5, unit: "kg", stock: 40 },
    { id: 3, name: "Verbundregler ProCONTROL", category: "Regelungstechnik", articleNumber: "PC-3000", manufacturer: "Carel", price: 890, unit: "Stk", stock: 3 },
    { id: 4, name: "Isolierung Armaflex 19mm", category: "Isolierung", articleNumber: "AF-019", manufacturer: "Armacell", price: 3.2, unit: "m", stock: 8 },
    { id: 5, name: "Klimagerät Split 3.5kW", category: "Klimageräte", articleNumber: "SPL-35", manufacturer: "Daikin", price: 650, unit: "Stk", stock: 2 },
  ];

  const projects: Project[] = [
    { id: 1, title: "CO2-Verbundanlage Supermarkt Nord", status: ProjectStatus.Montage, type: "Kälte", customerId: 2, customerName: "Sabine Gruber", street: "Marktgasse", houseNumber: "4", zip: "1010", city: "Wien", notes: "Transkritischer Booster, WRG-Station VL 40°C/RL 30°C.", createdAt: "2026-05-12T08:00:00Z", updatedAt: "2026-06-28T10:00:00Z" },
    { id: 2, title: "Wartung Kühlmöbel Filiale 3", status: ProjectStatus.Neu, type: "Wartung", customerId: 2, customerName: "Sabine Gruber", createdAt: "2026-06-20T08:00:00Z", updatedAt: "2026-06-20T08:00:00Z" },
    { id: 3, title: "Klimaanlage Bürogebäude", status: ProjectStatus.Angebot, type: "Klima", customerId: 3, customerName: "Marko Novak", createdAt: "2026-06-01T08:00:00Z", updatedAt: "2026-06-25T08:00:00Z" },
  ];

  const rooms: Room[] = [
    { id: 1, projectId: 1, name: "Verkaufsraum", length: 24, width: 14, height: 3.5, windows: 6, doors: 2 },
    { id: 2, projectId: 1, name: "Kühlzelle TK", length: 4, width: 3, height: 2.5, windows: 0, doors: 1 },
  ];

  const timeEntries: TimeEntry[] = [
    { id: 1, projectId: 1, date: "2026-06-25", technician: "Ahmed Mohamed", startTime: "07:30", endTime: "16:00", description: "Rohrverlegung NK/TK Kreis", hoursWorked: 8.5 },
    { id: 2, projectId: 1, date: "2026-06-26", technician: "Ahmed Mohamed", startTime: "07:30", endTime: "15:00", description: "Anschluss Flash Tank", hoursWorked: 7.5 },
  ];

  const offers: Offer[] = [
    { id: 1, offerNumber: "ANG-2026-014", customerId: 2, customerName: "Sabine Gruber", projectId: 1, projectTitle: "CO2-Verbundanlage Supermarkt Nord", offerDate: "2026-05-10", validUntil: "2026-07-10", totalPrice: 84500, status: OfferStatus.Angebot_angenommen },
    { id: 2, offerNumber: "ANG-2026-021", customerId: 3, customerName: "Marko Novak", projectId: 3, projectTitle: "Klimaanlage Bürogebäude", offerDate: "2026-06-02", validUntil: "2026-08-02", totalPrice: 12800, status: OfferStatus.Angebot_gesendet },
  ];

  const orders: Order[] = [
    { id: 1, projectId: 1, projectTitle: "CO2-Verbundanlage Supermarkt Nord", customerName: "Sabine Gruber", supplier: "Carel Österreich", orderDate: "2026-05-20", status: OrderStatus.Geliefert, items: [{ id: 1, name: "Verbundregler ProCONTROL", quantity: 1 }] },
    { id: 2, projectId: 3, projectTitle: "Klimaanlage Bürogebäude", customerName: "Marko Novak", supplier: "Daikin Austria", orderDate: "2026-06-15", status: OrderStatus.Bestellt, items: [{ id: 2, name: "Klimagerät Split 3.5kW", quantity: 2 }] },
  ];

  const events: CalendarEvent[] = [
    { id: 1, title: "Montage Verbundanlage - Tag 3", type: EventType.Montage, date: "2026-07-06", time: "07:30", customerName: "Sabine Gruber", projectTitle: "CO2-Verbundanlage Supermarkt Nord", technician: "Ahmed Mohamed" },
    { id: 2, title: "Wartung Kühlmöbel", type: EventType.Wartung, date: "2026-07-08", time: "09:00", customerName: "Sabine Gruber", projectTitle: "Wartung Kühlmöbel Filiale 3", technician: "Ahmed Mohamed" },
    { id: 3, title: "Besichtigung Bürogebäude", type: EventType.Besichtigung, date: "2026-07-10", time: "13:00", customerName: "Marko Novak", projectTitle: "Klimaanlage Bürogebäude", technician: "Ahmed Mohamed" },
  ];

  return {
    customers, materials, projects, rooms, timeEntries, offers, orders, events,
    nextId: { customers: 4, materials: 6, projects: 4, rooms: 3, timeEntries: 3, offers: 3, orders: 3, events: 4 },
  };
}

let db: Db | null = null;

function load(): Db {
  if (db) return db;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    db = raw ? (JSON.parse(raw) as Db) : seedDb();
  } catch {
    db = seedDb();
  }
  return db;
}

function persist() {
  if (!db) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // Speicher voll - ignorieren, Daten bleiben zumindest im Speicher
  }
}

function nextId(entity: keyof Db["nextId"]): number {
  const d = load();
  const id = d.nextId[entity];
  d.nextId[entity] = id + 1;
  return id;
}

// simulierte Netzwerklatenz, damit Loading-States/Skeletons sichtbar bleiben
export function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const mockDb = {
  get: load,
  save: persist,
  nextId,
  reset: () => {
    db = seedDb();
    persist();
  },
};
