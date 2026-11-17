import React, { useRef, useState, useEffect, useCallback } from "react";
import {
    Box,
    Typography,
    IconButton,
    Tooltip,
    Divider,
    Stack,
    Button,
    Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatStrikethroughIcon from "@mui/icons-material/FormatStrikethrough";
import TitleIcon from "@mui/icons-material/Title";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import FormatClearIcon from "@mui/icons-material/FormatClear";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";

interface WordDescriptionEditorProps {
    value: string;
    onChange: (val: string) => void;
    error?: boolean;
    helperText?: string;
    label?: string;
    rows?: number;
    placeholder?: string;
    required?: boolean;
}

/**
 * Mengonversi teks yang mungkin mengandung format markdown lama atau tag campuran
 * ke format HTML bersih yang siap dirender secara visual (WYSIWYG)
 */
const normalizeToHtml = (raw: string): string => {
    if (!raw) return "";

    // Jika sudah berisi tag HTML terformat, cukup ubah markdown sisa (seperti **tebal**)
    let html = raw;

    // Ubah markdown bold **teks** menjadi <strong>teks</strong>
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Ubah markdown italic *teks* menjadi <em>teks</em>
    html = html.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, "<em>$1</em>");

    // Ubah markdown strikethrough ~~teks~~ menjadi <del>teks</del>
    html = html.replace(/~~(.*?)~~/g, "<del>$1</del>");

    // Jika string masih polos tanpa tag paragraf / div / br, ubah newline ke <br>
    if (!/<(p|div|br|ul|ol|li|h[1-6]|blockquote)/i.test(html) && html.includes("\n")) {
        html = html.replace(/\n/g, "<br>");
    }

    return html;
};

export const WordDescriptionEditor: React.FC<WordDescriptionEditorProps> = ({
    value = "",
    onChange,
    error,
    helperText,
    label = "Deskripsi / Isi Pengumuman",
    rows = 6,
    placeholder = "Tuliskan isi pengumuman secara rinci dengan format Word...",
    required = false,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const editorRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
    const [wordCount, setWordCount] = useState<number>(0);
    const [charCount, setCharCount] = useState<number>(0);

    // Update counter dari teks bersih
    const updateCounts = useCallback((text: string) => {
        const clean = text.replace(/\s+/g, " ").trim();
        setCharCount(clean ? clean.length : 0);
        setWordCount(clean ? clean.split(" ").filter(Boolean).length : 0);
    }, []);

    // Sinkronisasi nilai luar ke editor contentEditable hanya saat perlu
    useEffect(() => {
        if (!editorRef.current) return;

        const currentHtml = editorRef.current.innerHTML;
        const normalized = normalizeToHtml(value);

        // Hanya perbarui innerHTML jika konten berbeda secara substansial
        // (menghindari reset kursor saat user mengetik)
        if (
            currentHtml !== normalized &&
            (currentHtml === "" ||
                currentHtml === "<br>" ||
                value === "" ||
                !editorRef.current.contains(document.activeElement))
        ) {
            editorRef.current.innerHTML = normalized;
            updateCounts(editorRef.current.innerText || "");
        }
    }, [value, updateCounts]);

    // Handle input pengguna pada editor contentEditable
    const handleInput = () => {
        if (!editorRef.current) return;
        const html = editorRef.current.innerHTML;
        const text = editorRef.current.innerText || "";
        updateCounts(text);
        onChange(html === "<br>" ? "" : html);
    };

    // Eksekusi format Word langsung (WYSIWYG: Bold, Italic, Underline, dll.)
    const execWordCommand = (command: string, arg?: string) => {
        if (editorRef.current) {
            editorRef.current.focus();
        }
        document.execCommand(command, false, arg);
        handleInput();
    };

    // Sisipkan Link
    const handleInsertLink = () => {
        const url = window.prompt("Masukkan URL tautan dokumen (contoh: https://drive.google.com/...):");
        if (url) {
            execWordCommand("createLink", url);
        }
    };

    // Sisipkan Heading / Judul
    const handleInsertHeading = () => {
        execWordCommand("formatBlock", "<h3>");
    };

    // Sisipkan Kutipan / Catatan
    const handleInsertQuote = () => {
        execWordCommand("formatBlock", "<blockquote>");
    };

    // Bersihkan semua format
    const handleClearFormat = () => {
        execWordCommand("removeFormat");
    };

    return (
        <Box sx={{ width: "100%" }}>
            {/* Header Toolbar Mirip Microsoft Word */}
            <Box
                sx={{
                    border: isDark
                        ? error
                            ? "1px solid #ef4444"
                            : "1px solid #27272a"
                        : error
                        ? "1px solid #ef4444"
                        : "1px solid #cbd5e1",
                    borderRadius: 2.5,
                    overflow: "hidden",
                    bgcolor: isDark ? "#141416" : "#ffffff",
                    transition: "border-color 0.2s ease",
                    "&:focus-within": {
                        borderColor: "#3b82f6",
                        boxShadow: "0 0 0 1px #3b82f6",
                    },
                }}
            >
                {/* Word Ribbon Toolbar */}
                <Box
                    sx={{
                        p: 1,
                        px: 1.5,
                        bgcolor: isDark ? "#18181b" : "#f8fafc",
                        borderBottom: isDark ? "1px solid #27272a" : "1px solid #e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 1,
                    }}
                >
                    {/* Left: Formatting Tools */}
                    <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                        <Typography
                            variant="caption"
                            sx={{
                                fontWeight: 800,
                                mr: 1,
                                color: isDark ? "#93c5fd" : "#2563eb",
                                fontSize: "11px",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                display: { xs: "none", sm: "block" },
                            }}
                        >
                            WORD TOOLS:
                        </Typography>

                        {/* Bold */}
                        <Tooltip title="Tebal (Bold)" arrow>
                            <IconButton
                                size="small"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    execWordCommand("bold");
                                }}
                                sx={{
                                    borderRadius: 1.5,
                                    color: isDark ? "#f4f4f5" : "#0f172a",
                                    "&:hover": { bgcolor: isDark ? "#27272a" : "#e2e8f0" },
                                }}
                            >
                                <FormatBoldIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        {/* Italic */}
                        <Tooltip title="Miring (Italic)" arrow>
                            <IconButton
                                size="small"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    execWordCommand("italic");
                                }}
                                sx={{
                                    borderRadius: 1.5,
                                    color: isDark ? "#f4f4f5" : "#0f172a",
                                    "&:hover": { bgcolor: isDark ? "#27272a" : "#e2e8f0" },
                                }}
                            >
                                <FormatItalicIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        {/* Underline */}
                        <Tooltip title="Garis Bawah (Underline)" arrow>
                            <IconButton
                                size="small"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    execWordCommand("underline");
                                }}
                                sx={{
                                    borderRadius: 1.5,
                                    color: isDark ? "#f4f4f5" : "#0f172a",
                                    "&:hover": { bgcolor: isDark ? "#27272a" : "#e2e8f0" },
                                }}
                            >
                                <FormatUnderlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        {/* Strikethrough */}
                        <Tooltip title="Coret (Strikethrough)" arrow>
                            <IconButton
                                size="small"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    execWordCommand("strikeThrough");
                                }}
                                sx={{
                                    borderRadius: 1.5,
                                    color: isDark ? "#f4f4f5" : "#0f172a",
                                    "&:hover": { bgcolor: isDark ? "#27272a" : "#e2e8f0" },
                                }}
                            >
                                <FormatStrikethroughIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Divider
                            orientation="vertical"
                            flexItem
                            sx={{ mx: 0.5, my: 0.5, borderColor: isDark ? "#27272a" : "#cbd5e1" }}
                        />

                        {/* Heading / Title */}
                        <Tooltip title="Judul Bagian (Heading)" arrow>
                            <IconButton
                                size="small"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleInsertHeading();
                                }}
                                sx={{
                                    borderRadius: 1.5,
                                    color: isDark ? "#f4f4f5" : "#0f172a",
                                    "&:hover": { bgcolor: isDark ? "#27272a" : "#e2e8f0" },
                                }}
                            >
                                <TitleIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        {/* Bulleted List */}
                        <Tooltip title="Daftar Poin (Bullet List)" arrow>
                            <IconButton
                                size="small"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    execWordCommand("insertUnorderedList");
                                }}
                                sx={{
                                    borderRadius: 1.5,
                                    color: isDark ? "#f4f4f5" : "#0f172a",
                                    "&:hover": { bgcolor: isDark ? "#27272a" : "#e2e8f0" },
                                }}
                            >
                                <FormatListBulletedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        {/* Numbered List */}
                        <Tooltip title="Daftar Nomor (Numbered List)" arrow>
                            <IconButton
                                size="small"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    execWordCommand("insertOrderedList");
                                }}
                                sx={{
                                    borderRadius: 1.5,
                                    color: isDark ? "#f4f4f5" : "#0f172a",
                                    "&:hover": { bgcolor: isDark ? "#27272a" : "#e2e8f0" },
                                }}
                            >
                                <FormatListNumberedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        {/* Quote */}
                        <Tooltip title="Kutipan / Catatan Penting" arrow>
                            <IconButton
                                size="small"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleInsertQuote();
                                }}
                                sx={{
                                    borderRadius: 1.5,
                                    color: isDark ? "#f4f4f5" : "#0f172a",
                                    "&:hover": { bgcolor: isDark ? "#27272a" : "#e2e8f0" },
                                }}
                            >
                                <FormatQuoteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        {/* Divider Line */}
                        <Tooltip title="Garis Pemisah (Horizontal Line)" arrow>
                            <IconButton
                                size="small"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    execWordCommand("insertHorizontalRule");
                                }}
                                sx={{
                                    borderRadius: 1.5,
                                    color: isDark ? "#f4f4f5" : "#0f172a",
                                    "&:hover": { bgcolor: isDark ? "#27272a" : "#e2e8f0" },
                                }}
                            >
                                <HorizontalRuleIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        {/* Link */}
                        <Tooltip title="Sisipkan Tautan Dokumen (Link)" arrow>
                            <IconButton
                                size="small"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleInsertLink();
                                }}
                                sx={{
                                    borderRadius: 1.5,
                                    color: isDark ? "#f4f4f5" : "#0f172a",
                                    "&:hover": { bgcolor: isDark ? "#27272a" : "#e2e8f0" },
                                }}
                            >
                                <InsertLinkIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        {/* Clear Format */}
                        <Tooltip title="Bersihkan Format Teks" arrow>
                            <IconButton
                                size="small"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleClearFormat();
                                }}
                                sx={{
                                    borderRadius: 1.5,
                                    color: isDark ? "#a1a1aa" : "#64748b",
                                    "&:hover": { bgcolor: isDark ? "#27272a" : "#e2e8f0" },
                                }}
                            >
                                <FormatClearIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>

                    {/* Right: Switch Mode Tab (Tulis vs Pratinjau) */}
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                        <Button
                            size="small"
                            variant={activeTab === "edit" ? "contained" : "text"}
                            onClick={() => setActiveTab("edit")}
                            startIcon={<EditIcon sx={{ fontSize: 14 }} />}
                            sx={{
                                textTransform: "none",
                                fontSize: "11px",
                                fontWeight: 700,
                                py: 0.4,
                                px: 1.2,
                                borderRadius: 1.5,
                                bgcolor: activeTab === "edit" ? "#2563eb" : "transparent",
                                color: activeTab === "edit" ? "#ffffff" : isDark ? "#a1a1aa" : "#64748b",
                            }}
                        >
                            Tulis
                        </Button>
                        <Button
                            size="small"
                            variant={activeTab === "preview" ? "contained" : "text"}
                            onClick={() => setActiveTab("preview")}
                            startIcon={<VisibilityIcon sx={{ fontSize: 14 }} />}
                            sx={{
                                textTransform: "none",
                                fontSize: "11px",
                                fontWeight: 700,
                                py: 0.4,
                                px: 1.2,
                                borderRadius: 1.5,
                                bgcolor: activeTab === "preview" ? "#2563eb" : "transparent",
                                color: activeTab === "preview" ? "#ffffff" : isDark ? "#a1a1aa" : "#64748b",
                            }}
                        >
                            Pratinjau
                        </Button>
                    </Stack>
                </Box>

                {/* Body Editor: WYSIWYG ContentEditable (Tulis) atau Pratinjau Bersih */}
                <Box sx={{ p: 2, minHeight: rows * 28, position: "relative" }}>
                    {activeTab === "edit" ? (
                        <Box
                            ref={editorRef}
                            contentEditable
                            onInput={handleInput}
                            data-placeholder={placeholder}
                            sx={{
                                minHeight: rows * 26,
                                outline: "none",
                                color: isDark ? "#f4f4f5" : "#0f172a",
                                fontSize: "14.5px",
                                lineHeight: "1.7",
                                wordBreak: "break-word",
                                "&:empty:before": {
                                    content: "attr(data-placeholder)",
                                    color: isDark ? "#52525b" : "#94a3b8",
                                    pointerEvents: "none",
                                    display: "block",
                                },
                                "& strong, & b": { fontWeight: 700 },
                                "& em, & i": { fontStyle: "italic" },
                                "& u": { textDecoration: "underline" },
                                "& del, & strike, & s": { textDecoration: "line-through" },
                                "& ul": { pl: 3, my: 1, listStyleType: "disc" },
                                "& ol": { pl: 3, my: 1, listStyleType: "decimal" },
                                "& li": { my: 0.5 },
                                "& h2, & h3": {
                                    fontWeight: 800,
                                    fontSize: "17px",
                                    my: 1,
                                    color: isDark ? "#93c5fd" : "#1e40af",
                                },
                                "& blockquote": {
                                    borderLeft: "3px solid #3b82f6",
                                    pl: 2,
                                    my: 1,
                                    py: 0.5,
                                    color: isDark ? "#93c5fd" : "#1d4ed8",
                                    bgcolor: isDark ? "rgba(59,130,246,0.1)" : "#eff6ff",
                                    borderRadius: "0 6px 6px 0",
                                    fontStyle: "italic",
                                },
                                "& a": {
                                    color: "#2563eb",
                                    textDecoration: "underline",
                                },
                                "& hr": {
                                    my: 1.5,
                                    borderColor: isDark ? "#27272a" : "#e2e8f0",
                                    borderStyle: "solid",
                                },
                            }}
                        />
                    ) : (
                        <Box
                            sx={{
                                minHeight: rows * 26,
                                maxHeight: 350,
                                overflowY: "auto",
                                color: isDark ? "#e4e4e7" : "#334155",
                                fontSize: "14.5px",
                                lineHeight: "1.7",
                                wordBreak: "break-word",
                                "& strong, & b": { fontWeight: 700 },
                                "& em, & i": { fontStyle: "italic" },
                                "& u": { textDecoration: "underline" },
                                "& del, & strike, & s": { textDecoration: "line-through" },
                                "& ul": { pl: 3, my: 1, listStyleType: "disc" },
                                "& ol": { pl: 3, my: 1, listStyleType: "decimal" },
                                "& li": { my: 0.5 },
                                "& h2, & h3": {
                                    fontWeight: 800,
                                    fontSize: "17px",
                                    my: 1,
                                    color: isDark ? "#93c5fd" : "#1e40af",
                                },
                                "& blockquote": {
                                    borderLeft: "3px solid #3b82f6",
                                    pl: 2,
                                    my: 1,
                                    py: 0.5,
                                    color: isDark ? "#93c5fd" : "#1d4ed8",
                                    bgcolor: isDark ? "rgba(59,130,246,0.1)" : "#eff6ff",
                                    borderRadius: "0 6px 6px 0",
                                    fontStyle: "italic",
                                },
                                "& a": {
                                    color: "#2563eb",
                                    textDecoration: "underline",
                                },
                            }}
                            dangerouslySetInnerHTML={{
                                __html:
                                    normalizeToHtml(value) ||
                                    '<span style="color:#94a3b8; font-style:italic;">Belum ada konten untuk ditampilkan pada pratinjau.</span>',
                            }}
                        />
                    )}
                </Box>

                {/* Footer Word Editor: Counter & Tips */}
                <Box
                    sx={{
                        px: 2,
                        py: 0.8,
                        bgcolor: isDark ? "#18181b" : "#f8fafc",
                        borderTop: isDark ? "1px solid #27272a" : "1px solid #f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 1,
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{ color: isDark ? "#71717a" : "#64748b", fontSize: "11px" }}
                    >
                        💡 <strong>Tips:</strong> Blok kata/teks lalu klik tombol toolbar untuk format <strong>tebal</strong>, <em>miring</em>, <u>garis bawah</u> secara langsung.
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                        <Chip
                            label={`${wordCount} kata`}
                            size="small"
                            sx={{
                                height: 20,
                                fontSize: "10px",
                                fontWeight: 700,
                                bgcolor: isDark ? "#27272a" : "#e2e8f0",
                                color: isDark ? "#cbd5e1" : "#475569",
                            }}
                        />
                        <Chip
                            label={`${charCount} karakter`}
                            size="small"
                            sx={{
                                height: 20,
                                fontSize: "10px",
                                fontWeight: 700,
                                bgcolor: isDark ? "#27272a" : "#e2e8f0",
                                color: isDark ? "#cbd5e1" : "#475569",
                            }}
                        />
                    </Stack>
                </Box>
            </Box>

            {/* Error / Helper text */}
            {helperText && (
                <Typography
                    variant="caption"
                    sx={{
                        color: error ? "#ef4444" : isDark ? "#a1a1aa" : "#64748b",
                        mt: 0.5,
                        ml: 1,
                        display: "block",
                        fontSize: "12px",
                    }}
                >
                    {helperText}
                </Typography>
            )}
        </Box>
    );
};

export default WordDescriptionEditor;
