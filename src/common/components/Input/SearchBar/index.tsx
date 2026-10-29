import { Search } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import useDebouncer from "@utils/useDebouncer";
import { useEffect, useRef, useState } from "react";

interface Props {
    className?: string;
    label?: string;
    placeholder?: string;
    onChange: (value: string) => void;
}
const SearchBar = (props: Props) => {
    const { className, label, placeholder, onChange } = props;

    const isFirstRender = useRef(true);
    const [tempValue, setTempValue] = useState<string>("");
    const debouncedValue = useDebouncer(tempValue, 500);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        onChange(debouncedValue);
    }, [debouncedValue]);

    return (
        <TextField
            className={`rounded-xl placeholder:text-lg ${className}`
            }
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            label={label}
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start" >
                            <Search className="text-white" />
                        </InputAdornment>
                    ),
                },
            }}
            placeholder={placeholder}
            sx={{
                "& .MuiInputBase-input": {
                    height: "1.4rem",
                },
                "& .MuiOutlinedInput-root": {
                    borderRadius: "0.75rem",
                    "& input": {
                        color: "white",
                        padding: "0.5rem 0.1rem",
                        fontSize: "0.875rem",
                    },
                },
            }}
        />
    );
};

export default SearchBar;