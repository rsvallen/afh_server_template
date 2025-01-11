import { print } from "../modules/utils.js";

export default (player: any, message: string) => {
	print(player.name, "said", message);
};
