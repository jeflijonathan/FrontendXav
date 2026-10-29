import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { API } from "@api/index";
import LocalStorage from "@utils/localStorage";

const useLoginProspectiveStudent = () => {
    const { handleSubmit } = useFormContext();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const handleLoginProspectiveStudent = handleSubmit(async (payload) => {
        setIsLoading(true);
        try {
            const api = new API();
            const data = {
                nik: payload.nik,
                password: payload.password,
            };

            const response = await api.POST("/auth/login/prospective-student", data);

            if (response.status_code === 200 || response.status === "success") {
                LocalStorage().setItem("accessToken", response.data?.token);
                LocalStorage().setItem("user", response.data?.user);

                enqueueSnackbar("Login successful!", { variant: "success" });
                navigate("/dashboard");
            } else {
                enqueueSnackbar(response.message || "Failed to login. Please check your credentials.", { variant: "error" });
            }
        } catch (error: any) {
            enqueueSnackbar(error?.response?.data?.message || "An error occurred during login.", { variant: "error" });
        } finally {
            setIsLoading(false);
        }
    });

    return {
        isLoading,
        handleLoginProspectiveStudent,
    };
};

export default useLoginProspectiveStudent;