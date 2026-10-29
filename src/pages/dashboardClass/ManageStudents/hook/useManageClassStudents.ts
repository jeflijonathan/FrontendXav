import { useState, useEffect, useMemo, useCallback } from "react";
import ClassService from "@api/class/service";
import type { ClassResponseModel, StudentInClassModel } from "@api/class/model";
import { snackbar } from "@utils/snackbar";
import { filterEnrolledStudents, formatStudentFullName } from "../utils/manageStudentsHelper";
import useAddStudentsModal from "./useAddStudentsModal";

interface UseManageClassStudentsParams {
    classItem: ClassResponseModel | null;
    isOpen: boolean;
    onClose: () => void;
    onClassUpdated?: () => void;
}

export const useManageClassStudents = ({
    classItem,
    isOpen,
    onClose,
    onClassUpdated,
}: UseManageClassStudentsParams) => {
    const classService = useMemo(() => new ClassService(), []);

    // State daftar siswa kelas
    const [students, setStudents] = useState<StudentInClassModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // State konfirmasi pengeluaran siswa
    const [studentToRemove, setStudentToRemove] = useState<StudentInClassModel | null>(null);
    const [isRemoving, setIsRemoving] = useState(false);

    // State konfirmasi pemindahan siswa (konflik pada periode yang sama)
    const [transferConflicts, setTransferConflicts] = useState<StudentInClassModel[]>([]);

    // Hook modal tambah siswa
    const addModal = useAddStudentsModal(classService);

    // Nama kelas untuk ditampilkan
    const classNameDisplay = classItem?.name || `Kelas ${classItem?.kelas || ""}`;

    // Fetch siswa kelas saat dialog dibuka
    const fetchStudents = useCallback(() => {
        if (!classItem?.id_class) return;
        setIsLoading(true);
        classService.getClassStudents(classItem.id_class, {
            onSuccess: (res) => {
                setStudents(Array.isArray(res) ? res : []);
            },
            onError: (err) => {
                snackbar.error(err?.message || "Gagal memuat siswa kelas");
            },
            onFullfilled: () => setIsLoading(false),
        });
    }, [classItem?.id_class, classService]);

    useEffect(() => {
        if (isOpen && classItem?.id_class) {
            fetchStudents();
            setSearchQuery("");
        }
    }, [isOpen, classItem?.id_class, fetchStudents]);

    // Filter daftar siswa kelas
    const filteredStudents = useMemo(() => {
        return filterEnrolledStudents(students, searchQuery);
    }, [students, searchQuery]);

    // Buka modal tambah siswa
    const handleOpenAddModal = () => {
        if (!classItem?.id_class) return;
        addModal.openModal(classItem.id_class);
    };

    // Validasi sebelum submit penambahan siswa (cek konflik kelas di periode sama)
    const handlePreSubmitAdd = () => {
        if (!classItem?.id_class || addModal.selectedStudentIds.length === 0) return;

        const conflicts = addModal.getSelectedConflicts();
        if (conflicts.length > 0) {
            setTransferConflicts(conflicts);
        } else {
            executeAddStudents(false);
        }
    };

    // Eksekusi penambahan / pemindahan siswa ke kelas
    const executeAddStudents = (forceTransfer: boolean) => {
        if (!classItem?.id_class || addModal.selectedStudentIds.length === 0) return;
        addModal.setIsSubmitting(true);
        addModal.setErrorMessage(null);

        const totalSelected = addModal.selectedStudentIds.length;

        classService.addStudentsToClass(
            classItem.id_class,
            addModal.selectedStudentIds,
            forceTransfer,
            {
                onSuccess: () => {
                    const actionMsg = forceTransfer ? "dipindahkan / ditambahkan" : "ditambahkan";
                    snackbar.success(`${totalSelected} peserta didik berhasil ${actionMsg} ke kelas`);
                    addModal.closeModal();
                    setTransferConflicts([]);
                    fetchStudents();
                    if (onClassUpdated) onClassUpdated();
                },
                onError: (err) => {
                    const msg = err?.message || "Gagal menambahkan peserta didik ke kelas";
                    addModal.setErrorMessage(msg);
                    snackbar.error(msg);
                },
                onFullfilled: () => addModal.setIsSubmitting(false),
            }
        );
    };

    // Eksekusi pengeluaran siswa dari kelas
    const handleConfirmRemove = () => {
        if (!classItem?.id_class || !studentToRemove) return;
        const studentName = formatStudentFullName(studentToRemove);
        setIsRemoving(true);

        classService.removeStudentFromClass(classItem.id_class, studentToRemove.id, {
            onSuccess: () => {
                snackbar.success(`Siswa "${studentName}" berhasil dikeluarkan dari kelas`);
                setStudentToRemove(null);
                fetchStudents();
                if (onClassUpdated) onClassUpdated();
            },
            onError: (err) => {
                snackbar.error(err?.message || "Gagal mengeluarkan siswa");
            },
            onFullfilled: () => setIsRemoving(false),
        });
    };

    return {
        classNameDisplay,
        students,
        filteredStudents,
        isLoading,
        searchQuery,
        setSearchQuery,
        studentToRemove,
        setStudentToRemove,
        isRemoving,
        transferConflicts,
        setTransferConflicts,
        addModal,
        handleOpenAddModal,
        handlePreSubmitAdd,
        executeAddStudents,
        handleConfirmRemove,
        onClose,
    };
};

export default useManageClassStudents;

