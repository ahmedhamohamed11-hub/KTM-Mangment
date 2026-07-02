// Diese Typen/Enums bilden nach, was das eigentliche Backend-Paket
// "@workspace/api-client-react" (nicht Teil dieses Repos) liefern würde.
// Sobald ein echtes Backend angebunden wird, können diese durch die
// generierten Typen von dort ersetzt werden - die Feldnamen sind bewusst
// deckungsgleich mit dem, was die Seiten in src/pages bereits erwarten.

export enum ProjectStatus {
  Neu = "Neu",
  Besichtigung = "Besichtigung",
  Angebot = "Angebot",
  Montage = "Montage",
  Fertig = "Fertig",
}

export enum OfferStatus {
  Angebot_offen = "Offen",
  Angebot_gesendet = "Gesendet",
  Angebot_angenommen = "Angenommen",
  Angebot_abgelehnt = "Abgelehnt",
}

export enum OrderStatus {
  Offen = "Offen",
  Bestellt = "Bestellt",
  Geliefert = "Geliefert",
  Abgeschlossen = "Abgeschlossen",
}

export enum EventType {
  Besichtigung = "Besichtigung",
  Montage = "Montage",
  Wartung = "Wartung",
  Reparatur = "Reparatur",
  Service = "Service",
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  company?: string;
  email?: string;
  phone?: string;
  street?: string;
  houseNumber?: string;
  zip?: string;
  city?: string;
}

export interface Material {
  id: number;
  name: string;
  category?: string;
  articleNumber?: string;
  manufacturer?: string;
  price?: number;
  unit?: string;
  stock?: number;
}

export interface Project {
  id: number;
  title: string;
  status: ProjectStatus;
  type?: string;
  customerId: number;
  customerName?: string;
  street?: string;
  houseNumber?: string;
  zip?: string;
  city?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: number;
  projectId: number;
  name: string;
  length?: number;
  width?: number;
  height?: number;
  windows?: number;
  doors?: number;
}

export interface TimeEntry {
  id: number;
  projectId: number;
  date: string;
  technician: string;
  startTime: string;
  endTime: string;
  description?: string;
  hoursWorked: number;
}

export interface Offer {
  id: number;
  offerNumber: string;
  customerId: number;
  customerName?: string;
  projectId?: number;
  projectTitle?: string;
  offerDate: string;
  validUntil?: string;
  totalPrice: number;
  status: OfferStatus;
}

export interface Order {
  id: number;
  projectId?: number;
  projectTitle?: string;
  customerName?: string;
  supplier?: string;
  orderDate: string;
  status: OrderStatus;
  items?: { id: number; name: string; quantity: number }[];
}

export interface CalendarEvent {
  id: number;
  title: string;
  type: EventType;
  date: string;
  time?: string;
  customerName?: string;
  projectTitle?: string;
  technician?: string;
}

export interface CustomerSummary {
  customer: Customer;
  projects: Project[];
  offers: Offer[];
  recentEvents: CalendarEvent[];
}

export interface DashboardStats {
  totalCustomers: number;
  openProjects: number;
  totalProjects: number;
  openOffers: number;
  totalOffers: number;
  openOrders: number;
  totalOrders: number;
  todayEvents: number;
  totalRevenue: number;
}

export interface ActivityItem {
  id: number;
  type: "customer" | "project" | "offer" | "order" | "event";
  title: string;
  subtitle?: string;
  timestamp: string;
  status?: string;
}
