"use client";

import { Pencil } from "lucide-react";
import { MoreMenu } from "./MoreMenu";

export interface ListingActionsProps {
  onEdit: () => void;
  onView: () => void;
  onBoost: () => void;
  onDuplicate: () => void;
  onMarkSold: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

export function ListingActions(props: ListingActionsProps) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <button
        type="button"
        onClick={props.onEdit}
        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-brand-light hover:border-brand-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
      >
        <Pencil className="w-4 h-4" aria-hidden="true" />
        Edit
      </button>
      <MoreMenu
        onView={props.onView}
        onBoost={props.onBoost}
        onDuplicate={props.onDuplicate}
        onMarkSold={props.onMarkSold}
        onArchive={props.onArchive}
        onDelete={props.onDelete}
      />
    </div>
  );
}
