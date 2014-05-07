# Orbino Docker image.
#
# VERSION 0.0.1
#
# VOLUME: docker run -v ~/src/orbino:/opt/orbino -name ORBINO_VOLUMES busybox true
# BUILD:  docker build -rm -t nunux/orbino .
# RUN:    docker run -rm -link mqtt:mqtt -volumes-from ORBINO_VOLUMES -i -t -p 3000:3000 nunux/orbino

FROM nunux/nodejs

MAINTAINER Nicolas Carlier <https://github.com/ncarlier>

# Env
ENV NODE_ENV development

# Server port
ENV APP_PORT 3000

# Server base URL (Realm)
ENV APP_REALM http://orbino.lan

# Application logger level
ENV APP_LOG debug

# Session secret key
ENV APP_SESSION_SECRET NuNUX0rbiN0_

EXPOSE 3000

USER node
ENV HOME /home/node

WORKDIR /opt/orbino

ENTRYPOINT ["/usr/bin/npm"]

CMD ["start"]
