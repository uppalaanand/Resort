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
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md text-center animate-scale-in">
        {/* ICON */}
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-14 h-14 text-green-500" />
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-bold mb-2">{title}</h2>

        {/* DESCRIPTION */}
        <p className="text-gray-600 mb-6">{description}</p>

        {/* BUTTON */}
        <button
          onClick={onClose}
          className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;