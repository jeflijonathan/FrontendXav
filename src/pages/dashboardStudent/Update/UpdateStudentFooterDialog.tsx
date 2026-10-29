import { DialogFooter } from "@components/Dialog";
import { Button } from "@mui/material";
import useUpdateStudent from "./hook/useUpdateStudent";
import useDashboardStudentStore from "@pages/dashboardStudent/store";

const UpdateStudentFooterDialog = ({ id, onClose }: { id: string; onClose: () => void }) => {
    const { handleUpdate } = useUpdateStudent(onClose);
    const { state } = useDashboardStudentStore();
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
                onClick={() => handleUpdate(id)}
                disabled={state.isUpdateLoading}
                color="primary"
                sx={{ borderRadius: "10px", textTransform: "none" }}
            >
                {state.isUpdateLoading ? "Memperbarui..." : "Simpan Perubahan"}
            </Button>
        </DialogFooter>
    );
};

export default UpdateStudentFooterDialog;
