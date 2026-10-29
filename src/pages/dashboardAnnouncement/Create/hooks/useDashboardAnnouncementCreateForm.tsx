
import { useForm } from "react-hook-form"
import type { AnnouncementCreateModel } from "@api/announcement/model"
import { CreateAnnouncementReqDefaultValues, CreateAnnouncementValidations } from "../utils/createAnnouncementForm"


const useDashboardAnnouncementCreateForm = () => {
    const { handleSubmit } = useForm<AnnouncementCreateModel>({
        resolver: CreateAnnouncementValidations,
        defaultValues: CreateAnnouncementReqDefaultValues,
    })
    return { handleSubmit }
}
export default useDashboardAnnouncementCreateForm