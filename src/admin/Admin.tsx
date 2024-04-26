import './Admin.css';

import { useStoreState, useStoreActions } from '../hooks';
import { Button, Chip, Paper, TextField } from '@mui/material';
import { useState } from 'react';

const Admin = () => {
    const donations = useStoreState((state) => state.donations)

    return (
        <>
        <div className="donations row">
            {donations}
        </div>

        <div className="all-controls">
            <AddControls />
            <MilestoneControls />
        </div>
        </>
    )
}

const MilestoneControls = () => {
    return (
        <div className="controls row">
            <Paper elevation={3} className="paper-controls">

            </Paper>
        </div>
    )
}

const AddControls = () => {
    const [amt, setAmt] = useState<number>(0);
    const addDonation = useStoreActions((action) => action.addDonation)
    const submitDonation = () => {
        addDonation(amt)
        setAmt(0);
    }

    const handleClick = (newDonation: number) => setAmt(amt+newDonation)

    return (
            <div className="controls row">
                <Paper elevation={3} className="paper-controls">
                    <span>Add Donation Amount</span>
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
                </Paper>
            </div>
    )
}

export default Admin