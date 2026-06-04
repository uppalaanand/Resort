import React from "react";
import { Trash2 } from "lucide-react";

interface Props {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteModal: React.FC<Props> = ({
  open,
  title,
  description,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-admin-card rounded-xl border border-admin-border shadow-2xl p-6 w-full max-w-sm animate-admin-scaleIn">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-red-400 bg-red-500/10 p-3 rounded-full">
            <Trash2 size={20} />
          </div>
          <h2 className="text-admin-heading font-bold text-lg">{title}</h2>
        </div>

        <p className="text-admin-text text-sm mb-6">{description}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="bg-admin-surface text-admin-text hover:bg-admin-hover border border-admin-border rounded-lg px-5 py-2.5 transition-all"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="bg-red-500 text-white hover:bg-red-600 rounded-lg px-5 py-2.5 font-semibold transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;