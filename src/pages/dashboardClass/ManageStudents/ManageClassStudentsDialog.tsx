import React from "react";
import { Button } from "@mui/material";
import { BaseDialog, DialogHeader, DialogBody, DialogFooter } from "@components/Dialog";
import type { ClassResponseModel } from "@api/class/model";
import useManageClassStudents from "./hook/useManageClassStudents";
import ClassHeaderInfo from "./components/ClassHeaderInfo";
import EnrolledStudentsTable from "./components/EnrolledStudentsTable";
import AddStudentsDialog from "./components/AddStudentsDialog";
import TransferConfirmDialog from "./components/TransferConfirmDialog";
import RemoveStudentConfirmDialog from "./components/RemoveStudentConfirmDialog";

interface ManageClassStudentsDialogProps {
    classItem: ClassResponseModel | null;
    isOpen: boolean;
    onClose: () => void;
    onClassUpdated?: () => void;
}

/**
 * Representation Component (UI Logic Entry)
 * Bertugas mengomposisikan komponen UI dialog dan menghubungkannya dengan Framework Logic (Hook).
 */
const ManageClassStudentsDialog: React.FC<ManageClassStudentsDialogProps> = ({
    classItem,
    isOpen,
    onClose,
    onClassUpdated,
}) => {
    // Framework Logic
    const {
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
    } = useManageClassStudents({
        classItem,
        isOpen,
        onClose,
        onClassUpdated,
    });

    if (!classItem) return null;

    return (
        <>
            {/* Dialog Utama: Kelola Siswa Kelas */}
            <BaseDialog isOpen={isOpen} onClose={onClose} maxWidth="lg">
                <DialogHeader
                    title={`Kelola Siswa - ${classNameDisplay}`}
                    onClose={onClose}
                />
                <DialogBody>
                    {/* Info Header Kelas */}
                    <ClassHeaderInfo
                        classItem={classItem}
                        classNameDisplay={classNameDisplay}
                        totalStudents={students.length}
                    />

                    {/* Tabel Siswa yang Terdaftar */}
                    <EnrolledStudentsTable
                        students={filteredStudents}
                        isLoading={isLoading}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onOpenAddModal={handleOpenAddModal}
                        onRequestRemove={(student) => setStudentToRemove(student)}
                    />
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onClose}
                        sx={{ borderRadius: "8px", textTransform: "none", px: 3 }}
                    >
                        Tutup
                    </Button>
                </DialogFooter>
            </BaseDialog>

            {/* Sub-Dialog 1: Modal Tambah Peserta Didik */}
            <AddStudentsDialog
                isOpen={addModal.isOpen}
                classNameDisplay={classNameDisplay}
                students={addModal.filteredAvailable}
                selectedStudentIds={addModal.selectedStudentIds}
                isLoading={addModal.isLoading}
                searchQuery={addModal.searchQuery}
                errorMessage={addModal.errorMessage}
                isSubmitting={addModal.isSubmitting}
                onClose={addModal.closeModal}
                onSearchChange={addModal.setSearchQuery}
                onToggleSelect={addModal.toggleSelect}
                onToggleSelectAll={addModal.toggleSelectAll}
                onSubmit={handlePreSubmitAdd}
                onClearError={() => addModal.setErrorMessage(null)}
            />

            {/* Sub-Dialog 2: Modal Konfirmasi Pemindahan Kelas (Siswa di Periode Sama) */}
            <TransferConfirmDialog
                isOpen={transferConflicts.length > 0}
                conflicts={transferConflicts}
                classNameDisplay={classNameDisplay}
                isSubmitting={addModal.isSubmitting}
                onClose={() => !addModal.isSubmitting && setTransferConflicts([])}
                onConfirmTransfer={() => executeAddStudents(true)}
            />

            {/* Sub-Dialog 3: Modal Konfirmasi Keluarkan Siswa */}
            <RemoveStudentConfirmDialog
                isOpen={Boolean(studentToRemove)}
                student={studentToRemove}
                classNameDisplay={classNameDisplay}
                isRemoving={isRemoving}
                onClose={() => !isRemoving && setStudentToRemove(null)}
                onConfirmRemove={handleConfirmRemove}
            />
        </>
    );
};

export default ManageClassStudentsDialog;
