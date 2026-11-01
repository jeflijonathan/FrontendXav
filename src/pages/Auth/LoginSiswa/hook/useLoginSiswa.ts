import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import AuthService from "@api/auth/service";
import useAuthStore from "@common/store/useAuthStore";
import {
  loginSiswaSchema,
  defaultLoginSiswaValues,
} from "../utils/loginSiswaSchema";
import type { StudentLoginRequestModel } from "@api/auth/model";

export const useLoginSiswa = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();
  const { setLoginSuccess } = useAuthStore();
  const authService = new AuthService();

  const form = useForm<StudentLoginRequestModel>({
    resolver: yupResolver(loginSiswaSchema) as Resolver<StudentLoginRequestModel>,
    defaultValues: defaultLoginSiswaValues,
  });

  const onSubmit = form.handleSubmit(async (payload: StudentLoginRequestModel) => {
    setIsLoading(true);
    setServerError(null);

    await authService.loginStudent(payload, {
      onSuccess: (res) => {
        setIsLoading(false);
        setLoginSuccess(res.user);
        enqueueSnackbar("Login siswa berhasil!", { variant: "success" });

        if (res.user.roles && res.user.roles.length === 1) {
          const from = (location.state as any)?.from?.pathname || "/dashboard";
          navigate(from, { replace: true });
        }
      },
      onError: (err) => {
        setIsLoading(false);
        const msg = err.message || "Gagal masuk. Periksa kembali NIS dan kata sandi.";
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

export default useLoginSiswa;
