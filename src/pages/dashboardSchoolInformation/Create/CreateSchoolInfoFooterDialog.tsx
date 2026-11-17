import { DialogFooter } from "@components/Dialog";
import { Button } from "@mui/material";
import useCreateSchoolInfo from "./hook/useCreateSchoolInfo";
import useDashboardSchoolInformationStore from "../store";

const CreateSchoolInfoFooterDialog = ({ onClose }: { onClose: () => void }) => {
    const { handleCreate } = useCreateSchoolInfo();
    const { state } = useDashboardSchoolInformationStore();

    return (
        <DialogFooter>
            <Button
                type="button"
                variant="outlined"
                onClick={onClose}
                disabled={state.isCreateLoading}
                sx={{ borderRadius: "10px", textTransform: "none" }}
            >
                Batal
            </Button>
            <Button
                type="button"
                variant="contained"
                onClick={() => handleCreate(onClose)}
                disabled={state.isCreateLoading}
                color="primary"
                sx={{ borderRadius: "10px", textTransform: "none" }}
            >
                {state.isCreateLoading ? "Menyimpan..." : "Submit"}
            </Button>
        </DialogFooter>
    );
};

export default CreateSchoolInfoFooterDialog;