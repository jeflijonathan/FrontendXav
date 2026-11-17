import { DialogFooter } from "@components/Dialog";
import { Button } from "@mui/material";
import useDashboardTeachingStore from "../store";
import useUpdateTeachingAssignment from "./hook/useUpdateTeachingAssignment";
import type { TeachingRowSeed } from "../store";

const UpdateTeachingAssignmentFooterDialog = ({
    seed,
    onClose,
}: {
    seed: TeachingRowSeed;
    onClose: () => void;
}) => {
    const { handleUpdate } = useUpdateTeachingAssignment(seed);
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
                onClick={() => handleUpdate(onClose)}
                color="primary"
                loading={state.isSubmitting}
                sx={{ borderRadius: "10px", textTransform: "none" }}
            >
                Simpan Perubahan
            </Button>
        </DialogFooter>
    );
};

export default UpdateTeachingAssignmentFooterDialog;
