# Orbino

## Installation guide
### Prerequisites

* [git](http://git-scm.com/)
* [nodejs](http://nodejs.org/) v0.6.6
* [mosquitto](http://mosquitto.org/)

#### Install Git (on Debian)

        aptitude install git

#### Install Node.JS

See following installation procedure : [https://github.com/joyent/node/wiki/Installation](https://github.com/joyent/node/wiki/Installation)

### Install Web Site

        cd ~/local/opt
        git clone git@bitbucket.org:ncarlier/orbino.git
        cd orbino
        make

### Run (without CloudFoundry)

        #!/bin/sh
        # Optional ENV (default: development)
        export NODE_ENV=production
        # Optional PORT (default: 8081)
        export APP_PORT=8081

        node app.js 2>&1 >> orbino.log

### Deploy on CloudFoundry

        #!/bin/sh
        vmc env-add orbino NODE_ENV=production
        make deploy
