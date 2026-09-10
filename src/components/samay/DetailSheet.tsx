import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";

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
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-overlay" />
        <Dialog.Content className="detail-sheet">
          <div className="sheet-handle" aria-hidden="true" />
          <Dialog.Close className="icon-button sheet-close" aria-label="Close details">
            <X size={21} />
          </Dialog.Close>
          <p className="eyebrow">{eyebrow}</p>
          <Dialog.Title className="sheet-title">{title}</Dialog.Title>
          <Dialog.Description className="sheet-description">{description}</Dialog.Description>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
