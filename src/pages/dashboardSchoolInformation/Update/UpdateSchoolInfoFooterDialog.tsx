import { DialogFooter } from "@components/Dialog";
import { Button } from "@mui/material";
import useUpdateSchoolInfo from "./hook/useUpdateSchoolInfo";

const UpdateSchoolInfoFooterDialog = ({ id, onClose }: { id: string, onClose: () => void }) => {
    const { handleUpdate } = useUpdateSchoolInfo();
    return (
        <DialogFooter>
            <Button type="button" variant="outlined" onClick={onClose} sx={{ borderRadius: "10px", textTransform: "none" }}>Cancel</Button>
            <Button type="submit" variant="contained" onClick={() => handleUpdate(id)} color="primary" sx={{ borderRadius: "10px", textTransform: "none" }}>Update</Button>
        </DialogFooter>
    )
}
export default UpdateSchoolInfoFooterDialog;
