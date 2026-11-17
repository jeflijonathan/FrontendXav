import React from "react";
import { DialogFooter } from "@components/Dialog";
import { Button, CircularProgress } from "@mui/material";
import useAnnouncementUpdate from "./hooks/useAnnouncementUpdate";

type Props = {
    announcementId: string | null;
    onClose: () => void;
};

const UpdateAnnouncementFooterDialog: React.FC<Props> = ({
    announcementId,
    onClose,
}) => {
    const { handleUpdateAnnouncement, isLoading } = useAnnouncementUpdate();

    const handleSubmit = () => {
        if (announcementId) {
            handleUpdateAnnouncement(announcementId, onClose);
        }
    };

    return (
        <DialogFooter>
            <Button
                variant="outlined"
                disabled={isLoading}
                onClick={onClose}
                sx={{ borderRadius: "10px", textTransform: "none" }}
            >
                Batal
            </Button>
            <Button
                variant="contained"
                disabled={isLoading}
                onClick={handleSubmit}
                sx={{ borderRadius: "10px", textTransform: "none", minWidth: 90 }}
            >
                {isLoading ? <CircularProgress size={22} color="inherit" /> : "Simpan"}
            </Button>
        </DialogFooter>
    );
};

export default UpdateAnnouncementFooterDialog;
