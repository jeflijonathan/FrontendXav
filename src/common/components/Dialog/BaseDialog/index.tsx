import React, { type ReactNode } from 'react';

interface BaseDialogProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

const BaseDialog: React.FC<BaseDialogProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div
                className="w-full max-w-md rounded-lg bg-white shadow-xl transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};
export default BaseDialog;