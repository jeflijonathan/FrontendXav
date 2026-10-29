import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { API } from "@api/index";
import LocalStorage from "@utils/localStorage";
import { snackbar } from "@utils/snackbar";

const useLoginEmployee = () => {
    const { handleSubmit } = useFormContext();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLoginEmployee = handleSubmit(async (payload) => {
        setIsLoading(true);
        try {
            const api = new API();
            const data = {
                niy: payload.identifier,
                password: payload.password,
            };

            const response = await api.POST("/auth/login/employee", data);

            if (response.status_code === 200 || response.status === "success") {
                LocalStorage().setItem("accessToken", response.data?.token);
                LocalStorage().setItem("user", response.data?.user);

                snackbar.success("Welcome back!");
                navigate("/dashboard");
            } else {
                snackbar.error(response.message || "Invalid NIY or Password.");
            }
        } catch (error: any) {
            snackbar.error(error?.response?.data?.message || "An error occurred during login.");
        } finally {
            setIsLoading(false);
        }
    });

    return {
        isLoading,
        handleLoginEmployee,
    };
};

export default useLoginEmployee;
