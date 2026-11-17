import { DialogFooter } from "@components/Dialog";
import { Button } from "@mui/material";
import useUpdateSchoolInfo from "./hook/useUpdateSchoolInfo";
import useDashboardSchoolInformationStore from "../store";

const UpdateSchoolInfoFooterDialog = ({ id, onClose }: { id: string, onClose: () => void }) => {
    const { handleUpdate } = useUpdateSchoolInfo();
    const { state } = useDashboardSchoolInformationStore();

    return (
        <DialogFooter>
            <Button
                type="button"
                variant="outlined"
                onClick={onClose}
                disabled={state.isUpdateLoading}
                sx={{ borderRadius: "10px", textTransform: "none" }}
            >
                Batal
            </Button>
            <Button
                type="button"
                variant="contained"
                onClick={() => handleUpdate(id, onClose)}
                disabled={state.isUpdateLoading}
                color="primary"
                sx={{ borderRadius: "10px", textTransform: "none" }}
            >
                {state.isUpdateLoading ? "Menyimpan..." : "Update"}
            </Button>
        </DialogFooter>
    );
};
export default UpdateSchoolInfoFooterDialog;
