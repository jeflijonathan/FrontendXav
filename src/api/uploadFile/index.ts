import type { DataWithPagination, FetchCallback, FilterParams } from "@common/types/index";
import { API } from "..";
import type { UploadFileResponseModel } from "./model";

class UploadFileService {
    basePath = "/upload"
    api = new API()

    async getAllFile(callback: FetchCallback<DataWithPagination<UploadFileResponseModel[]>>, params?: FilterParams) {
        try {
            const res = await this.api.GET<DataWithPagination<UploadFileResponseModel[]>>(this.basePath, params?.params)

            if (res.status === "Success" || res.status === "SUCCESS") {
                callback.onSuccess(res.data)
            } else {
                callback.onError({ message: res.message, detail: res.details })
            }
        } catch (err: any) {
            callback.onError({ message: err.message || "Failed to fetch files" })
        }

        callback.onFullfilled && callback.onFullfilled()
    }

    async getFile(callback: FetchCallback<UploadFileResponseModel>, id: string) {
        try {
            const res = await this.api.GET<UploadFileResponseModel>(`${this.basePath}/meta/${id}`)
            if (res.status === "Success" || res.status === "SUCCESS") {
                callback.onSuccess(res.data)
            } else {
                callback.onError({ message: res.message, detail: res.details })
            }
        } catch (err: any) {
            callback.onError({ message: err.message || "Failed to fetch file metadata" })
        }
        callback.onFullfilled && callback.onFullfilled()
    }

    async uploadFile(callback: FetchCallback<UploadFileResponseModel>, payload: FormData) {
        try {
            const res = await this.api.POSTFORMDATA<UploadFileResponseModel>(this.basePath, payload)

            if (res.status === "Success" || res.status === "SUCCESS") {
                callback.onSuccess(res.data)
            } else {
                callback.onError({ message: res.message, detail: res.details })
            }
        } catch (err: any) {
            callback.onError({ message: err.message || "Failed to upload file" })
        }

        callback.onFullfilled && callback.onFullfilled()
    }

    async clearTempFiles(callback?: FetchCallback<{ deleted_records: number; deleted_files: number }>) {
        try {
            const res = await this.api.DELETE<{ deleted_records: number; deleted_files: number }>(`${this.basePath}/temp`)

            if (res.status === "Success" || res.status === "SUCCESS") {
                callback?.onSuccess(res.data)
            } else {
                callback?.onError({ message: res.message, detail: res.details })
            }
        } catch (err: any) {
            callback?.onError({ message: err.message || "Failed to clear temp files" })
        }

        callback?.onFullfilled && callback.onFullfilled()
    }

    async deleteFile(id: string, callback?: FetchCallback<any>) {
        try {
            const res = await this.api.DELETE(`${this.basePath}/${id}`)

            if (res.status === "Success" || res.status === "SUCCESS") {
                callback?.onSuccess(res.data)
            } else {
                callback?.onError({ message: res.message, detail: res.details })
            }
        } catch (err: any) {
            callback?.onError({ message: err.message || "Failed to delete file" })
        }

        callback?.onFullfilled && callback.onFullfilled()
    }

    async bulkDeleteFiles(ids: string[], callback?: FetchCallback<{ deleted_count: number }>) {
        try {
            const res = await this.api.POST<{ deleted_count: number }>(`${this.basePath}/bulk-delete`, { ids })

            if (res.status === "Success" || res.status === "SUCCESS") {
                callback?.onSuccess(res.data)
            } else {
                callback?.onError({ message: res.message, detail: res.details })
            }
        } catch (err: any) {
            callback?.onError({ message: err.message || "Failed to delete selected files" })
        }

        callback?.onFullfilled && callback.onFullfilled()
    }
}

export default UploadFileService;