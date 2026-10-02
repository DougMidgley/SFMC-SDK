import { assert } from 'chai';
import process from 'node:process';
import {
    npmExecutable,
    PREPARE_RELEASE_SCRIPTS,
    runNpmScript,
    runPrepareRelease,
} from '../scripts/prepare-release.mjs';

describe('prepare-release orchestrator', function () {
    it('uses a platform-appropriate npm launcher', function () {
        assert.equal(npmExecutable('linux'), 'npm');
        assert.equal(npmExecutable('win32'), process.env.ComSpec ?? 'cmd.exe');
    });

    it('executes a harmless npm child script', async function () {
        assert.equal(await runNpmScript('test:prepare-release-child'), 0);
    });

    it('runs every task in fixed order', async function () {
        const calls = [];
        const exitCode = await runPrepareRelease(PREPARE_RELEASE_SCRIPTS, async (script) => {
            calls.push(script);
            return 0;
        });

        assert.deepEqual(calls, PREPARE_RELEASE_SCRIPTS);
        assert.equal(exitCode, 0);
    });

    it('continues after failures and returns an aggregate failure', async function () {
        const calls = [];
        const exitCode = await runPrepareRelease(PREPARE_RELEASE_SCRIPTS, async (script) => {
            calls.push(script);
            return script === 'lint-ts-prep' ? 2 : 0;
        });

        assert.deepEqual(calls, PREPARE_RELEASE_SCRIPTS);
        assert.equal(exitCode, 1);
    });
});
