import chalk from "chalk";

export function logSuccess(message: string) {
    console.log(chalk.green("[*]"), message);
}

export function logInfo(message: string) {
    console.log(chalk.blue("[*]"), message);
}

export function logError(message: string) {
    console.error(chalk.red("[!]"), message);
}
