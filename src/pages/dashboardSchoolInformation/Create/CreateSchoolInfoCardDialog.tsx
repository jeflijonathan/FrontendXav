import { BaseDialog, DialogHeader } from "@components/Dialog"
import { FormProvider } from "react-hook-form"
import useCreateSchoolInfoForm from "./hook/useCreateSchoolInfoForm"
import CreateSchoolInfoFormDialog from "./CreateSchoolInfoFormDialog"
import CreateSchoolInfoFooterDialog from "./CreateSchoolInfoFooterDialog"
import { useEffect } from "react"
import useSchoolInfoList from "../List/hook/useSchoolInfoList"
import { filterEmployeeMapper } from "../List/utils/FilterEmployeeMapper"
import useSchoolInfoStore from "../store"

const CreateSchoolInfoFormCardDialog = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const { createSchoolInfoReqForm } = useCreateSchoolInfoForm();
    const { fetchEmployeeOptions } = useSchoolInfoList();
    const { state } = useSchoolInfoStore();

    useEffect(function loadEmployeeData() {
        fetchEmployeeOptions(filterEmployeeMapper(state))
    }, [])

    return (
        <FormProvider {...createSchoolInfoReqForm}>
            <BaseDialog isOpen={isOpen} onClose={onClose}>
                <DialogHeader title="Tambah Data Sekolah" onClose={onClose} />
                <CreateSchoolInfoFormDialog />
                <CreateSchoolInfoFooterDialog onClose={onClose} />
            </BaseDialog>
        </FormProvider>
    )
}
export default CreateSchoolInfoFormCardDialog