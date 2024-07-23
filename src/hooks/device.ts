import { useState, useEffect } from 'react';
import { getWebXPanel, runsInContainerApp } from "@crestron/ch5-webxpanel";

type WebXPanelConfig = {
    host: string;
    ipId: string;
    roomId?: string;
    authToken?: string;
};

const useWebXPanel = (params: WebXPanelConfig) => {
    const [isActive, setIsActive] = useState(false);
    const [msg, setMsg] = useState("98724353");

    useEffect(() => {
        const { WebXPanel, isActive, WebXPanelEvents, WebXPanelConfigParams } = getWebXPanel(true);

        setIsActive(isActive);

        const config: Partial<typeof WebXPanelConfigParams> = params;
        WebXPanelConfigParams.port = 49200;
        WebXPanelConfigParams.tokenUrl = `https://${params.host}/cws/websocket/getWebSocketToken`;


        if (isActive) {
            setMsg("Initializing XPanel with config: " + JSON.stringify(config));
            WebXPanel.initialize(config);

            const connectWsListener = () => { setMsg("WebXPanel websocket connection success"); };
            const errorWsListener = ({ detail }: any) => { setMsg(`WebXPanel websocket connection error: ${JSON.stringify(detail)}`); };
            const connectCipListener = () => { setMsg("WebXPanel CIP connection success"); };
            const authenticationFailedListener = ({ detail }: any) => { setMsg(`WebXPanel authentication failed: ${JSON.stringify(detail)}`); };
            const notAuthorizedListener = ({ detail }: any) => { setMsg(`WebXPanel not authorized: ${JSON.stringify(detail)}`); window.location = detail.redirectTo; };
            const disconnectWsListener = (detail: any) => { setMsg(`WebXPanel websocket connection lost: ${JSON.stringify(detail)}`); };
            const disconnectCipListener = ({ detail }: any) => { setMsg(`WebXPanel CIP connection lost: ${JSON.stringify(detail)}`); };

            window.addEventListener(WebXPanelEvents.CONNECT_WS, connectWsListener);
            window.addEventListener(WebXPanelEvents.ERROR_WS, errorWsListener);
            window.addEventListener(WebXPanelEvents.CONNECT_CIP, connectCipListener);
            window.addEventListener(WebXPanelEvents.AUTHENTICATION_FAILED, authenticationFailedListener);
            window.addEventListener(WebXPanelEvents.NOT_AUTHORIZED, notAuthorizedListener);
            window.addEventListener(WebXPanelEvents.DISCONNECT_WS, disconnectWsListener);
            window.addEventListener(WebXPanelEvents.DISCONNECT_CIP, disconnectCipListener);

            // Cleanup function
            return () => {
                window.removeEventListener(WebXPanelEvents.CONNECT_WS, connectWsListener);
                window.removeEventListener(WebXPanelEvents.ERROR_WS, errorWsListener);
                window.removeEventListener(WebXPanelEvents.CONNECT_CIP, connectCipListener);
                window.removeEventListener(WebXPanelEvents.AUTHENTICATION_FAILED, authenticationFailedListener);
                window.removeEventListener(WebXPanelEvents.NOT_AUTHORIZED, notAuthorizedListener);
                window.removeEventListener(WebXPanelEvents.DISCONNECT_WS, disconnectWsListener);
                window.removeEventListener(WebXPanelEvents.DISCONNECT_CIP, disconnectCipListener);
            };
        }
    }, [params]);

    return [isActive, msg];
};

export default useWebXPanel;