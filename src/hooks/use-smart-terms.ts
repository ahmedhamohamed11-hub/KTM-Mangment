import { useCallback, useEffect, useState } from "react";

/**
 * Smart Auto-Vervollständigung / Smart Learning
 *
 * Merkt sich alle Begriffe, die der Nutzer in SmartInput-Feldern einträgt,
 * pro Kategorie (z.B. "kundenname", "raumname", "material"), zusammen mit
 * einem Häufigkeits-Zähler. Vorschläge werden nach Häufigkeit sortiert.
 *
 * Aktuell in localStorage gespeichert (pro Gerät). Sobald ein Backend
 * angebunden ist, kann recordTerm/getSuggestions 1:1 auf eine Supabase-
 * Tabelle "smart_terms" umgestellt werden, ohne die Komponenten-API
 * (SmartInput) zu verändern - der Speicher-Layer ist hier gekapselt.
 */

const STORAGE_KEY = "ktm-smart-terms";
const EVENT_NAME = "ktm-smart-terms-updated";
const MAX_TERMS_PER_CATEGORY = 500;

export interface SmartTermEntry {
  value: string;
  count: number;
  lastUsed: number;
}

type SmartTermsStore = Record<string, Record<string, SmartTermEntry>>;

function readStore(): SmartTermsStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SmartTermsStore) : {};
  } catch {
    return {};
  }
}

function writeStore(store: SmartTermsStore) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {
    // Speicher voll o.ä. - stillschweigend ignorieren, Feature ist nice-to-have
  }
}

/** Begriff lernen / Häufigkeit erhöhen. Leere oder sehr kurze Werte werden ignoriert. */
export function recordSmartTerm(category: string, rawValue: string | undefined | null) {
  const value = (rawValue ?? "").trim();
  if (value.length < 2) return;

  const store = readStore();
  const bucket = store[category] ?? {};
  const key = value.toLowerCase();
  const existing = bucket[key];

  bucket[key] = {
    value: existing ? existing.value : value, // erste Schreibweise bleibt maßgeblich
    count: (existing?.count ?? 0) + 1,
    lastUsed: Date.now(),
  };

  // Kategorie-Größe begrenzen: seltenste/älteste Einträge zuerst rauswerfen
  const entries = Object.entries(bucket);
  if (entries.length > MAX_TERMS_PER_CATEGORY) {
    entries
      .sort((a, b) => a[1].count - b[1].count || a[1].lastUsed - b[1].lastUsed)
      .slice(0, entries.length - MAX_TERMS_PER_CATEGORY)
      .forEach(([k]) => delete bucket[k]);
  }

  store[category] = bucket;
  writeStore(store);
}

/** Bis zu `limit` Vorschläge für eine Kategorie, gefiltert nach Präfix, nach Häufigkeit sortiert. */
export function getSmartSuggestions(category: string, query: string, limit = 6): string[] {
  const store = readStore();
  const bucket = store[category];
  if (!bucket) return [];

  const q = query.trim().toLowerCase();
  const entries = Object.values(bucket);

  const filtered = q
    ? entries.filter((e) => e.value.toLowerCase().startsWith(q) && e.value.toLowerCase() !== q)
    : entries;

  return filtered
    .sort((a, b) => b.count - a.count || b.lastUsed - a.lastUsed)
    .slice(0, limit)
    .map((e) => e.value);
}

/** React-Hook: liefert live aktualisierte Vorschläge für eine Kategorie + Query. */
export function useSmartSuggestions(category: string, query: string, limit = 6) {
  const [suggestions, setSuggestions] = useState<string[]>(() =>
    getSmartSuggestions(category, query, limit)
  );

  useEffect(() => {
    setSuggestions(getSmartSuggestions(category, query, limit));
  }, [category, query, limit]);

  useEffect(() => {
    const handler = () => setSuggestions(getSmartSuggestions(category, query, limit));
    window.addEventListener(EVENT_NAME, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVENT_NAME, handler);
      window.removeEventListener("storage", handler);
    };
  }, [category, query, limit]);

  const record = useCallback((value: string) => recordSmartTerm(category, value), [category]);

  return { suggestions, record };
}

/** Häufig genutzte Kategorien als benannte Konstanten, damit Tippfehler vermieden werden. */
export const SMART_TERM_CATEGORIES = {
  KUNDE_VORNAME: "kunde_vorname",
  KUNDE_NACHNAME: "kunde_nachname",
  FIRMA: "firma",
  ANSPRECHPARTNER: "ansprechpartner",
  STADT: "stadt",
  STRASSE: "strasse",
  PROJEKTNAME: "projektname",
  RAUMNAME: "raumname",
  MATERIALNAME: "materialname",
  GERAETETYP: "geraetetyp",
  HERSTELLER: "hersteller",
  MODELL: "modell",
  NOTIZ: "notiz",
  TAETIGKEIT: "taetigkeit",
} as const;
