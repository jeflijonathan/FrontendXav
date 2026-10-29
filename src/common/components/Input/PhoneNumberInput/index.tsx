import { useState, useEffect } from "react";
import { TextField, type TextFieldProps } from "@mui/material";

/**
 * Normalisasi nomor telepon ke format E.164 (+62xxxxxxxx).
 * Mendukung input: 08xxx, 628xxx, +628xxx, 8xxx
 */
export function normalizePhoneNumber(raw: string): string {
    const digits = raw.replace(/[\s\-().]/g, "");
    if (!digits) return "";

    // Sudah E.164
    if (digits.startsWith("+62")) return digits;
    // Dimulai dengan 62
    if (digits.startsWith("62")) return `+${digits}`;
    // Dimulai dengan 0 (lokal Indonesia)
    if (digits.startsWith("0")) return `+62${digits.slice(1)}`;
    // Langsung angka tanpa kode negara (misal: 81234567890)
    return `+62${digits}`;
}

/**
 * Validasi dasar nomor HP Indonesia.
 * Nomor valid: +628xx dengan panjang 10-15 digit total.
 */
export function isValidIndonesianPhone(normalized: string): boolean {
    // Harus diawali +62 8xx dan total 12-15 karakter (+62 + 9-12 digit)
    return /^\+628\d{8,11}$/.test(normalized);
}

type Props = Omit<TextFieldProps, "onChange" | "value"> & {
    value: string;
    onChange: (normalized: string) => void;
    showNormalized?: boolean;
};

/**
 * Input nomor telepon dengan normalisasi otomatis ke E.164 saat blur.
 * - Saat mengetik: tampilkan nilai mentah agar nyaman diedit
 * - Saat blur: normalisasi dan validasi, tampilkan format +62xxx
 */
const PhoneNumberInput = ({ value, onChange, showNormalized = true, ...rest }: Props) => {
    const [displayValue, setDisplayValue] = useState(value ?? "");
    const [error, setError] = useState<string>("");

    // Sync jika value berubah dari luar (misal saat form di-reset)
    useEffect(() => {
        setDisplayValue(value ?? "");
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDisplayValue(e.target.value);
        setError("");
    };

    const handleBlur = () => {
        const raw = displayValue.trim();
        if (!raw) {
            setError("");
            onChange("");
            return;
        }

        const normalized = normalizePhoneNumber(raw);
        if (!isValidIndonesianPhone(normalized)) {
            setError("Nomor tidak valid. Contoh: 081234567890 atau +6281234567890");
            // Tetap simpan nilai mentah agar user bisa mengedit
            onChange(raw);
            return;
        }

        setError("");
        if (showNormalized) setDisplayValue(normalized);
        onChange(normalized);
    };

    return (
        <TextField
            {...rest}
            type="tel"
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
            error={rest.error || !!error}
            helperText={error || (rest.helperText as string)}
            placeholder="Contoh: 081234567890"
            slotProps={{
                htmlInput: { maxLength: 20 }
            }}
        />
    );
};

export default PhoneNumberInput;
