import Enum from "../modules/enum.js";
import { print } from "../modules/utils.js";
import { Player } from "../types/player.js";

export default (player) => {
	print("hello,", player.conn);
};
