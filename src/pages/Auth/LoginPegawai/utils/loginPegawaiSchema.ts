import * as yup from "yup";
import type { EmployeeLoginRequestModel } from "@api/auth/model";

export const loginPegawaiSchema: yup.ObjectSchema<EmployeeLoginRequestModel> = yup.object().shape({
  niy: yup
    .string()
    .required("Nomor Induk Yayasan (NIY) wajib diisi")
    .min(3, "NIY minimal 3 karakter"),
  password: yup
    .string()
    .required("Kata sandi wajib diisi")
    .min(6, "Kata sandi minimal 6 karakter"),
});

export const defaultLoginPegawaiValues: EmployeeLoginRequestModel = {
  niy: "",
  password: "",
};
