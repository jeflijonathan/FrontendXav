import { BaseDialog, DialogBody, DialogFooter } from "@components/Dialog";

const FilterClassRoomDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {

    return (
        <BaseDialog isOpen={isOpen} onClose={onClose}>
            <DialogBody>
                <h1>coba</h1>
            </DialogBody>
            <DialogFooter />
        </BaseDialog>
    )
}
export default FilterClassRoomDialog;