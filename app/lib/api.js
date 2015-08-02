'use strict';

import { EventEmitter }   from 'events';
import { Domain }         from 'domain';
import fs                 from 'fs';
import path               from 'path';
import os                 from 'os';
import SocketIO           from 'socket.io';
import PS                 from './ps';

class SocketAPI extends EventEmitter {

  constructor (server) {
    try {
      process.nextTick(() => {
        super();

        this.server     =   server;
        this.processes  =   [];
        this.sockets    =   [];

        this.io = SocketIO.listen(this.server.server)
          .on('connection', this.connected.bind(this));

        this.totalMem = os.totalmem();

        this
          .fetch()
          .then(
            processes => {
              this.processes = processes;
              this.broadcast('ps', processes);
              this.poll();
            },
            error => this.emit('error', error)
          );
      });
    }
    catch ( error ) {
      this.emit('error', error);
    }
  }

  // Broadcast to clients

  broadcast (event, ...messages) {
    this.sockets.forEach(socket => socket.emit(event, ...messages));
  }

  // Fetch complete list of processes

  fetch () {
    return PS.get();
  }

  // Check if /proc has changed

  poll () {
    this.poller = setInterval(
      () => {
        console.log('polling');

        // free mem
        this.sockets.forEach(socket => socket.emit('free mem', os.freemem()));

        this.fetch().then(
          processes => {
            // let newProcesses = processes.filter(ps => ! this.processes
            //   .some(_ps => _ps.pid === ps.pid));
            //
            // console.log('new processes', newProcesses);
            this.broadcast('ps', processes);
          },
          error => this.emit('error', error)
        );
      },
      2500);
  }

  connected (socket) {
    this.sockets.push(socket);

    this.emit('message', 'new socket client');

    socket.on('disconnected', () => {
      this.sockets = this.sockets.filter(_socket => _socket.id !== socket.id );
    });

    socket.emit('self', process.pid);

    socket.emit('total mem', this.totalMem);
  }

}

export default SocketAPI;
