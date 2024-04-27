import { Modal, Paper, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import FlagIcon from '@mui/icons-material/Flag';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import InfoIcon from '@mui/icons-material/Info';
import { useState } from "react";
import Milestones from "./Milestones";
import Themes from "./Themes";
import About from "./About";
import './Settings.css';

interface SettingsProps {
    open: boolean;
    handleClose: () => void;
}

const Settings = ({open, handleClose}: SettingsProps) => {
    const [selectedIndex, setSelectedIndex] = useState(1);

    const handleListItemClick = (
      _event: React.MouseEvent<HTMLDivElement, MouseEvent>,
      index: number,
    ) => {
      setSelectedIndex(index);
    };

    const tabs = [<Milestones />, <Themes />, <About />]

    return (
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
            <Paper className="paper-settings" elevation={3}>
                <div>
                    <List component="nav" aria-label="main mailbox folders">
                        <ListItemButton
                            selected={selectedIndex === 0}
                            onClick={(event) => handleListItemClick(event, 0)}
                        >
                            <ListItemIcon>
                                <FlagIcon />
                            </ListItemIcon>
                            <ListItemText primary="Milestones" />
                        </ListItemButton>
                        <ListItemButton
                            selected={selectedIndex === 1}
                            onClick={(event) => handleListItemClick(event, 1)}
                        >
                            <ListItemIcon>
                                <ColorLensIcon />
                            </ListItemIcon>
                            <ListItemText primary="Themes"/>
                        </ListItemButton>
                        <ListItemButton
                            selected={selectedIndex === 2}
                            onClick={(event) => handleListItemClick(event, 2)}
                        >
                            <ListItemIcon>
                                <InfoIcon />
                            </ListItemIcon>
                            <ListItemText primary="About"/>
                        </ListItemButton>
                    </List>
                </div>
                <div>
                    {
                        tabs[selectedIndex]
                    }
                </div>
            </Paper>
        </Modal>
    )
}

export default Settings;