import { spawn } from 'node:child_process';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

export const PREPARE_RELEASE_SCRIPTS = [
    'prepare-release:audit-fix',
    'lint-ts-prep',
    'lint:fix',
    'prepare-release:git',
];

/**
 * Returns the npm command used by the release runner.
 *
 * @returns {string} Executable name.
 */
export function npmExecutable(platform = process.platform) {
    return platform === 'win32' ? (process.env.ComSpec ?? 'cmd.exe') : 'npm';
}

/**
 * Runs one npm script and resolves with its exit code.
 *
 * @param {string} script npm script name.
 * @returns {Promise<number>} Child process exit code.
 */
export function runNpmScript(script) {
    return new Promise((resolve, reject) => {
        const isWindows = process.platform === 'win32';
        const arguments_ = isWindows ? ['/d', '/s', '/c', `npm run ${script}`] : ['run', script];
        const child = spawn(npmExecutable(), arguments_, {
            stdio: 'inherit',
            shell: false,
        });
        child.once('error', reject);
        child.once('exit', (code) => resolve(code ?? 1));
    });
}

/**
 * Runs release preparation scripts in order and reports an aggregate failure.
 *
 * @param {string[]} [scripts] Ordered npm script names.
 * @param {(script: string) => Promise<number>} [runner] Script runner.
 * @returns {Promise<number>} Zero when every script succeeds, otherwise one.
 */
export async function runPrepareRelease(scripts = PREPARE_RELEASE_SCRIPTS, runner = runNpmScript) {
    let failed = false;
    for (const script of scripts) {
        const exitCode = await runner(script);
        failed ||= exitCode !== 0;
    }
    return failed ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    process.exitCode = await runPrepareRelease();
}
