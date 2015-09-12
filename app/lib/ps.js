'use strict';

import fs from 'fs';

class PS {

  static parseStatus (status) {
    let lines = status.split(/\n/);

    let parsed = {};

    for ( let line of lines ) {
      line.replace(/^([\w_]+):(.+)$/i, (matches, key, value) => {
        value = value.trim();
        parsed[key] = value;
      });
    }

    return parsed;
  }

  static readStream (file) {
    return new Promise((ok, ko) => {
      fs
        .createReadStream(file)

        .on('data', function (data) {
          if ( ! this.data ) {
            this.data = '';
          }
          this.data += data.toString();
        })

        .on('error', ko)

        .on('end', function () {
          ok(this.data);
        });
    });
  }

  static parse (pid) {
    return new Promise((ok, ko) => {
      try {
        Promise
          .all([
            // Status
            new Promise((ok, ko) => {
              PS
                .readStream('/proc/' + pid + '/status')
                .then(
                  data => ok(PS.parseStatus(data)),
                  error => {
                    if ( error.code === 'ENOENT' ) {
                      ok(false);
                    }
                    else {
                      ko();
                    }
                  }
                );
            }),

            // cmdline
            new Promise((ok, ko) => {
              PS
                .readStream('/proc/' + pid + '/cmdline')
                .then(
                  data => ok(data),
                  error => {
                    if ( error.code === 'ENOENT' ) {
                      ok(false);
                    }
                    else {
                      ko();
                    }
                  }
                );
            }),

            // Stat
            new Promise((ok, ko) => {
              PS
                .readStream('/proc/' + pid + '/stat')
                .then(
                  data => ok(data),
                  error => {
                    if ( error.code === 'ENOENT' ) {
                      ok(false);
                    }
                    else {
                      ko();
                    }
                  }
                );
            })
          ])
          .then(
            results => {
              let [ status, cmd, stat ] = results;

              if ( results.some(result => result === false) ) {
                return ok(false);
              }

              cmd = cmd || status.Name;

              let mem = status.VmSize;

              let state = status.State.split(/ \(/)[0];

              ok({ pid: +pid, status, cmd, stat, mem, state });
            },
            ko
          );
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  static get () {

    return new Promise((ok, ko) => {
      fs.readdir('/proc', (error, files) => {
        if ( error ) {
          return ko(error);
        }

        let processes = files
          .filter(file => /^\d+$/.test(file));

        let promises = processes.map(pid => PS.parse(pid));

        Promise
          .all(promises)
          .then(
            ps => {
              ps = ps
                .filter(ps => ps)
                .map(ps => {
                  ps.cmd = ps.cmdline || ps.status.Name;
                  return ps;
                });
              ok(ps);
            },
            ko
          );
      });
    });

  }

  static getCPUTime () {
    return new Promise((ok, ko) => {
      PS
        .readStream('/proc/stat')
        .then(
          data => {
            try {
              let lines = data.split(/\n/);

              let summary = lines.shift();
              let summaryBits = summary.split(/\s+/);
              summaryBits.shift();

              let [
                  user,
                  nice,
                  system,
                  idle,
                  iowait,
                  irq,
                  softirq,
                  steal,
                  guest,
                  guest_nice
                ] = summaryBits.map(bit => +bit);

              let
                idleTime      =   idle + iowait,
                nonIdleTime   =   user + nice + system + irq + softirq + steal,
                totalTime     =   idleTime + nonIdleTime;

              ok({ idleTime, nonIdleTime, totalTime });
            }
            catch ( error ) {
              ko(error);
            }
          },
          ko
        );
    });
  }

}

export default PS;
