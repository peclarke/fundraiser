import useWebSocket from "react-use-websocket"
import { WS_URL } from "./consts"
import { useEffect } from "react";
import { useStoreActions } from "./hooks";

export type ServerMessage = {
    type: string;
    content: any;
}

const InitMsg = (message: MessageEvent<any>): boolean => {
    const evt = JSON.parse(message.data);
    return evt.type === "init";
}

export const InitListener = () => {
    const setDonations  = useStoreActions((actions) => actions.setDonation);
    const setMilestones = useStoreActions((actions) => actions.setMilestones);

    const { lastJsonMessage } = useWebSocket(WS_URL, {
        share: true,
        filter: InitMsg
    })

    useEffect(() => {
        if (lastJsonMessage) {
            const { donations, milestones } = (lastJsonMessage as ServerMessage).content;
            setDonations(donations);
            setMilestones(milestones);
            console.log("Successfully updated data")
        }
    }, [lastJsonMessage]);

    return (<></>);
}