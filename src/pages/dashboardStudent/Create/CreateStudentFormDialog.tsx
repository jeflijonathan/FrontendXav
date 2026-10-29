import { useState, type JSX } from "react";
import {
    Tabs,
    Tab,
    Box,
    Badge,
} from "@mui/material";
import { Person, People } from "@mui/icons-material";
import { useFormContext } from "react-hook-form";
import { DialogBody } from "@components/Dialog";
import TabDataSiswa from "./TabDataSiswa";
import TabDataOrangTua from "./TabDataOrangTua";

const tabContent: Record<number, () => JSX.Element> = {
    0: () => <TabDataSiswa />,
    1: () => <TabDataOrangTua />,
};

const CreateStudentFormDialog = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const {
        formState: { errors },
    } = useFormContext();

    const studentErrorCount = [
        errors.first_name,
        errors.last_name,
        errors.nis,
        errors.nisn,
        errors.password,
        errors.email,
        errors.gender,
        errors.phone_number,
        errors.role_ids,
    ].filter(Boolean).length;

    const parentErrorCount = [
        errors.parent_name,
        errors.parent_email,
        errors.mother_email,
    ].filter(Boolean).length;

    const renderTab = tabContent[currentTab];

    return (
        <DialogBody>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                <Tabs
                    value={currentTab}
                    onChange={(_, val) => setCurrentTab(val)}
                    textColor="primary"
                    indicatorColor="primary"
                >
                    <Tab
                        icon={<Badge color="error" badgeContent={studentErrorCount}><Person /></Badge>}
                        iconPosition="start"
                        label="Data Siswa"
                        sx={{ textTransform: "none", fontWeight: 600 }}
                    />
                    <Tab
                        icon={<Badge color="error" badgeContent={parentErrorCount}><People /></Badge>}
                        iconPosition="start"
                        label="Data Orang Tua"
                        sx={{ textTransform: "none", fontWeight: 600 }}
                    />
                </Tabs>
            </Box>

            {renderTab()}
        </DialogBody>
    );
};

export default CreateStudentFormDialog;
