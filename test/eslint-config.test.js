import { assert } from 'chai';
import { ESLint } from 'eslint';
import { readFile } from 'node:fs/promises';

const documentationRule = 'unicorn/no-asterisk-prefix-in-documentation-comments';
const documentedSource = `/**
 * Return the supplied value.
 *
 * @param {string} value - Value to return.
 * @returns {string} The supplied value.
 */
export function echo(value) {
    return value;
}
`;

describe('ESLint documentation formatting', function () {
    it('disables only the approved protocol and fallback rules in the effective config', async function () {
        const eslint = new ESLint();
        const config = await eslint.calculateConfigForFile('lib/soap.js');
        for (const rule of [
            'unicorn/prefer-literal-ascii',
            'unicorn/prefer-https',
            'unicorn/prefer-default-parameters',
        ]) {
            assert.equal(config.rules[rule][0], 0, rule);
        }
        assert.equal(config.rules['unicorn/no-null'][0], 2);
    }).timeout(10_000);

    it('preserves SOAP protocol source and falsy concurrency fallback during autofix', async function () {
        const eslint = new ESLint({ fix: true });
        for (const filePath of ['lib/soap.js', 'test/resources/soap.js', 'lib/rest.js']) {
            const source = await readFile(filePath, 'utf8');
            const [result] = await eslint.lintText(source, { filePath });
            assert.equal(result.errorCount, 0, filePath);
            assert.equal(result.warningCount, 0, filePath);
            assert.equal(result.output ?? source, source, filePath);
        }
    }).timeout(10_000);

    it('disables removal of JSDoc asterisk prefixes in the effective config', async function () {
        const eslint = new ESLint();
        const config = await eslint.calculateConfigForFile('lib/documentation-fixture.js');

        assert.equal(config.rules[documentationRule][0], 0);
    }).timeout(10_000);

    it('preserves starred multiline JSDoc during autofix', async function () {
        const eslint = new ESLint({ fix: true });
        const [result] = await eslint.lintText(documentedSource, {
            filePath: 'lib/documentation-fixture.js',
        });

        assert.equal(result.errorCount, 0);
        assert.equal(result.warningCount, 0);
        assert.equal(result.output ?? documentedSource, documentedSource);
    }).timeout(10_000);
});
