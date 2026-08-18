import { Alert, Snackbar, Slide } from "@mui/material";
import type { SlideProps } from "@mui/material";
import useNotificationStore from "../../store/useNotificationStore";

function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction="up" />;
}

const NotificationStack = () => {
    const { notifications, removeNotification } = useNotificationStore();

    return (
        <>
            {notifications.map((notification, index) => (
                <Snackbar
                    key={notification.id}
                    open={true}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    onClose={() => removeNotification(notification.id)}
                    slots={{ transition: SlideTransition }}
                    sx={{ bottom: `${(index * 64) + 24}px !important` }}
                >
                    <Alert
                        onClose={() => removeNotification(notification.id)}
                        severity={notification.type}
                        variant="filled"
                        sx={{
                            width: "100%",
                            borderRadius: "10px",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                            fontWeight: 500,
                        }}
                    >
                        {notification.message}
                    </Alert>
                </Snackbar>
            ))}
        </>
    );
};

export default NotificationStack;
