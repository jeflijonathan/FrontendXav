export type ParsedError = { field?: string; message: string };

/**
 * Parse backend error details (string[] atau { field, message }[])
 * ke format { field?, message } yang konsisten untuk store & UI.
 */
export function parseErrorDetails(detail?: string[]): ParsedError[] {
    return (detail ?? []).map((item) => {
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
        return {
            field: (item as any).field,
            message: (item as any).message ?? String(item),
        };
    });
}

/**
 * Format parsed errors ke string gabungan untuk ditampilkan di form error.
 */
export function formatErrorDetails(errors: ParsedError[]): string {
    return errors
        .map((e) => (e.field ? `${e.field}: ${e.message}` : e.message))
        .join("\n");
}
