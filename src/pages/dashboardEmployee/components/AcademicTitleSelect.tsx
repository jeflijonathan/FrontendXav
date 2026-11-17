import React from "react";
import { Autocomplete, TextField, Chip, Box, Typography } from "@mui/material";

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
    getDescription
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
                        newValue
                            .map((v) => (typeof v === "string" ? v.trim() : ""))
                            .filter(Boolean)
                    )
                );
                onChange(cleaned);
            }}
            renderTags={(tagValue: readonly string[], getTagProps) =>
                tagValue.map((option: string, index: number) => {
                    const desc = getDescription ? getDescription(option) : undefined;
                    return (
                        <Chip
                            {...getTagProps({ index })}
                            key={option + index}
                            label={
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                    <span style={{ fontWeight: 600 }}>{option}</span>
                                    {desc && (
                                        <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>
                                            ({desc})
                                        </span>
                                    )}
                                </Box>
                            }
                            size="small"
                            color={type === "depan" ? "primary" : "secondary"}
                            variant="filled"
                            sx={{
                                fontWeight: 500,
                                borderRadius: 1.5,
                            }}
                        />
                    );
                })
            }
            renderOption={(props, option) => {
                const desc = getDescription ? getDescription(option) : undefined;
                return (
                    <li {...props} key={option}>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {option}
                            </Typography>
                            {desc && (
                                <Typography variant="caption" color="text.secondary">
                                    {desc}
                                </Typography>
                            )}
                        </Box>
                    </li>
                );
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
