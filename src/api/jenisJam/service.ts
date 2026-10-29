import { API } from '../index';
import type { FetchCallback } from '@types';
import type {
    JenisJamResponseModel,
    CreateJenisJamRequestModel,
    UpdateJenisJamRequestModel,
} from './model';

export default class JenisJamService {
    basePath = '/jenis-jam';
    service = new API();

    async getAll(callback: FetchCallback<JenisJamResponseModel[]>) {
        const res = await this.service.GET<JenisJamResponseModel[]>(`${this.basePath}/`);
        if (res.status === 'SUCCESS' || res.status === 'success') {
            callback.onSuccess(res.data);
        } else {
            callback.onError({ message: res.message, detail: (res as any).details || (res as any).detail });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async getById(id: string, callback: FetchCallback<JenisJamResponseModel>) {
        const res = await this.service.GET<JenisJamResponseModel>(`${this.basePath}/${id}`);
        if (res.status === 'SUCCESS' || res.status === 'success') {
            callback.onSuccess(res.data);
        } else {
            callback.onError({ message: res.message, detail: (res as any).details || (res as any).detail });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async create(data: CreateJenisJamRequestModel, callback: FetchCallback<JenisJamResponseModel>) {
        const res = await this.service.POST<JenisJamResponseModel>(`${this.basePath}/`, data);
        if (res.status === 'SUCCESS' || res.status === 'success') {
            callback.onSuccess(res.data);
        } else {
            callback.onError({ message: res.message, detail: (res as any).details || (res as any).detail });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async update(id: string, data: UpdateJenisJamRequestModel, callback: FetchCallback<JenisJamResponseModel>) {
        const res = await this.service.PATCH<JenisJamResponseModel>(`${this.basePath}/${id}`, data);
        if (res.status === 'SUCCESS' || res.status === 'success') {
            callback.onSuccess(res.data);
        } else {
            callback.onError({ message: res.message, detail: (res as any).details || (res as any).detail });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async delete(id: string, callback: FetchCallback<any>) {
        const res = await this.service.DELETE<any>(`${this.basePath}/${id}`);
        if (res.status === 'SUCCESS' || res.status === 'success') {
            callback.onSuccess(res.data);
        } else {
            callback.onError({ message: res.message, detail: (res as any).details || (res as any).detail });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }
}
