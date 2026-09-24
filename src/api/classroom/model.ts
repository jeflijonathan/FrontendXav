export interface ClassroomResponseModel {
    id_class_room: string;
    id_teacher_subject: string;
    id_class: string;
    id_school_information: string;
    status: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateClassroomRequest {
    id_teacher_subject: string;
    id_class: string;
    id_school_information: string;
    status?: boolean;
}

export interface UpdateClassroomRequest {
    id_teacher_subject?: string;
    id_class?: string;
    id_school_information?: string;
    status?: boolean;
}
