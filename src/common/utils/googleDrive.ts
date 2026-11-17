export interface GoogleDriveParseResult {
    isValid: boolean;
    isGoogleDrive: boolean;
    type: 'file' | 'document' | 'spreadsheet' | 'presentation' | 'folder' | 'web';
    typeLabel: string;
    id: string | null;
    embedUrl: string | null;
    originalUrl: string;
}

/**
 * Mem-parsing URL Google Drive dan mengonversinya menjadi URL embed/preview yang dapat ditampilkan di iframe.
 */
export const parseGoogleDriveUrl = (url: string | null | undefined): GoogleDriveParseResult => {
    if (!url || typeof url !== 'string' || !url.trim()) {
        return {
            isValid: false,
            isGoogleDrive: false,
            type: 'web',
            typeLabel: 'Kosong',
            id: null,
            embedUrl: null,
            originalUrl: '',
        };
    }

    const trimmed = url.trim();

    // 1. Google Drive File: /file/d/{id} (PDF, Images, Zip, Video, etc.)
    const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch) {
        const id = fileMatch[1];
        return {
            isValid: true,
            isGoogleDrive: true,
            type: 'file',
            typeLabel: 'File / Dokumen Google Drive',
            id,
            embedUrl: `https://drive.google.com/file/d/${id}/preview`,
            originalUrl: trimmed,
        };
    }

    // 2. Google Drive File via id query: drive.google.com/open?id={id} atau uc?id={id}
    const openMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (openMatch && (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com'))) {
        const id = openMatch[1];
        return {
            isValid: true,
            isGoogleDrive: true,
            type: 'file',
            typeLabel: 'File Google Drive',
            id,
            embedUrl: `https://drive.google.com/file/d/${id}/preview`,
            originalUrl: trimmed,
        };
    }

    // 3. Google Docs: /document/d/{id}
    const docMatch = trimmed.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
    if (docMatch) {
        const id = docMatch[1];
        return {
            isValid: true,
            isGoogleDrive: true,
            type: 'document',
            typeLabel: 'Google Docs (Dokumen)',
            id,
            embedUrl: `https://docs.google.com/document/d/${id}/preview`,
            originalUrl: trimmed,
        };
    }

    // 4. Google Sheets: /spreadsheets/d/{id}
    const sheetMatch = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
    if (sheetMatch) {
        const id = sheetMatch[1];
        return {
            isValid: true,
            isGoogleDrive: true,
            type: 'spreadsheet',
            typeLabel: 'Google Sheets (Spreadsheet)',
            id,
            embedUrl: `https://docs.google.com/spreadsheets/d/${id}/preview`,
            originalUrl: trimmed,
        };
    }

    // 5. Google Slides: /presentation/d/{id}
    const slideMatch = trimmed.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/);
    if (slideMatch) {
        const id = slideMatch[1];
        return {
            isValid: true,
            isGoogleDrive: true,
            type: 'presentation',
            typeLabel: 'Google Slides (Presentasi)',
            id,
            embedUrl: `https://docs.google.com/presentation/d/${id}/preview`,
            originalUrl: trimmed,
        };
    }

    // 6. Google Drive Folder: /drive/folders/{id}
    const folderMatch = trimmed.match(/\/drive\/folders\/([a-zA-Z0-9_-]+)/);
    if (folderMatch) {
        const id = folderMatch[1];
        return {
            isValid: true,
            isGoogleDrive: true,
            type: 'folder',
            typeLabel: 'Folder Google Drive',
            id,
            embedUrl: `https://drive.google.com/embeddedfolderview?id=${id}#list`,
            originalUrl: trimmed,
        };
    }

    // Fallback: General web URL (Link eksternal umum)
    const isHttp = trimmed.startsWith('http://') || trimmed.startsWith('https://');
    return {
        isValid: isHttp,
        isGoogleDrive: trimmed.includes('google.com'),
        type: 'web',
        typeLabel: isHttp ? 'Tautan Web' : 'Format Tidak Valid',
        id: null,
        embedUrl: isHttp ? trimmed : null,
        originalUrl: trimmed,
    };
};

