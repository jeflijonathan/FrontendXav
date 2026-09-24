type ThemeType = {
    [key: string]: {
        [key: string]: any;
    };
};

const muiTheme: ThemeType = {
    dark: {
        primary: "#3b82f6",
        background: "#09090b",
        text: "#fafafa",
        divider: "#18181b",
        inputLabel: "#a1a1aa",
        select: "#a1a1aa",
        MuiMenuItem: "#27272a",
        paper: {
            backgroundColor: "#141416",
            border: "#18181b",
        }
    },
    light: {
        primary: "#2563eb",
        background: "#ffffff",
        text: "#09090b",
        divider: "#e4e4e7",
        inputLabel: "#71717a",
        select: "#71717a",
        menuItem: "#e4e4e7",
        paper: {
            backgroundColor: "#ffffff",
            border: "#e4e4e7",
        }
    }
};

muiTheme.darkMode = muiTheme.dark;
muiTheme.lightMode = muiTheme.light;
muiTheme.ligthMode = muiTheme.light;

export default muiTheme;