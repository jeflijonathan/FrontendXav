import { DialogFooter } from "@components/Dialog";
import { Button, CircularProgress } from "@mui/material";
import useCreateMajor from "./hook/useCreateMajor";
import { useDashboardMajorStore } from "../store";

const CreateMajorFooterDialog = ({ onClose }: { onClose: () => void }) => {
    const { handleCreate } = useCreateMajor();
    const { state } = useDashboardMajorStore();

    return (
        <DialogFooter>
            <Button
                variant="outlined"
                onClick={onClose}
                disabled={state.isCreateLoading}
                sx={{ borderRadius: "10px", textTransform: "none" }}
            >
                Batal
            </Button>
            <Button
                variant="contained"
                onClick={() => handleCreate(onClose)}
                color="primary"
                disabled={state.isCreateLoading}
                startIcon={state.isCreateLoading ? <CircularProgress size={18} color="inherit" /> : null}
                sx={{ borderRadius: "10px", textTransform: "none" }}
            >
                Simpan
            </Button>
        </DialogFooter>
    );
};

export default CreateMajorFooterDialog;
