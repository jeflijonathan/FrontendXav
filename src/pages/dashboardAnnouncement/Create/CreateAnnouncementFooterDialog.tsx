import { DialogFooter } from "@components/Dialog"
import { Button, CircularProgress } from "@mui/material"

type Props = {
    onClose: () => void;
    onSubmit?: () => void;
    isLoading?: boolean;
}

const CreateAnnouncementFooterDialog = ({ onClose, onSubmit, isLoading }: Props) => {
    return (
        <DialogFooter>

            <Button variant="outlined" disabled={isLoading} onClick={onClose} sx={{ borderRadius: "10px", textTransform: "none" }}>Cancel</Button>
            <Button variant="contained" disabled={isLoading} onClick={onSubmit}>
                {isLoading ? <CircularProgress size={24} /> : 'Simpan'}
            </Button>
        </DialogFooter>
    )
}

export default CreateAnnouncementFooterDialog