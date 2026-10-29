import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import InfoIcon from '@mui/icons-material/Info';
import { ErrorOutlineOutlined } from '@mui/icons-material';

type IconProps = {
    nameIcon: string;
    width?: number;
    height?: number;
    className?: string;
};

const Icon = ({ nameIcon, width = 16, height = 16, className = "" }: IconProps) => {
    const listIcon: Record<string, React.ReactNode> = {
        "icon-mui-sort-by-time": <AccessTimeIcon sx={{ width, height }} className={className} />,
        "icon-mui-search": <SearchIcon sx={{ width, height }} className={className} />,
        "icon-mui-menu": <MenuIcon sx={{ width, height }} className={className} />,
        "icon-mui-close": <CloseIcon sx={{ width, height }} className={className} />,
        "icon-mui-arrow-forward": <ArrowForwardIcon sx={{ width, height }} className={className} />,
        "icon-mui-arrow-back": <ArrowBackIcon sx={{ width, height }} className={className} />,
        "icon-mui-arrow-down": <KeyboardArrowDownIcon sx={{ width, height }} className={className} />,
        "icon-mui-arrow-up": <KeyboardArrowUpIcon sx={{ width, height }} className={className} />,
        "icon-mui-person": <PersonIcon sx={{ width, height }} className={className} />,
        "icon-mui-settings": <SettingsIcon sx={{ width, height }} className={className} />,
        "icon-mui-home": <HomeIcon sx={{ width, height }} className={className} />,
        "icon-mui-delete": <DeleteIcon sx={{ width, height }} className={className} />,
        "icon-mui-edit": <EditIcon sx={{ width, height }} className={className} />,
        "icon-mui-add": <AddIcon sx={{ width, height }} className={className} />,
        "icon-mui-check": <CheckIcon sx={{ width, height }} className={className} />,
        "icon-mui-error": <ErrorOutlineOutlined sx={{ width, height }} className={className} />,
        "icon-mui-info": <InfoIcon sx={{ width, height }} className={className} />,
    };

    const icon = listIcon[nameIcon];
    if (!icon) return null;

    return <>{icon}</>;
};

export default Icon;