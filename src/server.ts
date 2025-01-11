import nodeHaxball from "node-haxball";
import { RoomInfo, Storage } from "./settings/room_settings.js";
import onPlayerJoin from "./events/onPlayerJoin.js";
import onRoomLink from "./events/onRoomLink.js";
import onPlayerChat from "./events/onPlayerChat.js";
const hax = nodeHaxball();

hax.Room.create(RoomInfo, {
	onOpen: (room) => {
		room.onPlayerJoin = onPlayerJoin;
		room.onRoomLink = onRoomLink;

		room.onPlayerChat = onPlayerChat;
	},
});
