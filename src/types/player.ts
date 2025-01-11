export type Player = {
	id: number;
	name: string;
	team: number;
	admin: boolean;
	position: { x: number; y: number };
	auth: string;
	conn: string;
};
