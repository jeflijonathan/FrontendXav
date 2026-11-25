import type {
    AcademicYearMeetingItem,
    BatchSaveAttendancePayload,
    StudentAttendanceSheetItem,
} from '@api/attendance/model';

export function buildBatchAttendancePayload(
    idSchoolInformation: string,
    idClass: string,
    meeting: AcademicYearMeetingItem,
    students: StudentAttendanceSheetItem[]
): BatchSaveAttendancePayload {
    return {
        id_school_information: idSchoolInformation,
        id_class: idClass,
        id_teacher: meeting.teacher_id,
        teacher_name: meeting.teacher_name,
        subject_name: meeting.subject_name,
        date: meeting.date,
        day: meeting.day,
        jp: String(meeting.jp),
        time_range: meeting.time_range,
        attendances: students.map((s) => ({
            id_student: s.id_student,
            status: s.status,
            notes: s.notes,
        })),
    };
}
