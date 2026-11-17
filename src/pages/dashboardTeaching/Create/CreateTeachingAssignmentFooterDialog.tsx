import { DialogFooter } from "@components/Dialog";
import { Button } from "@mui/material";
import useDashboardTeachingStore from "../store";
import useCreateTeachingAssignment from "./hook/useCreateTeachingAssignment";

const CreateTeachingAssignmentFooterDialog = ({
    onClose,
}: {
    onClose: () => void;
}) => {
    const { handleCreate } = useCreateTeachingAssignment();
    const { state } = useDashboardTeachingStore();

    return (
        <DialogFooter>
            <Button
                variant="outlined"
                onClick={onClose}
                disabled={state.isSubmitting}
                sx={{ borderRadius: "10px", textTransform: "none" }}
            >
                Batal
            </Button>
            <Button
                variant="contained"
                onClick={() => handleCreate(onClose)}
                color="primary"
                loading={state.isSubmitting}
                sx={{ borderRadius: "10px", textTransform: "none" }}
            >
                Simpan
            </Button>
        </DialogFooter>
    );
};

export default CreateTeachingAssignmentFooterDialog;
