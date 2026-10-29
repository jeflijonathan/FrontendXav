import { DialogFooter } from "@components/Dialog";
import { Button } from "@mui/material";
import useUpdateEmployee from "./hook/useUpdateEmployee";
import useDashboardEmployeeStore from "../store";

const UpdateEmployeeFooterDialog = ({ id, onClose }: { id: string; onClose: () => void }) => {
    const { handleUpdate } = useUpdateEmployee();
    const { state } = useDashboardEmployeeStore();
    return (
        <DialogFooter>
            <Button variant="outlined" disabled={state.isUpdateLoading} onClick={onClose} sx={{ borderRadius: "10px", textTransform: "none" }}>Cancel</Button>
            <Button variant="contained" disabled={state.isUpdateLoading} onClick={() => handleUpdate(id, onClose)} color="primary" sx={{ borderRadius: "10px", textTransform: "none" }}>
                {state.isUpdateLoading ? "Menyimpan..." : "Update"}
            </Button>
        </DialogFooter>
    );
};

export default UpdateEmployeeFooterDialog;
