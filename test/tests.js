module.exports = [
	{
		name: "Parse bundles",
		input: "-hvn2",
		config: {noAliasPropagation: "first-only"},
		optdef: {
			"-h, --help, --usage":    "",
			"-v, --version":          "",
			"-n, --number-of-lines":  "<number=\\d+>"
		},
		expected: {
			options: {help: true, version: true, numberOfLines: "2"},
			argv: []
		}
	},
	
	
	{
		name: "Correctly parse %j",
		input: [
			"-l 2 --set-size 640 480 -s alpha beta gamma",
			"foo -l 2 bar --set-size 640 480 760 -s alpha beta gamma"
		],
		config: {noAliasPropagation: "first-only"},
		optdef: {
			"-l, --level":            "<level>",
			"-t, --type":             "<type>",
			"-z, --set-size":         "[width=\\d+] [height=\\d+]",
			"-c, --set-config":       "<numbers=\\d+> <letters=[A-Za-z]+>",
			"-d, --delete-files":     "<safely> <files...>",
			"-s, -T, --set-type":     "<key> <type>"
		},
		expected: [{
			options: {level: "2", setSize: ["640", "480"], setType: ["alpha", "beta"]},
			argv: ["gamma"]
		}, {
			options: {level: "2", setSize: ["640", "480"], setType: ["alpha", "beta"]},
			argv: ["foo", "bar", "760", "gamma"]
		}]
	},
	
	
	
	{
		name: "Duplicate-option handling: use-first",
		input: "--arg 1 alpha --arg 2 beta --arg 3 gamma --arg 4 delta",
		config: {
			noAliasPropagation: "first-only",
			multipleOptions: "use-first"
		},
		optdef: {"-a, --arg": "<numbers=\\d+>"},
		expected: {
			options: {arg: "1"},
			argv: ["alpha", "beta", "gamma", "delta"]
		}
	},
	
	{
		name: "Duplicate-option handling: use-last",
		input: "--arg 1 alpha --arg 2 beta --arg 3 gamma --arg 4 delta",
		config: {
			noAliasPropagation: "first-only",
			multipleOptions: "use-last"
		},
		optdef: {"-a, --arg": "<numbers=\\d+>"},
		expected: {
			options: {arg: "4"},
			argv: ["alpha", "beta", "gamma", "delta"]
		}
	},
	
	{
		name: "Duplicate-option handling: limit-first",
		input: "--arg 1 alpha --arg 2 beta --arg 3 gamma --arg 4 delta",
		config: {
			noAliasPropagation: "first-only",
			multipleOptions: "limit-first"
		},
		optdef: {"-a, --arg": "<numbers=\\d+>"},
		expected: {
			options: {arg: "1"},
			argv: ["alpha", "--arg", "2", "beta", "--arg", "3", "gamma", "--arg", "4", "delta"]
		}
	},
	
	{
		name: "Duplicate-option handling: limit-last",
		input: "alpha --set-size 640 480 beta --set-size 800 600 gamma --set-size 1024 768",
		config: {
			noAliasPropagation: "first-only",
			multipleOptions: "limit-last"
		},
		optdef: {"-s, --set-size": "<width=\\d+> <height=\\d+>"},
		expected: {
			options: {setSize: ["1024", "768"]},
			argv: ["alpha", "--set-size", "640", "480", "beta", "--set-size", "800", "600", "gamma"]
		}
	},
	
	{
		name: "Duplicate-option handling: error",
		input: "--arg 1 alpha --arg 2",
		config: {
			noAliasPropagation: "first-only",
			multipleOptions: "error"
		},
		optdef: {"-a, --arg": "<numbers=\\d+>"},
		expected: {
			error: "Attempting to reassign option"
		}
	},
	
	{
		name: "Duplicate-option handling: append",
		input: "--set-size 640 480 alpha --set-size 1024 768 beta",
		config: {
			noAliasPropagation: "first-only",
			multipleOptions: "append"
		},
		optdef: {"-s, --set-size": "<width=\\d+> <height=\\d+>"},
		expected: {
			options: {setSize: ["640", "480", "1024", "768"]},
			argv: ["alpha", "beta"]
		}
	},
	
	{
		name: "Duplicate-option handling: stack",
		input: "--set-size 640 480 alpha --set-size 1024 768 beta",
		config: {
			noAliasPropagation: "first-only",
			multipleOptions: "stack"
		},
		optdef: {"-s, --set-size": "<width=\\d+> <height=\\d+>"},
		expected: {
			options: {setSize: [["640", "480"], ["1024", "768"]]},
			argv: ["alpha", "beta"]
		}
	},
	
	{
		name: "Duplicate-option handling: stack-values",
		input: "--set-size 640 480 alpha --set-size 1024 768 beta",
		config: {
			noAliasPropagation: "first-only",
			multipleOptions: "stack-values"
		},
		optdef: {"-s, --set-size": "<width=\\d+> <height=\\d+>"},
		expected: {
			options: {setSize: [["640", "1024"], ["480", "768"]]},
			argv: ["alpha", "beta"]
		}
	},
	
	{
		name: "Duplicate-option handling: stack-values (Irregular parameter count)",
		input: "--set-size 640 --set-size 1024 768 alpha",
		config: {
			noAliasPropagation: "first-only",
			multipleOptions: "stack-values"
		},
		optdef: {"-s, --set-size": "<width=\\d+> <height=\\d+>"},
		expected: {
			options: {setSize: [["640", "1024"], [, "768"]]},
			argv: ["alpha"]
		}
	}
];