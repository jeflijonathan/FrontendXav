/**
 * CreateCategorySubjectFooterDialog — Representation Logic
 *
 * Action buttons for create dialog.
 *
 * Layer: Representation Logic
 */
import { DialogFooter } from "@components/Dialog";
import { Button } from "@mui/material";
import useCreateCategorySubject from "./hook/useCreateCategorySubject";

const CreateCategorySubjectFooterDialog = ({ onClose }: { onClose: () => void }) => {
    const { handleCreate, isLoading } = useCreateCategorySubject();

    return (
        <DialogFooter>
            <Button
                variant="outlined"
                onClick={onClose}
                disabled={isLoading}
                sx={{ borderRadius: "8px", textTransform: "none" }}
            >
                Batal
            </Button>
            <Button
                variant="contained"
                onClick={handleCreate(onClose)}
                color="primary"
                loading={isLoading}
                sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}
            >
                Simpan Kategori
            </Button>
        </DialogFooter>
    );
};

export default CreateCategorySubjectFooterDialog;

