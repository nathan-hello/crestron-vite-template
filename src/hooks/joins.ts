import { useState, useEffect, useRef } from 'react';
import { CrComLib } from "@pepperdash/ch5-crcomlib-lite";


type TSignal = boolean | number | string;
type TSignalPublish<T extends TSignal> = (t: T) => void;
type TSignalCallback<T extends TSignal> = (t: T) => void;
type TJoinReturn<T extends TSignal> = [T, TSignalPublish<T>];

export function useJoinDigital(signalName: number): TJoinReturn<boolean> {
    const [state, setState] = useState<boolean>();
    useEffect(() => {
        const id = CrComLib.subscribeState("boolean", signalName.toString(), setState);
        return () => { CrComLib.unsubscribeState("boolean", signalName.toString(), id); };
    }, [signalName]);

    const publish = (v: boolean) => { CrComLib.publishEvent("boolean", signalName.toString(), v); };
    return [state, publish];
}
