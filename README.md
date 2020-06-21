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

## Execution Contexts

Blow are the list of methods which are to be avilable in all execution contexts

#### nav()
- `URL` <[Object|String]>
  - `a`
- `consumer`

#### request()
- `URL`

#### prompt()
- `model`

#### completed() consumed() exit()

### Puppeteer Chrome
Available list of context functions can be found at [exenv-puppeteer](./packages/exenv-puppeteer/README.md)

# TODO
- [ ] Create Build and Publish Pipline using github actions
- [ ] Support compressed stack's
- [ ] Support merged execution context
- [ ] Prompt Interface
- [ ] Navigation Tracing (generate a report in which we can see all the request for each page and how the navagation happned)
- [ ] A way to debug and run stacks before complying
- [ ] Puppeteer Server
- [ ] Integrate with https://snyk.io
