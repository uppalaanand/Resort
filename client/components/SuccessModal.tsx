import React from "react";
import { CheckCircle } from "lucide-react";

interface Props {
  open: boolean;
  title: string;
  description: string;
  buttonText?: string;
  onClose: () => void;
}

const SuccessModal: React.FC<Props> = ({
  open,
  title,
  description,
  buttonText = "OK",
  onClose,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-admin-card rounded-xl border border-admin-border shadow-2xl p-6 w-full max-w-sm text-center animate-admin-scaleIn">
        {/* ICON */}
        <div className="flex justify-center mb-4">
          <div className="text-green-400 bg-green-500/10 p-3 rounded-full">
            <CheckCircle className="w-14 h-14" />
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-admin-heading mb-2">{title}</h2>

        {/* DESCRIPTION */}
        <p className="text-admin-text text-sm mb-6">{description}</p>

        {/* BUTTON */}
        <button
          onClick={onClose}
          className="bg-vp-gold text-vp-dark hover:bg-amber-400 font-semibold rounded-lg px-5 py-2.5 w-full transition-all"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;