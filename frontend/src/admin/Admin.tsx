import './Admin.css';

import { useStoreState, useStoreActions } from '../hooks';
import { Button, Chip, List, ListItem, ListItemText, ListSubheader, Paper, TextField } from '@mui/material';
import { useState } from 'react';
import { Milestone } from '../state';

const Admin = () => {
    const donations = useStoreState((state) => state.donations)

    return (
        <>
        <div className="donations row">
            <div className="bignumber">
                <span>${donations}</span>
            </div>
            <MilestoneControls />
        </div>
        <AddControls />
        </>
    )
}

const MilestoneControls = () => {
    const milestones = useStoreState((state) => state.milestones);
    const donations = useStoreState((state) => state.donations);
    return (
        <div className="controls row">
            <Paper elevation={3} className="milestones">
                {/* <span>Donation Milestones</span> */}
                <ListSubheader>Donation Milestones</ListSubheader>
                <List>
                {
                    milestones.map((ms: Milestone) => {
                        const achieved = donations >= ms.goal ? 'lightgreen' : 'none';
                        return (
                            <ListItem style={{backgroundColor: achieved, paddingLeft: "5vw", paddingRight: "5vw"}}>
                                <ListItemText
                                    primary={ms.desc}
                                    secondary={"$"+ms.goal+" goal"}
                                />
                            </ListItem>
                        )
                    })
                }
                </List>
            </Paper>
        </div>
    )
}

const AddControls = () => {
    const [amt, setAmt] = useState<number>(0);
    const [amt2, setAmt2] = useState<number>(0);

    const addDonation = useStoreActions((action) => action.addDonation)
    const setDonation = useStoreActions((action) => action.setDonation);
    const submitDonation = () => {
        addDonation(amt)
        setAmt(0);
    }

    const handleClick = (newDonation: number) => setAmt(amt+newDonation)

    return (
            <div className="controls row">
                <Paper elevation={3} className="paper-controls">
                    <span>Donation Amounts</span>
                    <div className="inputs">
                        <TextField id="outlined-basic"
                            value={amt} 
                            label="Add Donation Amount" 
                            variant="outlined" 
                            type="number"
                            onChange={(e) => setAmt(parseInt(e.target.value))}
                        />
                        <Button variant="contained" onClick={submitDonation}>Confirm Add</Button>
                    </div>
                    <div className="chips">
                        <Chip label="Add $1" variant="outlined" onClick={() => handleClick(1)} />
                        <Chip label="Add $3" variant="outlined" onClick={() => handleClick(3)} />
                        <Chip label="Add $5" variant="outlined" onClick={() => handleClick(5)} />
                        <Chip label="Add $10" variant="outlined" onClick={() => handleClick(10)} />
                    </div>
                    
                    <div style={{paddingTop: "4vh", display: 'flex', gap: '10px', borderTop: '1px solid silver'}}>
                        <TextField id="outlined-basic"
                            value={amt2} 
                            label="Manual Setting" 
                            variant="outlined" 
                            type="number"
                            onChange={(e) => setAmt2(parseInt(e.target.value))}
                        />
                        <Button 
                            variant="contained" 
                            onClick={() => setDonation(amt2)}
                            color="error"
                        >Replace</Button>
                    </div>
                </Paper>
            </div>
    )
}

export default Admin