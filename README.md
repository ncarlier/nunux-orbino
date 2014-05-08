# NUNUX Orbino

Nunux Orbino is a simple node.js app that controls an RGB LED over the network.
The RGB LED is drived by an Arduino board with the Ethernet shield.
Communication between the app and the Arduino module is done over the network thanks to MQTT.

## Schematics

See the following breadboard sample:

![Breadboard](/arduino/schematics/orbino_bb.png?raw=true "Breadboard")

## Installation guide
### Prerequisites

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) ~v0.10.0
* [Mosquitto](http://mosquitto.org/)

#### Install Git, Node.JS and Mosquitto (on Debian)

    sudo aptitude install git nodejs mosquitto

#### Install Grunt

    sudo npm install -g grunt-cli

### Install Orbino web app

    mkdir -p /opt/node/orbino && cd $_
    git clone git@github.com:ncarlier/nunux-orbino.git
    cd orbino
    npm install
    npm start

----------------------------------------------------------------------

NUNUX Orbino

Copyright (c) 2014 Nicolas CARLIER (https://github.com/ncarlier)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

----------------------------------------------------------------------
