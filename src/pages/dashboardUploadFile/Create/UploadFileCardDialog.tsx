import React, { useState } from "react";
import { Button } from "@mui/material";
import { BaseDialog, DialogHeader, DialogBody, DialogFooter } from "@components/Dialog";
import UploadFileDropzone from "@components/Input/UploadFile";
import UploadFileService from "@api/uploadFile";
import { snackbar } from "@utils/snackbar";

interface UploadFileCardDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const UploadFileCardDialog: React.FC<UploadFileCardDialogProps> = ({ isOpen, onClose, onSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => {
        setFile(null);
        setIsLoading(false);
        onClose();
    };

    const handleUpload = async () => {
        if (!file) {
            snackbar.warning("Silakan pilih file terlebih dahulu");
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        const service = new UploadFileService();
        await service.uploadFile({
            onSuccess: () => {
                snackbar.success("File berhasil diupload");
                setIsLoading(false);
                setFile(null);
                onSuccess();
                onClose();
            },
            onError: ({ message }) => {
                snackbar.error(message || "Gagal mengupload file");
                setIsLoading(false);
            },
            onFullfilled: () => {
                setIsLoading(false);
            },
        }, formData);
    };

    return (
        <BaseDialog isOpen={isOpen} onClose={handleClose}>
            <DialogHeader title="Upload File Baru" onClose={handleClose} />
            <DialogBody>
                <div className="flex flex-col gap-4 py-2">
                    <UploadFileDropzone
                        value={file}
                        onFileChange={(newFile) => setFile(newFile)}
                        accept="*/*"
                        label="Pilih File"
                        helperText="Tarik dan lepas file ke sini atau klik untuk memilih"
                    />
                </div>
            </DialogBody>
            <DialogFooter>
                <Button
                    variant="outlined"
                    onClick={handleClose}
                    disabled={isLoading}
                    sx={{ borderRadius: "10px", textTransform: "none" }}
                >
                    Batal
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpload}
                    disabled={isLoading || !file}
                    sx={{ borderRadius: "10px", textTransform: "none" }}
                >
                    {isLoading ? "Mengupload..." : "Upload"}
                </Button>
            </DialogFooter>
        </BaseDialog>
    );
};

export default UploadFileCardDialog;
