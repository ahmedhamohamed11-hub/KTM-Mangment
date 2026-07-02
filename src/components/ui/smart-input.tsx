import * as React from "react";
import { cn } from "@/lib/utils";
import { useSmartSuggestions } from "@/hooks/use-smart-terms";
import { Clock } from "lucide-react";

export interface SmartInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Kategorie zum Lernen/Vorschlagen, z.B. SMART_TERM_CATEGORIES.KUNDE_VORNAME */
  category: string;
  /** Max. Anzahl Vorschläge (Default 6) */
  maxSuggestions?: number;
}

/**
 * Input-Feld mit "Smart Learning": merkt sich jeden eingegebenen Wert pro
 * Kategorie und schlägt beim nächsten Mal passende, nach Häufigkeit
 * sortierte Begriffe vor (z.B. "W" -> "Wohnzimmer").
 *
 * Drop-in-Ersatz für <Input>, funktioniert mit react-hook-form (forwardRef,
 * value/onChange/onBlur kompatibel).
 */
const SmartInput = React.forwardRef<HTMLInputElement, SmartInputProps>(
  ({ className, category, maxSuggestions = 6, onChange, onBlur, onKeyDown, value, ...props }, forwardedRef) => {
    const innerRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(forwardedRef, () => innerRef.current as HTMLInputElement);

    const [open, setOpen] = React.useState(false);
    const [highlighted, setHighlighted] = React.useState(0);
    const currentValue = typeof value === "string" ? value : "";

    const { suggestions, record } = useSmartSuggestions(category, currentValue, maxSuggestions);
    const showDropdown = open && currentValue.trim().length > 0 && suggestions.length > 0;

    const selectSuggestion = (suggestion: string) => {
      const fakeEvent = {
        target: { value: suggestion },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(fakeEvent);
      record(suggestion);
      setOpen(false);
      innerRef.current?.focus();
    };

    return (
      <div className="relative">
        <input
          ref={innerRef}
          type="text"
          className={cn(
            "flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          value={value}
          autoComplete="off"
          onChange={(e) => {
            setOpen(true);
            setHighlighted(0);
            onChange?.(e);
          }}
          onFocus={() => setOpen(true)}
          onBlur={(e) => {
            // Klick auf Vorschlag darf nicht durch onBlur unterbrochen werden
            window.setTimeout(() => setOpen(false), 120);
            if (currentValue.trim().length >= 2) record(currentValue);
            onBlur?.(e);
          }}
          onKeyDown={(e) => {
            if (showDropdown) {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setHighlighted((h) => Math.min(h + 1, suggestions.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setHighlighted((h) => Math.max(h - 1, 0));
              } else if (e.key === "Enter" && suggestions[highlighted]) {
                e.preventDefault();
                selectSuggestion(suggestions[highlighted]);
              } else if (e.key === "Escape") {
                setOpen(false);
              }
            }
            onKeyDown?.(e);
          }}
          {...props}
        />
        {showDropdown && (
          <div
            className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
            role="listbox"
          >
            {suggestions.map((s, i) => (
              <button
                type="button"
                key={s}
                role="option"
                aria-selected={i === highlighted}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm cursor-pointer",
                  i === highlighted ? "bg-accent text-accent-foreground" : "hover:bg-accent/60"
                )}
                onMouseEnter={() => setHighlighted(i)}
                // onMouseDown statt onClick, damit es vor dem Input-onBlur feuert
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectSuggestion(s);
                }}
              >
                <Clock className="h-3.5 w-3.5 shrink-0 opacity-40" />
                <span className="truncate">{s}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);
SmartInput.displayName = "SmartInput";

export { SmartInput };
