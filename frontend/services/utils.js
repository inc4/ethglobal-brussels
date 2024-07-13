'use client';

export function checkEnvVar(varName) {
	const variable = process.env[varName];
	if (!variable) {
		throw new Error(`${varName} is not defined`);
	}
	return variable;
}
