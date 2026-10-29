import type { DataWithPagination, FetchCallback, FilterParams } from "@common/types/index"
import { API } from ".."
import type { AnnouncementCreateModel, AnnouncementResponseModel } from "./model"

class AnnouncementService {
    baseAPI = new API()
    basePath = "/announcement"

    async fetchAnnouncementRequest(callback: FetchCallback<DataWithPagination<AnnouncementResponseModel>>, params: FilterParams) {
        const res = await this.baseAPI.GET(this.basePath, params)

        if (res.status == "SUCCESS") {
            callback.onSuccess({ data: res.data.data, pagination: res.data.pagination });
        } else {
            callback.onError({ message: res.message });
        }

        callback.onFullfilled && callback.onFullfilled();
    }

    async fetchAnnouncementByIdRequest(id: string, callback: FetchCallback<AnnouncementResponseModel>) {
        const res = await this.baseAPI.GET(`${this.basePath}/${id}`)

        if (res.status == "SUCCESS") {
            callback.onSuccess(res.data)
        } else {
            callback.onError({ message: res.message })
        }

        callback.onFullfilled && callback.onFullfilled();
    }

    async createAnnouncementRequest(payload: AnnouncementCreateModel, callback: FetchCallback<AnnouncementResponseModel>) {
        const res = await this.baseAPI.POST(this.basePath, payload)
        if (res.status == "SUCCESS") {
            callback.onSuccess(res.data)
        } else {
            callback.onError({ message: res.message, detail: res.details })
        }
        callback.onFullfilled && callback.onFullfilled();
    }

    async updateAnnouncementRequest(id: string, payload: Partial<AnnouncementCreateModel>, callback: FetchCallback<AnnouncementResponseModel>) {
        const res = await this.baseAPI.PATCH(`${this.basePath}/${id}`, payload)
        if (res.status == "SUCCESS") {
            callback.onSuccess(res.data)
        } else {
            callback.onError({ message: res.message, detail: res.details })
        }
        callback.onFullfilled && callback.onFullfilled();
    }

    async deleteAnnouncementRequest(id: string, callback: FetchCallback<AnnouncementResponseModel>) {
        const res = await this.baseAPI.DELETE(`${this.basePath}/${id}`)
        if (res.status == "SUCCESS") {
            callback.onSuccess(res.data)
        } else {
            callback.onError({ message: res.message, detail: res.details })
        }
        callback.onFullfilled && callback.onFullfilled();
    }
}
export default AnnouncementService
