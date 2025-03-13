import { Room } from "@/types/type";
import { useState } from "react";

export const useRoom = (initialRoom : Room) => {
    const [room , setRoom] = useState<Room>(initialRoom);
    return { room , setRoom };
}