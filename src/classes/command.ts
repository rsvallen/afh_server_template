type Argument = {
	name: string;
	type: "string" | "number" | "boolean";
	required: boolean;
};

type Command = {
	name: string;
	description: string;
	syntax: string;
	execute: (args: Record<string, any>) => void;
};

class CommandSystem {
	private commands: Map<string, Command>;

	constructor() {
		this.commands = new Map();
	}

	/**
	 * Registers a new command with the system.
	 * @param command The command to register.
	 */
	registerCommand(command: Command) {
		const parsedArgs = this.parseSyntax(command.syntax);
		command["parsedArguments"] = parsedArgs; // Attach parsed args for execution validation.
		this.commands.set(command.name, command);
	}

	/**
	 * Parses the syntax string into argument definitions.
	 * @param syntax The syntax string (e.g., "<name> <age> [hobby]").
	 * @returns Parsed argument definitions.
	 */
	private parseSyntax(syntax: string): Argument[] {
		const args = syntax.match(/<[^>]+>|\[[^\]]+\]/g) || [];
		return args.map((arg: string) => {
			const required = arg.startsWith("<") && arg.endsWith(">");
			const name = arg.substring(1, arg.length - 1); // Remove angle brackets
			return {
				name,
				type: "string" as const,
				required,
			};
		});
	}

	/**
	 * Executes a command based on user input.
	 * @param input The raw user input string.
	 */
	executeCommand(input: string) {
		const [name, ...rawArgs] = input.split(" ");
		const command = this.commands.get(name);

		if (!command) {
			console.error(`Error: Command '${name}' not found.`);
			return;
		}

		const parsedArgs = this.parseArguments(command, rawArgs);
		if (!parsedArgs.valid) {
			console.error(`Error: ${parsedArgs.error}`);
			return;
		}

		// Execute the command with the parsed arguments.
		command.execute(parsedArgs.args);
	}

	/**
	 * Parses and validates arguments based on the command's syntax.
	 * @param command The command to validate arguments for.
	 * @param rawArgs The raw arguments provided by the user.
	 * @returns An object indicating validity, arguments, and any errors.
	 */
	private parseArguments(
		command: Command,
		rawArgs: string[]
	): { valid: boolean; args: Record<string, any>; error?: string } {
		const parsedArguments = command["parsedArguments"] || [];
		const args: Record<string, any> = {};

		for (let i = 0; i < parsedArguments.length; i++) {
			const { name, required } = parsedArguments[i];
			const value = rawArgs[i];

			if (!value && required) {
				return {
					valid: false,
					args,
					error: `Missing required argument: <${name}>`,
				};
			}

			if (value) {
				args[name] = value; // Optionally, add type parsing here
			}
		}

		return { valid: true, args };
	}

	/**
	 * Lists all registered commands.
	 */
	listCommands() {
		this.commands.forEach((cmd) => {
			console.log(`${cmd.name}: ${cmd.description}`);
			console.log(`  Syntax: ${cmd.syntax}`);
		});
	}
}

// Example Usage
const commandSystem = new CommandSystem();

commandSystem.registerCommand({
	name: "greet",
	description: "Greets a user.",
	syntax: "<name> [times]",
	execute: (args) => {
		const times = parseInt(args.times, 10) || 1;
		for (let i = 0; i < times; i++) {
			console.log(`Hello, ${args.name}!`);
		}
	},
});

commandSystem.registerCommand({
	name: "add",
	description: "Adds two numbers.",
	syntax: "<num1> <num2>",
	execute: (args) => {
		const num1 = parseFloat(args.num1);
		const num2 = parseFloat(args.num2);
		if (isNaN(num1) || isNaN(num2)) {
			console.error("Error: Arguments must be numbers.");
			return;
		}
		console.log(`Result: ${num1 + num2}`);
	},
});

// Simulating user input
commandSystem.executeCommand("greet Alice 3");
commandSystem.executeCommand("add 5 10");
commandSystem.executeCommand("greet"); // Error: Missing required argument: <name>
