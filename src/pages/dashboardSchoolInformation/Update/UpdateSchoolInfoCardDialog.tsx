import { BaseDialog, DialogHeader } from "@components/Dialog"
import { FormProvider } from "react-hook-form"
import useUpdateSchoolInfoForm from "./hook/useUpdateSchoolInfoForm"
import UpdateSchoolInfoFormDialog from "./UpdateSchoolInfoFormDialog"
import UpdateSchoolInfoFooterDialog from "./UpdateSchoolInfoFooterDialog"
import { useEffect } from "react"
import useSchoolInfoList from "../List/hook/useSchoolInfoList"
import { filterEmployeeMapper } from "../List/utils/FilterEmployeeMapper"
import useSchoolInfoStore from "../store"
import useUpdateSchoolInfo from "./hook/useUpdateSchoolInfo"

const UpdateSchoolInfoCardDialog = ({ id, isOpen, onClose }: { id: string, isOpen: boolean, onClose: () => void }) => {
    const { updateSchoolInfoReqForm } = useUpdateSchoolInfoForm();
    const { fetchEmployeeOptions } = useSchoolInfoList();
    const { state } = useSchoolInfoStore();

    return (
        <FormProvider {...updateSchoolInfoReqForm}>
            <UpdateSchoolInfoCardDialogContent id={id} isOpen={isOpen} onClose={onClose} fetchEmployeeOptions={fetchEmployeeOptions} state={state} />
        </FormProvider>
    )
}

const UpdateSchoolInfoCardDialogContent = ({
    id, isOpen, onClose, fetchEmployeeOptions, state
}: {
    id: string, isOpen: boolean, onClose: () => void,
    fetchEmployeeOptions: (params: any) => Promise<void>,
    state: any,
}) => {
    const { fetchDetail } = useUpdateSchoolInfo();

    useEffect(function loadDataOnOpen() {
        if (isOpen && id) {
            fetchEmployeeOptions(filterEmployeeMapper(state));
            fetchDetail(id);
        }
    }, [isOpen, id])

    return (
        <BaseDialog isOpen={isOpen} onClose={onClose}>
            <DialogHeader title="Edit Data Sekolah" onClose={onClose} />
            <UpdateSchoolInfoFormDialog />
            <UpdateSchoolInfoFooterDialog id={id} onClose={onClose} />
        </BaseDialog>
    )
}

export default UpdateSchoolInfoCardDialog
