import React from "react";
import { Autocomplete, TextField } from "@mui/material";

interface AcademicTitleSelectProps {
    label: string;
    placeholder?: string;
    options: string[];
    value: string[];
    onChange: (val: string[]) => void;
    helperText?: string;
    error?: boolean;
    type?: "depan" | "belakang";
    getDescription?: (name: string) => string | undefined;
}

export const AcademicTitleSelect: React.FC<AcademicTitleSelectProps> = ({
    label,
    placeholder = "Pilih atau ketik gelar...",
    options,
    value,
    onChange,
    helperText,
    error,
    type = "depan",
}) => {
    return (
        <Autocomplete<string, true, false, true>
            multiple
            freeSolo
            options={options}
            value={value || []}
            onChange={(_, newValue) => {
                // Ensure unique values and trim whitespace
                const cleaned = Array.from(
                    new Set(
                        (newValue as (string | any)[])
                            .map((v) => (typeof v === "string" ? v.trim() : ""))
                            .filter(Boolean)
                    )
                );
                onChange(cleaned);
            }}
            slotProps={{
                chip: {
                    size: "small",
                    color: type === "depan" ? "primary" : "secondary",
                    variant: "filled",
                },
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    placeholder={value && value.length > 0 ? "" : placeholder}
                    size="small"
                    error={error}
                    helperText={helperText}
                    fullWidth
                />
            )}
        />
    );
};

export default AcademicTitleSelect;
