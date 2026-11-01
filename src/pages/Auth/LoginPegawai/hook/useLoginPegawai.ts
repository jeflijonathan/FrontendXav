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
  const { setLoginSuccess } = useAuthStore();
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
        setLoginSuccess(res.user);
        enqueueSnackbar("Login pegawai berhasil!", { variant: "success" });

        // If user has only 1 role, redirect to dashboard or previous location
        if (res.user.roles && res.user.roles.length === 1) {
          const from = (location.state as any)?.from?.pathname || "/dashboard";
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
