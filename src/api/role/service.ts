import type { FetchCallback, FilterParams } from "@common/types/index";
import { API } from "../index";
import type { RoleModel } from "./model";

export default class RoleService {
    basePath = "/roles/";
    service = new API();

    async getAll(callback: FetchCallback<RoleModel[]>, params: FilterParams) {
        const res = await this.service.GET<RoleModel[]>(this.basePath, params);

        if (res.status == "SUCCESS") {
            callback.onSuccess(res.data);
        } else {
            callback.onError(res.message);
        }
        callback.onFullfilled && callback.onFullfilled();
    }
}
