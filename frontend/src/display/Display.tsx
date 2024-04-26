import useWebSocket, { ReadyState } from 'react-use-websocket';
import './Display.css';
import './Neon.css'
import { WS_URL } from '../consts';
import { useEffect, useState } from 'react';
import { InitListener, ServerMessage } from '../eventlistener';
import { MilestoneControls } from '../admin/Admin';
import { useStoreActions, useStoreState } from '../hooks';

const Display = () => {    
    const { sendJsonMessage, readyState } = useWebSocket(WS_URL, {
        onOpen: () => {
          console.log('WebSocket connection established.');
        },
        share: true,
        filter: () => false,
        retryOnError: true,
        shouldReconnect: () => true
    });

    const [ready, setReady] = useState<boolean>(false);
    useEffect(() => setReady(readyState === ReadyState.OPEN), [readyState]);

    useEffect(() => {
        sendJsonMessage({type: 'reload', content: ""})
    }, [])

    const donations  = useStoreState((state) => state.donations);

    return (
        <>
            {
            ready ? 
                <>
                    <UpdateListener />
                    <InitListener />
                    <div className="entireDisplay">
                        <div className="title hero-block">
                            <h1 className="hero-title">
                                <span className="hero-title-text">Fish Slap Fundraiser</span>
                            </h1>
                        </div>
                        <div className="full">
                            <div className="display-bignumber">
                                <span id="donationAmt">${donations}</span>
                                <span> raised</span>
                            </div>
                            <MilestoneControls/>
                        </div> 
                    </div>
                </>
            :   <h3>Connecting...</h3>}
        </>
    )
}

const UpdateInfo = (message: MessageEvent<any>): boolean => {
    const evt = JSON.parse(message.data);
    return evt.type === "update";
}

/**
 * CLIENT ONLY EVENT LISTENER
 * @returns 
 */
export const UpdateListener = () => {
    const setDonations  = useStoreActions((actions) => actions.setDonation);
    const setMilestones = useStoreActions((actions) => actions.setMilestones);

    const { lastJsonMessage } = useWebSocket(WS_URL, {
        share: true,
        filter: UpdateInfo
    })

    useEffect(() => {
        if (lastJsonMessage) {
            const { donations, milestones } = (lastJsonMessage as ServerMessage).content;
            setDonations(donations);
            setMilestones(milestones);
            console.log("Succesfully updated data")
        }
    }, [lastJsonMessage]);

    return (<></>);
}

export default Display;