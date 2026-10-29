import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { API } from "@api/index";
import SessionStorage from "@utils/sessionStorage";
import { snackbar } from "@utils/snackbar";

const useLoginStudents = () => {
    const { handleSubmit } = useFormContext();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const sessionStorage = SessionStorage()

    const handleLoginStudent = handleSubmit(async (payload) => {
        setIsLoading(true);
        try {
            const api = new API();
            const data = {
                nis: payload.nis,
                password: payload.password,
            };

            const response = await api.POST("/auth/login/student", data);

            if (response.status_code === 200 || response.status === "success") {
                sessionStorage.setItem("accessToken", response.data?.token);
                sessionStorage.setItem("user", response.data?.user);

                snackbar.success("Welcome back, Student!");
                navigate("/dashboard");
            } else {
                snackbar.error("Invalid NIS or Password.");
            }
        } catch (error: any) {
            snackbar.error(error?.response?.data?.message || "An error occurred during login.");
        } finally {
            setIsLoading(false);
        }
    });

    return {
        isLoading,
        handleLoginStudent,
    };
};

export default useLoginStudents;