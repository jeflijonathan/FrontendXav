/**
 * CreateSubjectFooterDialog — Representation Logic
 *
 * Action buttons for create dialog.
 *
 * Layer: Representation Logic
 */
import { DialogFooter } from "@components/Dialog";
import { Button } from "@mui/material";
import useCreateSubject from "./hook/useCreateSubject";

const CreateSubjectFooterDialog = ({ onClose }: { onClose: () => void }) => {
    const { handleCreate, isLoading } = useCreateSubject();

    return (
        <DialogFooter>
            <Button
                variant="outlined"
                onClick={onClose}
                disabled={isLoading}
                sx={{ borderRadius: "8px", textTransform: "none" }}
            >
                Cancel
            </Button>
            <Button
                variant="contained"
                onClick={handleCreate(onClose)}
                color="primary"
                loading={isLoading}
                sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}
            >
                Save Subject
            </Button>
        </DialogFooter>
    );
};

export default CreateSubjectFooterDialog;

