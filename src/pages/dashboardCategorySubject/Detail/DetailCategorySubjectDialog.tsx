import { Button, CircularProgress } from "@mui/material";
import { Close } from "@mui/icons-material";
import useCategorySubjectDetail from "./hook/useCategorySubjectDetail";

interface DetailCategorySubjectDialogProps {
    id: string | null;
    isOpen: boolean;
    onClose: () => void;
}

const DetailCategorySubjectDialog = ({ id, isOpen, onClose }: DetailCategorySubjectDialogProps) => {
    const { detail, isLoading } = useCategorySubjectDetail(id);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center" 
            style={{ 
                backdropFilter: "blur(6px)", 
                WebkitBackdropFilter: "blur(6px)", 
                backgroundColor: "rgba(0,0,0,0.4)" 
            }} 
            onClick={onClose}
        >
            <div 
                className="bg-theme-primary border border-light-dark rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4" 
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-light-dark">
                    <h2 className="text-xl font-bold text-primary-txt">Category Subject Details</h2>
                    <button 
                        onClick={onClose} 
                        className="text-secondary-txt hover:text-primary-txt transition-colors"
                    >
                        <Close />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5 text-gray-100">
                    {isLoading ? (
                        <div className="flex justify-center py-10">
                            <CircularProgress size={36} color="primary" />
                        </div>
                    ) : detail ? (
                        <div className="space-y-4">
                            {/* ID Field */}
                            <div>
                                <label className="text-xs font-semibold text-secondary-txt block mb-1">ID</label>
                                <div className="px-4 py-2 bg-black/10 border border-light-dark rounded-lg text-sm select-all font-mono break-all text-primary-txt">
                                    {detail.id}
                                </div>
                            </div>

                            {/* Name Field */}
                            <div>
                                <label className="text-xs font-semibold text-secondary-txt block mb-1">Name</label>
                                <div className="px-4 py-2 bg-black/10 border border-light-dark rounded-lg text-sm text-primary-txt font-semibold">
                                    {detail.name}
                                </div>
                            </div>

                            {/* Status Field */}
                            <div>
                                <label className="text-xs font-semibold text-secondary-txt block mb-1">Status</label>
                                <div className="mt-1">
                                    {detail.status ? (
                                        <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-semibold">
                                            Aktif
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-xs font-semibold">
                                            Tidak Aktif
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Created At */}
                            <div>
                                <label className="text-xs font-semibold text-secondary-txt block mb-1">Created At</label>
                                <div className="px-4 py-2 bg-black/10 border border-light-dark rounded-lg text-sm text-primary-txt font-mono">
                                    {new Date(detail.created_at).toLocaleString()}
                                </div>
                            </div>

                            {/* Updated At */}
                            <div>
                                <label className="text-xs font-semibold text-secondary-txt block mb-1">Updated At</label>
                                <div className="px-4 py-2 bg-black/10 border border-light-dark rounded-lg text-sm text-primary-txt font-mono">
                                    {new Date(detail.updated_at).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-6 text-secondary-txt text-sm">
                            No details found.
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end p-6 border-t border-light-dark">
                    <Button 
                        type="button" 
                        variant="contained" 
                        color="primary" 
                        onClick={onClose} 
                        sx={{ borderRadius: "10px", textTransform: "none", px: 4 }}
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DetailCategorySubjectDialog;
