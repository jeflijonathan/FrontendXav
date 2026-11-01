import * as yup from "yup";
import type { StudentLoginRequestModel } from "@api/auth/model";

export const loginSiswaSchema: yup.ObjectSchema<StudentLoginRequestModel> = yup.object().shape({
  nis: yup
    .string()
    .required("Nomor Induk Siswa (NIS) wajib diisi")
    .min(3, "NIS minimal 3 karakter"),
  password: yup
    .string()
    .required("Kata sandi wajib diisi")
    .min(6, "Kata sandi minimal 6 karakter"),
});

export const defaultLoginSiswaValues: StudentLoginRequestModel = {
  nis: "",
  password: "",
};
