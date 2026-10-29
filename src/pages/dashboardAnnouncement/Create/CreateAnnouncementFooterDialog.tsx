import { DialogFooter } from "@components/Dialog"
import { Button, CircularProgress } from "@mui/material"

type Props = {
    onCancel: () => void;
    onSubmit?: () => void;
    isLoading?: boolean;
}

const CreateAnnouncementFooterDialog = ({ onCancel, onSubmit, isLoading }: Props) => {
    return (
        <DialogFooter>
            <Button color="error" variant="text" onClick={onCancel} disabled={isLoading}>Batal</Button>
            <Button color="primary" variant="contained" onClick={onSubmit} disabled={isLoading}>
                {isLoading ? <CircularProgress size={24} /> : 'Simpan'}
            </Button>
        </DialogFooter>
    )
}

export default CreateAnnouncementFooterDialog