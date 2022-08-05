import { useMoralis } from "react-moralis";
import { useEffect } from "react";

const ManualHeader = () => {
    //Some button that connects us and changes connected to be truth
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } =
        useMoralis();

    //Will basically constantly check the values in the dependency array [] and if anything changes, will call some function () => {} and re-render the frontend
    useEffect(() => {
        if (isWeb3Enabled) return;
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("Connected")) {
                enableWeb3();
            }
        }
    }, [isWeb3Enabled]);

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`);
            if (account == null) {
                window.localStorage.removeItem("Connected");
                deactivateWeb3(); //Sets isWeb3Enabled to false
                console.log("Null account found");
            }
        });
    }, []);

    return (
        <div>
            {account ? (
                <div>
                    Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}
                </div>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3();

                        if (typeof window !== "undefined") {
                            window.localStorage.setItem("Connected", "Injected");
                        }
                    }}
                    disabled={isWeb3EnableLoading}
                >
                    Connect
                </button>
            )}
        </div>
    );
};

export default ManualHeader;
