import { useState , useMemo} from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import "./App.css";
import { useJoinDigital } from "./hooks/joins";
import { CrComLib } from "@pepperdash/ch5-crcomlib-lite";

import useWebXPanel from "./hooks/device";

(window as any)["bridgeReceiveIntegerFromNative"] = CrComLib.bridgeReceiveIntegerFromNative;
(window as any)["bridgeReceiveBooleanFromNative"] = CrComLib.bridgeReceiveBooleanFromNative;
(window as any)["bridgeReceiveStringFromNative"] =  CrComLib.bridgeReceiveStringFromNative;
(window as any)["bridgeReceiveObjectFromNative"] =  CrComLib.bridgeReceiveObjectFromNative;

const PushButton: React.FC<{join: number;}> = (props) => {
  const [j, setJ] = useJoinDigital(props.join)
  const onPress = () => { setJ(true); };
  const onRelease = () => { setJ(false); };
  return ( <> <button onMouseDown={onPress} onMouseUp={onRelease} onTouchStart={onPress} onTouchEnd={onRelease} onTouchCancel={onRelease} >Test</button> <p style={{ margin: "auto" }}>full obj: {JSON.stringify(j)}</p> </>);
};

function App() {
  const [count, setCount] = useState(0);

    const webXPanelConfig = useMemo(() => ({

    ipId: '0x03',
    host: "10.1.10.10",
    roomId: '',
    authToken: ''
  }), []); // Dependencies array is empty, so this object is created only once

  const [active, msg] = useWebXPanel(webXPanelConfig);


  return (
    <div>
      <script src="/cr-com-lib.js"></script>

      { JSON.stringify(active) }
      <br/>
      { msg }
      <PushButton join={22} />
      <a href="https://vitejs.dev" target="_blank">
        <img src={viteLogo} className="logo" alt="Vite logo" />
      </a>
      <a href="https://react.dev" target="_blank">
        <img src={reactLogo} className="logo react" alt="React logo" />
      </a>
      <h1>Vite + React</h1>
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
      <footer>currently at: {window.location.href}</footer>
    </div>
  );
}

export default App;
