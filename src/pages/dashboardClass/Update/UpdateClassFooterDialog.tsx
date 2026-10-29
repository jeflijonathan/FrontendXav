import { DialogFooter } from "@components/Dialog";
import { Button } from "@mui/material";
import useUpdateClass from "./hook/useUpdateClass";
import useDashboardClassStore from "../store";

const UpdateClassFooterDialog = ({ id, onClose }: { id: string; onClose: () => void }) => {
    const { handleUpdate } = useUpdateClass();
    const { state } = useDashboardClassStore();

    return (
        <DialogFooter>
            <Button
                variant="outlined"
                onClick={onClose}
                disabled={state.isUpdateLoading || state.isDetailLoading}
                sx={{ borderRadius: "10px", textTransform: "none" }}
            >
                Batal
            </Button>
            <Button
                variant="contained"
                onClick={() => handleUpdate(id, onClose)}
                color="primary"
                loading={state.isUpdateLoading}
                disabled={state.isDetailLoading}
                sx={{ borderRadius: "10px", textTransform: "none" }}
            >
                Simpan Perubahan
            </Button>
        </DialogFooter>
    );
};

export default UpdateClassFooterDialog;
