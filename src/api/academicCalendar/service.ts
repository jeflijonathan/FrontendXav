import type { FetchCallback } from "@common/types";
import { API } from "../index";
import type { AcademicCalendarModel } from "./model";

export default class AcademicCalendarService {
  basePath = "/academic-calendar";
  service = new API();

  private extractCalendar(res: any): AcademicCalendarModel | null {
    if (!res) return null;
    if (res.data && res.data.semesters) {
      return res.data as AcademicCalendarModel;
    }
    if (res.data?.data && res.data.data.semesters) {
      return res.data.data as AcademicCalendarModel;
    }
    if (res.semesters) {
      return res as AcademicCalendarModel;
    }
    return null;
  }

  private isSuccess(res: any): boolean {
    return Boolean(
      res &&
        (res.status === "SUCCESS" ||
          res.statusCode === 200 ||
          res.status_code === 200)
    );
  }

  async getCalendar(
    academicYear?: string,
    callback?: FetchCallback<AcademicCalendarModel>
  ): Promise<AcademicCalendarModel | null> {
    try {
      const url = academicYear
        ? `${this.basePath}/${academicYear.replace("/", "-")}`
        : `${this.basePath}/`;
      const res = await this.service.GET<any>(url);
      if (this.isSuccess(res)) {
        const cal = this.extractCalendar(res);
        if (cal && callback?.onSuccess) callback.onSuccess(cal);
        return cal;
      } else {
        if (callback?.onError)
          callback.onError({ message: res?.message, detail: res?.details });
        return null;
      }
    } catch (err: any) {
      if (callback?.onError)
        callback.onError({
          message: err?.message || "Gagal memuat kalender akademik",
        });
      return null;
    } finally {
      if (callback?.onFullfilled) callback.onFullfilled();
    }
  }

  async scanPdf(
    file: File,
    idSchoolInformation?: string,
    callback?: FetchCallback<AcademicCalendarModel>
  ): Promise<AcademicCalendarModel | null> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (idSchoolInformation) {
        formData.append("id_school_information", idSchoolInformation);
      }

      const res = await this.service.POSTFORMDATA<any>(
        `${this.basePath}/scan-pdf`,
        formData
      );

      if (this.isSuccess(res)) {
        const cal = this.extractCalendar(res);
        if (cal && callback?.onSuccess) callback.onSuccess(cal);
        return cal;
      } else {
        const errorMsg = res.details?.length
          ? res.details.map((d: any) => d.message).join(", ")
          : res.message || "Gagal memindai";
        if (callback?.onError)
          callback.onError({ message: errorMsg, detail: res.details });
        throw new Error(errorMsg);
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Gagal memindai berkas kalender PDF";
      if (callback?.onError) callback.onError({ message: msg });
      throw err;
    } finally {
      if (callback?.onFullfilled) callback.onFullfilled();
    }
  }

  async saveCalendar(
    data: AcademicCalendarModel,
    callback?: FetchCallback<AcademicCalendarModel>
  ): Promise<AcademicCalendarModel | null> {
    try {
      const res = await this.service.POST<any>(`${this.basePath}/`, data);
      if (this.isSuccess(res)) {
        const cal = this.extractCalendar(res);
        if (cal && callback?.onSuccess) callback.onSuccess(cal);
        return cal || data;
      } else {
        if (callback?.onError)
          callback.onError({ message: res?.message, detail: res?.details });
        return null;
      }
    } catch (err: any) {
      if (callback?.onError)
        callback.onError({
          message: err?.message || "Gagal menyimpan kalender akademik",
        });
      return null;
    } finally {
      if (callback?.onFullfilled) callback.onFullfilled();
    }
  }

  async updateCell(
    payload: {
      academic_year: string;
      semester_id: string;
      month_index: number;
      day: number;
      cell: Record<string, any>;
    },
    callback?: FetchCallback<AcademicCalendarModel>
  ): Promise<AcademicCalendarModel | null> {
    try {
      const res = await this.service.PATCH<any>(
        `${this.basePath}/cell`,
        payload
      );
      if (this.isSuccess(res)) {
        const cal = this.extractCalendar(res);
        if (cal && callback?.onSuccess) callback.onSuccess(cal);
        return cal;
      } else {
        if (callback?.onError)
          callback.onError({ message: res?.message, detail: res?.details });
        return null;
      }
    } catch (err: any) {
      if (callback?.onError)
        callback.onError({
          message:
            err?.message ||
            "Gagal memperbarui tanggal kalender di database backend",
        });
      return null;
    } finally {
      if (callback?.onFullfilled) callback.onFullfilled();
    }
  }

  async addCategory(
    payload: {
      academic_year: string;
      category: {
        code: string;
        label: string;
        color?: string;
        date_range?: string;
        is_effective?: boolean;
      };
    },
    callback?: FetchCallback<AcademicCalendarModel>
  ): Promise<AcademicCalendarModel | null> {
    try {
      const res = await this.service.POST<any>(
        `${this.basePath}/category`,
        payload
      );
      if (this.isSuccess(res)) {
        const cal = this.extractCalendar(res);
        if (cal && callback?.onSuccess) callback.onSuccess(cal);
        return cal;
      } else {
        if (callback?.onError)
          callback.onError({ message: res?.message, detail: res?.details });
        return null;
      }
    } catch (err: any) {
      if (callback?.onError)
        callback.onError({
          message:
            err?.message || "Gagal menyimpan kategori ke database backend",
        });
      return null;
    } finally {
      if (callback?.onFullfilled) callback.onFullfilled();
    }
  }

  async deleteCategory(
    code: string,
    academicYear?: string,
    callback?: FetchCallback<AcademicCalendarModel>
  ): Promise<AcademicCalendarModel | null> {
    try {
      const query = academicYear
        ? `?academic_year=${encodeURIComponent(academicYear)}`
        : "";
      const res = await this.service.DELETE<any>(
        `${this.basePath}/category/${encodeURIComponent(code)}${query}`
      );
      if (this.isSuccess(res)) {
        const cal = this.extractCalendar(res);
        if (cal && callback?.onSuccess) callback.onSuccess(cal);
        return cal;
      } else {
        if (callback?.onError)
          callback.onError({ message: res?.message, detail: res?.details });
        return null;
      }
    } catch (err: any) {
      if (callback?.onError)
        callback.onError({
          message:
            err?.message || "Gagal menghapus kategori dari database backend",
        });
      return null;
    } finally {
      if (callback?.onFullfilled) callback.onFullfilled();
    }
  }

  async clearHolidays(
    data?: AcademicCalendarModel,
    callback?: FetchCallback<AcademicCalendarModel>
  ): Promise<AcademicCalendarModel | null> {
    try {
      const res = await this.service.POST<any>(
        `${this.basePath}/clear-holidays`,
        data || {}
      );
      if (this.isSuccess(res)) {
        const cal = this.extractCalendar(res);
        if (cal && callback?.onSuccess) callback.onSuccess(cal);
        return cal;
      } else {
        if (callback?.onError)
          callback.onError({ message: res?.message, detail: res?.details });
        return null;
      }
    } catch (err: any) {
      if (callback?.onError)
        callback.onError({
          message: err?.message || "Gagal menghapus hari raya di database",
        });
      return null;
    } finally {
      if (callback?.onFullfilled) callback.onFullfilled();
    }
  }

  async deleteCalendar(
    academicYear?: string,
    callback?: FetchCallback<any>
  ): Promise<any> {
    try {
      const url = academicYear
        ? `${this.basePath}/${academicYear.replace("/", "-")}`
        : `${this.basePath}/current`;
      const res = await this.service.DELETE<any>(url);
      if (this.isSuccess(res)) {
        if (callback?.onSuccess) callback.onSuccess(res);
        return res;
      } else {
        if (callback?.onError)
          callback.onError({ message: res?.message, detail: res?.details });
        return null;
      }
    } catch (err: any) {
      if (callback?.onError)
        callback.onError({
          message: err?.message || "Gagal menghapus kalender akademik",
        });
      return null;
    } finally {
      if (callback?.onFullfilled) callback.onFullfilled();
    }
  }
}
