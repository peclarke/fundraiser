import './Admin.css';
import useWebSocket, { ReadyState } from "react-use-websocket";

import { useStoreState, useStoreActions } from '../hooks';
import { Button, Chip, Fab, List, ListItem, ListItemText, ListSubheader, Paper, TextField } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useEffect, useState } from 'react';
import { Milestone } from '../state';
import { WS_URL } from '../consts';
import { SendJsonMessage } from 'react-use-websocket/dist/lib/types';
import { InitListener } from '../eventlistener';
import Settings from './settings/Settings';

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

    const [settings, setSettings] = useState<boolean>(false);

    return (
        <>
            {ready ? 
            <>
            <Settings open={settings} handleClose={() => setSettings(false)}/>
            {adminPriv && <Fab color="primary" aria-label="add" id="settings-fab" onClick={() => setSettings(true)}>
                <SettingsIcon />
            </Fab>}
            <div className="donations row">
                <div className="bignumber">
                    <span>${donations.toString().substring(0,5)}</span>
                </div>
                {adminPriv ? <MilestoneControls source={"admin"}/> : null}
            </div>
            <InitListener />
            {adminPriv && <AddControls send={sendJsonMessage}/>}
            {!adminPriv ? <button style={{fontSize: "40px"}} onClick={connectToServer}>Connect to server</button> : null}</> :

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

export const MilestoneControls = ({source}: {source: "disp" | "admin"}) => {
    const milestones = useStoreState((state) => state.milestones);
    const donations = useStoreState((state) => state.donations);
    return (
        <div className="controls-milestone row">
            <Paper elevation={3} className={"milestones "+source+"-ms"}>
                <ListSubheader>Donation Milestones</ListSubheader>
                <List>
                {
                    milestones.map((ms: Milestone) => {
                        const achieved = donations >= ms.goal ? 'lightgreen' : 'none';
                        return (
                            <ListItem key={ms.goal+"-milestone"} style={{backgroundColor: achieved, paddingLeft: "5vw", paddingRight: "10vw"}}>
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

    const donations = useStoreState((state) => state.donations);
    const addDonation = useStoreActions((action) => action.addDonation)
    const setDonation = useStoreActions((action) => action.setDonation);
    const milestones = useStoreState((state) => state.milestones);

    const submitDonation = () => {
        addDonation(round(amt, 2))
        // update server with good news
        // console.log({donations: donations, milestones})
        send({type: "update", content: {donations: round(donations+amt, 2), milestones}});
        setAmt(0);

    }

    const handleSet = () => {
        send({type: "update", content: {donations: round(amt2, 2), milestones}});
        setDonation(amt2);
    }

    const handleClick = (newDonation: number) => {
        // setAmt("hello");
        console.log(amt2);

        setAmt((amt)+newDonation)
    }

    return (
        <>
            <div className="controls row">
                <Paper elevation={3} className="paper-controls">
                    <span>Donation Amounts</span>
                    <div className="inputs">
                        <TextField id="outlined-basic"
                            value={amt}
                            label="Add Donation Amount" 
                            variant="outlined" 
                            type="number"
                            onChange={(e) => setAmt(parseFloat(e.target.value))}
                        />
                        <Button variant="contained" onClick={submitDonation}>Confirm Add</Button>
                    </div>
                    <div className="chips">
                        <Chip label="Add $0.5" variant="outlined" onClick={() => handleClick(0.5)} />
                        <Chip label="Add $1" variant="outlined" onClick={() => handleClick(1)} />
                        <Chip label="Add $3" variant="outlined" onClick={() => handleClick(3)} />
                        <Chip label="Add $5" variant="outlined" onClick={() => handleClick(5)} />
                    </div>
                    
                    <div style={{paddingTop: "4vh", display: 'flex', gap: '10px', borderTop: '1px solid silver'}}>
                        <TextField id="outlined-basic"
                            value={amt2} 
                            label="Manual Setting" 
                            variant="outlined" 
                            type="number"
                            onChange={(e) => setAmt2(parseFloat(e.target.value))}
                        />
                        <Button 
                            variant="contained" 
                            onClick={handleSet}
                            color="error"
                        >Replace</Button>
                    </div>
                </Paper>
            </div>
        </>
    )
}

export const round = (num: number, _precision: number) => { 
    
    const multiplier = Math.pow(10, 2 || 0);
    return (Math.round(num * multiplier) / multiplier);
};

export default Admin