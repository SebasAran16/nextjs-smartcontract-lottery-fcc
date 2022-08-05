import { useWeb3Contract, useMoralis } from "react-moralis";
import { abi, contractAddresses } from "../constants"; //index represents the whole folder
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification, Button } from "@web3uikit/core";
import { WalletModal } from "@web3uikit/web3";

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis(); //Gives us the hex edition of our chainId
    const chainId = parseInt(chainIdHex); //Now we are getting the normal chainId
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;
    const [entranceFee, setEntranceFee] = useState("0");
    const [numberOfPlayers, setNumberOfPlayers] = useState("x");
    const [recentWinner, setRecentWinner] = useState("x");

    const dispatch = useNotification();

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    });

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    });

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    });

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    });

    async function updateUI() {
        const entranceFeeFromCall = await getEntranceFee();
        const numberOfPlayers = await getNumberOfPlayers();
        const recentWinner = await getRecentWinner();
        setEntranceFee(entranceFeeFromCall);
        setNumberOfPlayers(numberOfPlayers);
        if (recentWinner == 0x0000000000000000000000000000000000000000) {
            setRecentWinner("No winners yet");
        } else {
            setRecentWinner(recentWinner);
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            //Try to read the raffle entrance fee
            updateUI();
        }
    }, [isWeb3Enabled]);

    const handleSuccess = async function (tx) {
        await tx.wait(1);
        handleNewNotification(tx);
        updateUI();
    };

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Tx Notification",
            position: "topR",
        });
    };

    return (
        <div className="p-5">
            Hi from Lottery Entrance!
            {raffleAddress ? (
                <div>
                    <Button
                        text="Enter Raffle"
                        onClick={async function () {
                            await enterRaffle({
                                onSuccess: handleSuccess, //onSuccess checks if a transaction was succesfully sent to Metamask
                                onError: (error) => console.log(error),
                            });
                        }}
                        theme="colored"
                        color="green"
                        isFullWidth={false}
                        disabled={isLoading || isFetching}
                    />
                    <div>Entrance Fee is: {ethers.utils.formatUnits(entranceFee)} ETH </div>
                    {"     "}
                    <div> Current number of players: {numberOfPlayers.toString()} </div>
                    {"     "}
                    <div> Last Winner: {recentWinner.toString()} </div>
                </div>
            ) : (
                <div>No Raffle Address detected!</div>
            )}
        </div>
    );
}
