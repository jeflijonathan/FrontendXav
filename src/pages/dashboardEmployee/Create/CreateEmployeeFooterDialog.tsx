import { DialogFooter } from "@components/Dialog";
import { Button } from "@mui/material";
import useCreateEmployee from "./hook/useCreateEmployee";

const CreateEmployeeFooterDialog = ({ onClose }: { onClose: () => void }) => {
    const { handleCreate } = useCreateEmployee();

    return (
        <DialogFooter>
            <Button variant="outlined" onClick={onClose} sx={{ borderRadius: "10px", textTransform: "none" }}>Cancel</Button>
            <Button variant="contained" onClick={() => handleCreate()} color="primary" sx={{ borderRadius: "10px", textTransform: "none" }}>Submit</Button>
        </DialogFooter>
    );
};

export default CreateEmployeeFooterDialog;
