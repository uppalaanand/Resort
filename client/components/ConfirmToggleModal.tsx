import React from "react";

interface Props {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmToggleModal: React.FC<Props> = ({
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
        <h2 className="text-admin-heading font-bold text-lg mb-2">{title}</h2>
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
            className="bg-vp-gold text-vp-dark hover:bg-amber-400 font-semibold rounded-lg px-5 py-2.5 transition-all"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmToggleModal;