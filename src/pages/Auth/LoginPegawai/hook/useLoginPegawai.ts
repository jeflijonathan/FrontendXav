import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import AuthService from "@api/auth/service";
import useAuthStore from "@common/store/useAuthStore";
import {
  loginPegawaiSchema,
  defaultLoginPegawaiValues,
} from "../utils/loginPegawaiSchema";
import type { EmployeeLoginRequestModel } from "@api/auth/model";

export const useLoginPegawai = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();
  const { setLoginSuccess, setActiveRole } = useAuthStore();
  const authService = new AuthService();

  const form = useForm<EmployeeLoginRequestModel>({
    resolver: yupResolver(loginPegawaiSchema) as Resolver<EmployeeLoginRequestModel>,
    defaultValues: defaultLoginPegawaiValues,
  });

  const onSubmit = form.handleSubmit(async (payload: EmployeeLoginRequestModel) => {
    setIsLoading(true);
    setServerError(null);

    await authService.loginEmployee(payload, {
      onSuccess: (res) => {
        setIsLoading(false);
        const roles = res.user?.roles ?? [];

        // Selalu reset activeRole agar dialog pilih role muncul
        // User harus memilih role sebelum masuk ke dashboard
        setActiveRole(null);
        setLoginSuccess(res.user);

        enqueueSnackbar("Login berhasil! Silakan pilih role untuk melanjutkan.", {
          variant: "success",
        });

        // Arahkan ke dashboard — ProtectedRoute akan memunculkan dialog pilih role
        // karena activeRole masih null (mandatory role selection)
        const from = (location.state as any)?.from?.pathname || "/dashboard";
        if (roles.length > 0) {
          navigate(from, { replace: true });
        } else {
          // Tidak ada role sama sekali — tetap ke dashboard
          navigate(from, { replace: true });
        }
      },
      onError: (err) => {
        setIsLoading(false);
        const msg = err.message || "Gagal masuk. Periksa kembali NIY dan kata sandi.";
        setServerError(msg);
        enqueueSnackbar(msg, { variant: "error" });
      },
    });
  });

  return {
    form,
    isLoading,
    serverError,
    showPassword,
    toggleShowPassword: () => setShowPassword((prev) => !prev),
    onSubmit,
  };
};

export default useLoginPegawai;
