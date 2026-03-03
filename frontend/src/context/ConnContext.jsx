import { createContext, useContext, useState, useEffect } from "react";

const ConnContext = createContext(null);

export function ConnProvider({ children }) {
  const [conn, setConn] = useState("4g");
  const [pendingSync, setPendingSync] = useState(0);

  useEffect(() => {
    const update = () => {
      if (!navigator.onLine) { setConn("offline"); return; }
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        setConn(["slow-2g","2g"].includes(connection.effectiveType) ? "2g" : "4g");
      } else {
        setConn("4g");
      }
    };

    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) connection.addEventListener("change", update);

    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
      if (connection) connection.removeEventListener("change", update);
    };
  }, []);

  return (
    <ConnContext.Provider value={{ conn, pendingSync, setPendingSync }}>
      {children}
    </ConnContext.Provider>
  );
}

export function useConn() {
  const ctx = useContext(ConnContext);
  if (!ctx) throw new Error("useConn must be used inside <ConnProvider>");
  return ctx;
}