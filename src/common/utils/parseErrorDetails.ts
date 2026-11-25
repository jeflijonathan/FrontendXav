export type ParsedError = { field?: string; message: string };

/**
 * Parse backend error details (string[] atau { field, message }[])
 * ke format { field?, message } yang konsisten untuk store & UI.
 */
export function parseErrorDetails(detail?: unknown): ParsedError[] {
    // Handle null/undefined
    if (detail == null) return [];

    // Handle plain string (e.g. "Some error message")
    if (typeof detail === "string") {
        if (!detail.trim()) return [];
        const colonIdx = detail.indexOf(":");
        if (colonIdx > 0) {
            return [{
                field: detail.substring(0, colonIdx).trim(),
                message: detail.substring(colonIdx + 1).trim(),
            }];
        }
        return [{ message: detail }];
    }

    // Handle array (string[] or {field, message}[])
    if (Array.isArray(detail)) {
        return detail.map((item) => {
            if (typeof item === "string") {
                const colonIdx = item.indexOf(":");
                if (colonIdx > 0) {
                    return {
                        field: item.substring(0, colonIdx).trim(),
                        message: item.substring(colonIdx + 1).trim(),
                    };
                }
                return { message: item };
            }
            if (typeof item === "object" && item !== null) {
                return {
                    field: (item as any).field,
                    message: (item as any).message ?? (item as any).msg ?? String(item),
                };
            }
            return { message: String(item) };
        });
    }

    // Handle object (e.g. { status: "error", message: "...", ... })
    if (typeof detail === "object") {
        const obj = detail as any;
        const msg = obj.message || obj.msg || obj.detail || JSON.stringify(detail);
        return [{ message: typeof msg === "string" ? msg : String(msg) }];
    }

    // Fallback
    return [{ message: String(detail) }];
}

/**
 * Format parsed errors ke string gabungan untuk ditampilkan di form error.
 */
export function formatErrorDetails(errors: ParsedError[]): string {
    return errors
        .map((e) => (e.field ? `${e.field}: ${e.message}` : e.message))
        .join("\n");
}
