# blagjs
An script runner to help automated web navigation and information gathering


## Environment Setup
This is a mono repo using lerna

#### install basic tools
```bash
npm i -g npm-quick-run lerna
```

### cli
```bash
npm i -g @blag/cli
blag stack-path action # executes the scripts for the given action and launch the url

blag stack-path # would list all the actions avilable in the stack
```

# TODO
- [ ] Create Build and Publish Pipline using github actions
- [ ] Support compressed stack's
- [ ] A way to debug and run stacks before complying
- [ ] Puppeteer Server
- [ ] Integrate with https://snyk.io
