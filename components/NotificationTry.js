import { useNotification, Button } from "@web3uikit/core";

export default function TryNotification() {
    const dispatch = useNotification();

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Somebody messaged you",
            title: "New Notification",
            position: "topR",
        });
    };

    return (
        <div>
            <Button
                text="Error"
                onClick={handleNewNotification}
                theme="colored"
                color="red"
                isFullWidth={true}
            />
        </div>
    );
}
