'use strict';

import { EventEmitter }   from 'events';
import { Domain }         from 'domain';
import fs                 from 'fs';
import path               from 'path';
import os                 from 'os';
import SocketIO           from 'socket.io';
import colors             from 'colors';
import PS                 from './ps';

class SocketAPI extends EventEmitter {

  constructor (server) {
    try {
      console.log('Welcome to PS|JS :)'.blue);

      process.nextTick(() => {
        super();

        this.server     =   server;
        this.processes  =   [];
        this.sockets    =   [];
        this.CPU        =   {};

        this.io = SocketIO.listen(this.server.server)
          .on('connection', this.connected.bind(this));

        this.totalMem = os.totalmem();

        console.log('Getting processes, CPU'.grey);

        Promise
          .all([
            PS.get(),
            PS.getCPUTime()
          ])
          .then(
            results => {
              try {
                let [ processes, cpu ] = results;

                console.log(`Got ${processes.length} processes`.green);

                this.processes = processes;
                this.broadcast('ps', processes);

                this.cpu = cpu;

                setTimeout(this.poll.bind(this), 2500);
              }
              catch ( error ) {
                this.emit('error', error);
              }
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
    console.log('Polling'.cyan);

    Promise
      .all([
        PS.get(),
        PS.getCPUTime()
      ])
      .then(
        results => {
          try {
            // free mem
            this.sockets.forEach(socket => socket.emit('free mem', os.freemem()));

            let [ processes, cpu ] = results;

            this.processes = processes;
            console.log(`Got ${processes.length} processes`.green);
            this.broadcast('ps', processes);

            let time = cpu.totalTime - this.cpu.totalTime;
            let idle = cpu.idleTime - this.cpu.idleTime;

            let load = ( ( time - idle ) / time );

            console.log('comparing', cpu, this.cpu, { load });

            this.cpu = cpu;

            this.cpu.load = load;

            console.log('load average', (os.loadavg()[0] / 8 * 100) + load);

            this.broadcast('cpu load', (os.loadavg()[0] / 8 * 100) + load);

            setTimeout(this.poll.bind(this), 2500);
          }
          catch ( error ) {
            this.emit('error', error);
          }
        },
        error => this.emit('error', error)
      );
  }

  connected (socket) {
    try {
      this.sockets.push(socket);

      this.emit('message', 'new socket client');

      socket.on('disconnected', () => {
        this.sockets = this.sockets.filter(_socket => _socket.id !== socket.id );
      });

      socket.emit('self', process.pid);

      socket.emit('total mem', this.totalMem);
    }
    catch ( error ) {
      this.server.emit('error', error);
    }

    // socket.emit('')
  }

}

export default SocketAPI;
