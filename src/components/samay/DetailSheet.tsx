import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export function DetailSheet({
  open,
  onClose,
  eyebrow,
  title,
  description,
  children,
}: {
  open: boolean;
  onClose: () => void;
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const closeCallback = useRef(onClose);
  closeCallback.current = onClose;
  useEffect(() => {
    if (!open) return;
    previousFocus.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCallback.current();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      requestAnimationFrame(() => previousFocus.current?.focus({ preventScroll: true }));
    };
  }, [open]);
  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <div
      className="sheet-layer"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onTouchEnd={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="detail-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        aria-describedby="sheet-description"
        onMouseDown={(event) => event.stopPropagation()}
        onTouchStart={(event) => event.stopPropagation()}
      >
        <div className="sheet-handle" aria-hidden="true" />
        <button
          ref={closeRef}
          type="button"
          className="icon-button sheet-close"
          aria-label="Close details"
          onClick={onClose}
        >
          <X size={21} />
        </button>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id="sheet-title" className="sheet-title">
          {title}
        </h2>
        <p id="sheet-description" className="sheet-description">
          {description}
        </p>
        {children}
      </section>
    </div>,
    document.body,
  );
}
