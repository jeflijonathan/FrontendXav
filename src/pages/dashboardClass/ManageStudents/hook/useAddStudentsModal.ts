import { useState, useMemo } from "react";
import ClassService from "@api/class/service";
import type { StudentInClassModel } from "@api/class/model";
import { snackbar } from "@utils/snackbar";
import {
    filterAvailableStudents,
    toggleStudentSelection,
    toggleSelectAllStudents,
    detectTransferConflicts,
} from "../utils/manageStudentsHelper";

export const useAddStudentsModal = (classService: ClassService) => {
    const [isOpen, setIsOpen] = useState(false);
    const [availableStudents, setAvailableStudents] = useState<StudentInClassModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Buka modal & muat data siswa yang tersedia
    const openModal = (idClass: string) => {
        setIsOpen(true);
        setSelectedStudentIds([]);
        setSearchQuery("");
        setErrorMessage(null);
        setIsLoading(true);

        classService.getAvailableStudents(idClass, {
            onSuccess: (res) => {
                setAvailableStudents(Array.isArray(res) ? res : []);
            },
            onError: (err) => {
                snackbar.error(err?.message || "Gagal memuat daftar siswa yang tersedia");
            },
            onFullfilled: () => setIsLoading(false),
        });
    };

    const closeModal = () => {
        if (isSubmitting) return;
        setIsOpen(false);
        setSelectedStudentIds([]);
        setSearchQuery("");
        setErrorMessage(null);
    };

    const toggleSelect = (id: string) => {
        setSelectedStudentIds((prev) => toggleStudentSelection(prev, id));
    };

    // Filter daftar siswa tersedia berdasarkan kata kunci
    const filteredAvailable = useMemo(() => {
        return filterAvailableStudents(availableStudents, searchQuery);
    }, [availableStudents, searchQuery]);

    const toggleSelectAll = () => {
        const visibleIds = filteredAvailable.map((s) => s.id);
        setSelectedStudentIds((prev) => toggleSelectAllStudents(prev, visibleIds));
    };

    // Cek konflik pemindahan kelas
    const getSelectedConflicts = () => {
        return detectTransferConflicts(selectedStudentIds, availableStudents);
    };

    return {
        isOpen,
        availableStudents,
        filteredAvailable,
        isLoading,
        selectedStudentIds,
        searchQuery,
        isSubmitting,
        errorMessage,
        openModal,
        closeModal,
        toggleSelect,
        toggleSelectAll,
        setSearchQuery,
        setIsSubmitting,
        setErrorMessage,
        setSelectedStudentIds,
        getSelectedConflicts,
    };
};

export default useAddStudentsModal;

