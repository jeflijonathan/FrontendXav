import { DashboardHeader } from "@components/Headers"
import { Box } from "@mui/material"
import DashboardSchenduleTable from "./List/DashboardSchendulesTable"

const DashboardSchendule = () => {
    return (
        <Box>
            <DashboardHeader title="Jadwal Pelajaran" description="Berikut adalah jadwal pelajaran" />
            <DashboardSchenduleTable />
        </Box>
    )
}

export default DashboardSchendule