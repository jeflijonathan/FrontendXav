export type UploadFileResponseModel = {
    id: string;
    original_name: string;
    file_url: string;
    mime_type: string;
    file_size: number;
    created_at?: string;
    updated_at?: string;
    filename?: string;
    content_type?: string;
    file_path?: string;
    upload_date?: string;
    upload_by?: string;
}

export type UploadFileCreateModel = {
    fileUpload: File
}
