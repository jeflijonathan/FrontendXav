import { DialogFooter } from "@components/Dialog";
import { Button } from "@mui/material";
import useCreateClass from "./hook/useCreateClass";
import useDashboardClassStore from "../store";

const CreateClassFooterDialog = ({ onClose }: { onClose: () => void }) => {
    const { handleCreate } = useCreateClass();
    const { state } = useDashboardClassStore();

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
                loading={state.isCreateLoading}
                sx={{ borderRadius: "10px", textTransform: "none" }}
            >
                Simpan
            </Button>
        </DialogFooter>
    );
};

export default CreateClassFooterDialog;
