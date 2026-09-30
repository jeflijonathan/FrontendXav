import { DialogFooter } from "@components/Dialog";
import { Button } from "@mui/material";
import useCreateSchoolInfo from "./hook/useCreateSchoolInfo";

const CreateSchoolInfoFooterDialog = ({ onClose }: { onClose: () => void }) => {
    const { handleCreate } = useCreateSchoolInfo();
    return (
        <DialogFooter>
            <Button type="button" variant="outlined" onClick={onClose} sx={{ borderRadius: "10px", textTransform: "none" }}>Cancel</Button>
            <Button type="submit" variant="contained" onClick={() => handleCreate()} color="primary" sx={{ borderRadius: "10px", textTransform: "none" }}>Submit</Button>
        </DialogFooter>
    )
}
export default CreateSchoolInfoFooterDialog;