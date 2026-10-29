import { DashboardHeader } from "@components/Headers";
import { Button, Typography } from "@mui/material";
import { DeleteSweep } from "@mui/icons-material";
import { useState } from "react";
import { useSnackbar } from "notistack";
import UploadFileTable from "./List/UploadFileTable";
import useUploadFileList from "./List/hook/useUploadFileList";
import { filterUploadFileMapper } from "./List/utils/FilterUploadFileMapper";
import useDashboardUploadFileStore from "./store";
import UploadFileService from "@api/uploadFile";
import { BaseDialog, DialogHeader, DialogBody, DialogFooter } from "@components/Dialog";

const DashboardUploadFile = () => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const { fetchUploadFileList } = useUploadFileList();
    const { enqueueSnackbar } = useSnackbar();

    const handleClearTempFiles = async () => {
        setIsClearing(true);
        const service = new UploadFileService();
        await service.clearTempFiles({
            onSuccess: (data) => {
                const countMsg = data?.deleted_records !== undefined
                    ? ` (${data.deleted_records} file dibersihkan)`
                    : "";
                enqueueSnackbar(`File temporary berhasil dibersihkan${countMsg}`, { variant: "success" });
                setIsConfirmOpen(false);
                const latestState = useDashboardUploadFileStore.getState().state;
                fetchUploadFileList(filterUploadFileMapper(latestState));
            },
            onError: (err: any) => {
                enqueueSnackbar(err?.message || "Gagal membersihkan file temporary", { variant: "error" });
            },
            onFullfilled: () => {
                setIsClearing(false);
            },
        });
    };

    return (
        <>
            <DashboardHeader title="Data File Terupload (Upload File)" description="Kelola dan telusuri file yang telah diunggah ke sistem">
                <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteSweep />}
                    onClick={() => setIsConfirmOpen(true)}
                >
                    Clear Temp File
                </Button>
            </DashboardHeader>

            <UploadFileTable />

            <BaseDialog isOpen={isConfirmOpen} onClose={() => !isClearing && setIsConfirmOpen(false)}>
                <DialogHeader title="Konfirmasi Clear Temp File" onClose={() => !isClearing && setIsConfirmOpen(false)} />
                <DialogBody>
                    <Typography variant="body1" color="text.secondary">
                        Apakah Anda yakin ingin membersihkan semua file temporary? Seluruh file di folder temp yang belum disimpan secara permanen akan dihapus dari sistem.
                    </Typography>
                </DialogBody>
                <DialogFooter>
                    <Button
                        onClick={() => setIsConfirmOpen(false)}
                        disabled={isClearing}
                        color="inherit"
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={handleClearTempFiles}
                        disabled={isClearing}
                        variant="contained"
                        color="error"
                    >
                        {isClearing ? "Membersihkan..." : "Clear Temp File"}
                    </Button>
                </DialogFooter>
            </BaseDialog>
        </>
    );
};

export default DashboardUploadFile;

