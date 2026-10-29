import { DialogFooter } from "@components/Dialog";
import { Button, CircularProgress } from "@mui/material";
import useUpdateMajor from "./hook/useUpdateMajor";
import { useDashboardMajorStore } from "../store";

const UpdateMajorFooterDialog = ({ id, onClose }: { id: string; onClose: () => void }) => {
    const { handleUpdate } = useUpdateMajor();
    const { state } = useDashboardMajorStore();

    return (
        <DialogFooter>
            <Button
                variant="outlined"
                onClick={onClose}
                disabled={state.isUpdateLoading}
                sx={{ borderRadius: "10px", textTransform: "none" }}
            >
                Batal
            </Button>
            <Button
                variant="contained"
                onClick={() => handleUpdate(id, onClose)}
                color="primary"
                disabled={state.isUpdateLoading}
                startIcon={state.isUpdateLoading ? <CircularProgress size={18} color="inherit" /> : null}
                sx={{ borderRadius: "10px", textTransform: "none" }}
            >
                Perbarui
            </Button>
        </DialogFooter>
    );
};

export default UpdateMajorFooterDialog;
