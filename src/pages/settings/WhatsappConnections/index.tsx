import { useEffect, useRef, useState } from "react";
import { Button, CircularProgress, TextField } from "@mui/material";
import { API } from "../../../api";

interface WhatsAppStatus {
    is_connected: boolean;
    user?: {
        name: string;
        phone: string;
        jid: string;
    } | null;
    qr_code?: string | null;
}

const SendMessageForm = () => {
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [result, setResult] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleSend = async () => {
        if (!phone || !message) return;
        setSending(true);
        setResult(null);
        try {
            const api = new API();
            await api.POST("/whatsapp/send", { to_phone: phone, message });
            setResult({ type: "success", text: "Pesan berhasil dikirim!" });
            setMessage("");
        } catch (err: any) {
            setResult({ type: "error", text: err.message || "Gagal mengirim pesan" });
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-3">
            <TextField
                label="Nomor WhatsApp"
                placeholder="Contoh: 628123456789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                fullWidth
                size="small"
                helperText="Masukkan nomor tanpa + (contoh: 628123456789)"
            />
            <TextField
                label="Pesan"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                fullWidth
                size="small"
                multiline
                rows={3}
            />
            {result && (
                <p className={`text-sm ${result.type === "success" ? "text-green-600" : "text-red-500"}`}>
                    {result.text}
                </p>
            )}
            <Button
                variant="contained"
                color="primary"
                onClick={handleSend}
                disabled={sending || !phone || !message}
                startIcon={sending ? <CircularProgress size={16} color="inherit" /> : null}
            >
                {sending ? "Mengirim..." : "Kirim Pesan"}
            </Button>
        </div>
    );
};

const WhatsappConnections = () => {
    const [status, setStatus] = useState<WhatsAppStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchStatus = async () => {
        try {
            const api = new API();
            const res = await api.GET<any>("/whatsapp/status");

            // Backend wraps in { status, data }
            const finalData: WhatsAppStatus = res?.data ?? res;
            if (finalData) {
                setStatus(finalData);
                setError(null);
            }
        } catch (err: any) {
            setError(err.message || "Failed to fetch WhatsApp status");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();

        const scheduleNext = () => {
            // Poll cepat saat belum konek/nunggu QR, lambat saat sudah konek
            const delay = status?.is_connected ? 30000 : 3000;
            return setTimeout(async () => {
                await fetchStatus();
                intervalRef.current = scheduleNext();
            }, delay);
        };

        intervalRef.current = scheduleNext();
        return () => {
            if (intervalRef.current) clearTimeout(intervalRef.current);
        };
    }, [status?.is_connected]);

    const renderContent = () => {
        if (loading && !status && !error) {
            return (
                <div className="flex justify-center items-center h-64">
                    <CircularProgress />
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center text-red-500 p-4">
                    <p>{error}</p>
                    <Button variant="outlined" onClick={fetchStatus} sx={{ mt: 2 }}>Retry</Button>
                </div>
            );
        }

        if (status?.is_connected) {
            return (
                <div className="space-y-4">
                    {/* Status Badge */}
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shrink-0"></div>
                        <div>
                            <p className="text-green-600 font-semibold text-sm">WhatsApp Connected</p>
                            {status.user && (
                                <p className="text-secondary-txt text-sm mt-0.5">
                                    Logged in as <span className="font-medium text-primary-txt">{status.user.name}</span>
                                    {" "}·{" "}<span className="text-secondary-txt/70">+{status.user.phone}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Send Message Form */}
                    <div className="bg-theme-secondary/40 border border-light-dark rounded-xl p-6">
                        <h3 className="text-base font-semibold text-primary-txt mb-4">Kirim Pesan WhatsApp</h3>
                        <SendMessageForm />
                    </div>

                    <p className="text-xs text-secondary-txt/50 text-center">
                        WhatsApp Web tidak dapat ditampilkan di dalam dashboard karena kebijakan keamanan dari WhatsApp.
                        Gunakan form di atas untuk mengirim pesan.
                    </p>
                </div>
            );
        }

        return (
            <div className="bg-theme-secondary/40 border border-light-dark rounded-xl p-8 text-center flex flex-col items-center justify-center space-y-6">
                {status?.qr_code ? (
                    <>
                        <h3 className="text-xl font-semibold text-primary-txt">Scan QR Code</h3>
                        <p className="text-secondary-txt max-w-md">
                            Buka WhatsApp di HP Anda, lalu scan barcode berikut untuk terhubung.
                        </p>
                        <div className="bg-white p-4 rounded-xl shadow-sm inline-block">
                            <img
                                src={`data:image/png;base64,${status.qr_code}`}
                                alt="WhatsApp QR Code"
                                className="w-64 h-64 object-contain"
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <CircularProgress size={48} thickness={4} />
                        <h3 className="text-lg font-medium text-primary-txt mt-4">Generating QR Code...</h3>
                        <p className="text-secondary-txt max-w-md">
                            Tunggu sebentar, QR Code sedang disiapkan.
                        </p>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="p-4 md:p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-primary-txt">WhatsApp Connections</h1>
                {status?.is_connected && (
                    <Button variant="outlined" color="error" onClick={async () => {
                        try {
                            const api = new API();
                            await api.POST("/whatsapp/logout");
                            fetchStatus();
                        } catch (e) {
                            console.error(e);
                        }
                    }}>
                        Logout
                    </Button>
                )}
            </div>

            {renderContent()}
        </div>
    );
};

export default WhatsappConnections;
