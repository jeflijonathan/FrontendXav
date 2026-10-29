import { DialogFooter } from "@components/Dialog";
import { Button } from "@mui/material";
import useCreateStudent from "./hook/useCreateStudent";
import useDashboardStudentStore from "@pages/dashboardStudent/store";

const CreateStudentFooterDialog = ({ onClose }: { onClose: () => void }) => {
    const { handleCreate } = useCreateStudent(onClose);
    const { state } = useDashboardStudentStore();
    return (
        <DialogFooter>
            <Button variant="outlined" onClick={onClose} disabled={state.isCreateLoading} sx={{ borderRadius: "10px", textTransform: "none" }}>
                Batal
            </Button>
            <Button
                variant="contained"
                onClick={() => handleCreate()}
                disabled={state.isCreateLoading}
                color="primary"
                sx={{ borderRadius: "10px", textTransform: "none" }}
            >
                {state.isCreateLoading ? "Menyimpan..." : "Simpan Siswa"}
            </Button>
        </DialogFooter>
    );
};

export default CreateStudentFooterDialog;
