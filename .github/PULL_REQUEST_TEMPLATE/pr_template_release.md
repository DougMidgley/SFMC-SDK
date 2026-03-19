# Release details

## Checklist

### Before merge

- [ ] Wiki updated with info in ticket listed under **Documentation**
- [ ] ran `npm run prepare-release` (which runs `npm audit fix`, `npm run lint-ts`, `npm run lint:fix`, `git add`, `git commit`)
- [ ] ran `npm run version:major/minor/patch`
- [ ] pushed potential changes made by prepare-release and version-change commit

### After merge

- [ ] merged all dependabot PRs that target main branch
- [ ] merged main branch into develop branch
- [ ] closed GitHub milestone
- [ ] created [new GitHub Release](https://github.com/Accenture/sfmc-devtools/releases/new)

## Documentation

... insert updated documentation here ...

## Issues

- closes #1234567
