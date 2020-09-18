![deploy](https://github.com/Danushka96/openchat/workflows/deploy/badge.svg?branch=master)

# TubeMate

Chat with random strangers

## Demo
[http://openchat.ml/](http://openchat.ml/)

![](https://i.imgur.com/TdRDHhW.png)

![](https://i.imgur.com/7GrnaGa.png)

## How to setup

### Requirements
* [node 10.x](https://nodejs.org/dist/latest-v10.x/)

### Installation

1. Clone the project
3. `npm install`
5. `node server.js`

### Install with Docker

* `docker pull docker.pkg.github.com/danushka96/openchat/openchat:latest`
* `docker run --name tubemate -p 3000:3000 docker.pkg.github.com/danushka96/openchat/openchat:latest`
