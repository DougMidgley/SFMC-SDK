import { assert } from 'chai';
import { ESLint } from 'eslint';

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
    it('disables removal of JSDoc asterisk prefixes in the effective config', async function () {
        const eslint = new ESLint();
        const config = await eslint.calculateConfigForFile('lib/documentation-fixture.js');

        assert.equal(config.rules[documentationRule][0], 0);
    });

    it('preserves starred multiline JSDoc during autofix', async function () {
        const eslint = new ESLint({ fix: true });
        const [result] = await eslint.lintText(documentedSource, {
            filePath: 'lib/documentation-fixture.js',
        });

        assert.equal(result.errorCount, 0);
        assert.equal(result.warningCount, 0);
        assert.equal(result.output ?? documentedSource, documentedSource);
    });
});
