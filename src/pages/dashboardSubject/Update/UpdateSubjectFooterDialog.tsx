/**
 * UpdateSubjectFooterDialog — Representation Logic
 *
 * Action buttons for update dialog.
 *
 * Layer: Representation Logic
 */
import { DialogFooter } from "@components/Dialog";
import { Button } from "@mui/material";
import useUpdateSubject from "./hook/useUpdateSubject";
import useDashboardSubjectStore from "../store";

interface Props {
    id: string;
    onClose: () => void;
}

const UpdateSubjectFooterDialog = ({ id, onClose }: Props) => {
    const { handleUpdate, isLoading } = useUpdateSubject();
    const { state } = useDashboardSubjectStore();

    return (
        <DialogFooter>
            <Button
                variant="outlined"
                onClick={onClose}
                disabled={isLoading || state.isDetailLoading}
                sx={{ borderRadius: "8px", textTransform: "none" }}
            >
                Batal
            </Button>
            <Button
                variant="contained"
                onClick={handleUpdate(id, onClose)}
                color="primary"
                loading={isLoading}
                disabled={state.isDetailLoading}
                sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}
            >
                Simpan Perubahan
            </Button>
        </DialogFooter>
    );
};

export default UpdateSubjectFooterDialog;

