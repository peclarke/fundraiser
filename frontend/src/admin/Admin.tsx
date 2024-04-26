import './Admin.css';
import useWebSocket, { ReadyState } from "react-use-websocket";

import { useStoreState, useStoreActions } from '../hooks';
import { Button, Chip, List, ListItem, ListItemText, ListSubheader, Paper, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Milestone } from '../state';
import { WS_URL } from '../consts';
import { SendJsonMessage } from 'react-use-websocket/dist/lib/types';
import EventListener from '../eventlistener';

type ComponentProps = {
    send: SendJsonMessage;
}

const Admin = () => {
    const donations = useStoreState((state) => state.donations)
    
    const { sendJsonMessage, readyState } = useWebSocket(WS_URL, {
        onOpen: () => {
          console.log('WebSocket connection established.');
        },
        share: true,
        filter: () => false,
        retryOnError: true,
        shouldReconnect: () => true
    });

    const [adminPriv, setAdminPriv] = useState<boolean>(false);
    const connectToServer = () => {
        console.log("Attempting to establish admin permissions");
        sendJsonMessage({type: "admin", content: ""});
        setAdminPriv(true);
    }

    const [ready, setReady] = useState<boolean>(false);
    useEffect(() => setReady(readyState === ReadyState.OPEN), [readyState]);

    return (
        <>
            {ready ? 
            <><div className="donations row">
                <div className="bignumber">
                    <span>${donations}</span>
                </div>
                {adminPriv ? <MilestoneControls send={sendJsonMessage}/> : null}
            </div>
            <EventListener />
            {adminPriv ? <AddControls send={sendJsonMessage}/> : null}
            {!adminPriv ? <button onClick={connectToServer}>Connect</button> : null}</> :

            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
            }}>
                <h2>Server is not online</h2>
                <p>Please check you have the correct services running</p>
            </div>
            
            }
        </>
    )
}

const MilestoneControls = ({send}: ComponentProps) => {
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
                            <ListItem key={ms.goal+"-milestone"} style={{backgroundColor: achieved, paddingLeft: "5vw", paddingRight: "5vw"}}>
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

const AddControls = ({send}: ComponentProps) => {
    const [amt, setAmt] = useState<number>(0);
    const [amt2, setAmt2] = useState<number>(0);

    const addDonation = useStoreActions((action) => action.addDonation)
    const setDonation = useStoreActions((action) => action.setDonation);
    const milestones = useStoreState((state) => state.milestones);
    const submitDonation = () => {
        addDonation(amt)
        setAmt(0);
        // update server with good news
        send({type: "update", content: {donations: amt, milestones}})

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