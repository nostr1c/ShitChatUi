import { useEffect, useRef, useCallback  } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { pushMesage } from "../features/chat/chatSlice";

const SIGNALR_URL = "https://localhost:7061/chatHub";

const useSignalR = () => {
    const dispatch = useDispatch();
    const rooms = useSelector((state) => state.chat.rooms);
    const connectionRef = useRef(null);

    useEffect(() => {

        const connection = new HubConnectionBuilder()
            .withUrl(SIGNALR_URL)
            .withAutomaticReconnect()
            .build();

        connectionRef.current = connection;
        
        connection
            .start()
            .then(() => {
                console.log("Connected to SignalR");

                if (connection.state === "Connected" && rooms.length > 0) {
                    rooms.forEach((room) => {
                        connection.invoke("JoinGroup", room.id)
                            .then(() => console.log(`Joined group: ${room.id}`))
                            .catch(err => console.error("JoinGroup error:", err));
                    });
                }
            })
            .catch((error) => console.error("SignalR connection error:", error));

          // connection.on("ReceiveMessage", (message, room) => {
          //     console.log("New message received:", message);
          //     dispatch(pushMesage({ room: room, message }));
          // });

        connection.on("UserTyping", (userName, room) => {
            console.log("New typing received:", userName, room);
        });

        return () => {
            if (connectionRef.current) {

                rooms.forEach((room) => {
                    connection.invoke("LeaveGroup", room).catch(err => console.error("JoinGroup error:", err));
                });

                connectionRef.current.stop()
                    .then(() => console.log("SignalR connection stopped"))
                    .catch((err) => console.error("Error stopping SignalR connection:", err));
            }
        };
    }, [dispatch, rooms]);

    return connectionRef.current;
};

export default useSignalR;
