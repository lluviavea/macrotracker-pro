setup:
    mise trust
    mise install
    npm install

run:
    npx next dev

build:
    npx next build

start:
    npx next start

lint:
    npx eslint .
