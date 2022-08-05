import { ConnectWallet } from "@web3uikit/web3";

export default function Header() {
    return (
        <div className="p-5 border-b-2 border-orange-300 flex flew-grow">
            <h1 className="py-4 px-4 font-blog text-3xl">Decentralized Lottery</h1>
            <div className="ml-auto py-2 px-4">
                <ConnectWallet moralisAut={false} />
            </div>
        </div>
    );
}
