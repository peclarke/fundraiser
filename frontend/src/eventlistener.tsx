import useWebSocket from "react-use-websocket"
import { WS_URL } from "./consts"
import { useEffect } from "react";
import { useStoreActions } from "./hooks";

const UpdateInfo = (message: MessageEvent<any>): boolean => {
    const evt = JSON.parse(message.data);
    return evt.type === "update";
}

const EventListener = () => {
    const setDonations  = useStoreActions((actions) => actions.setDonation);
    const setMilestones = useStoreActions((actions) => actions.setMilestones);

    const { lastJsonMessage } = useWebSocket(WS_URL, {
        share: true,
        filter: UpdateInfo
    })

    useEffect(() => {
        console.log(lastJsonMessage)
        if (lastJsonMessage) {
            console.log(lastJsonMessage);
            // const { p1, p2 } = lastJsonMessage.content;
            // setNames([p1, p2]);
        }
    }, [lastJsonMessage]);

    return (<></>);
}

export default EventListener;