const Nightmare = require('nightmare');
const jsonfile = require('jsonfile')
const moment = require('moment');
require('dotenv').config();

let show = true;

let report;

let $devInfoTbl;
let $ProcTbl;
let $eventTbl;

const ts = moment().format('YY-MM-DD HH:mm');
const file = `./${ts}.json`;

const start = (cb) => {
  console.log("\n\x1b[41m\x1b[37m", `🚫 COMCAST SUCKS v. 1 for TP-Link TC-7620 🚫`, "\x1b[0m\n");
  cb();
}

const getDeviceInfo = () => {
  const nightmare = Nightmare({ show: show });

  nightmare
    .goto(`http://${process.env.IP}`)
    .wait('#login-btn')
    .type('#userName', process.env.USERNAME)
    .type('#pcPassword', process.env.PASSWORD)
    .click('#login-btn')
    .wait('table#devInfoTbl')
    .evaluate(() => {
      return $('table#devInfoTbl').html();
    })
    .end()
    .then(data => {
      $devInfoTbl = data;
      console.log("\x1b[47m\x1b[34m", ` SAVE `, "\x1b[0m", "Basic Information saved");
      getAdvancedInfo();
    })
    .catch(err => {
      closeNote('error', err);
    });
}

const getAdvancedInfo = () => {
  const nightmare = Nightmare({ show: show });

  nightmare
    .goto(`http://${process.env.IP}`)
    .wait('#login-btn')
    .type('#userName', process.env.USERNAME)
    .type('#pcPassword', process.env.PASSWORD)
    .click('#login-btn')
    .wait(3000)
    .click('#advanced')
    .wait('table#ProcTbl')
    .evaluate(() => {
      return $('table#ProcTbl').html();
    })
    .end()
    .then(data => {
      $ProcTbl = data;
      console.log("\x1b[47m\x1b[34m", ` SAVE `, "\x1b[0m", "Advanced Information saved");
      getLog();
    })
    .catch(err => {
      closeNote('error', err);
    });
}

const getLog = () => {
  const nightmare = Nightmare({ show: show });

  nightmare
    .goto(`http://${process.env.IP}`)
    .wait('#login-btn')
    .type('#userName', process.env.USERNAME)
    .type('#pcPassword', process.env.PASSWORD)
    .click('#login-btn')
    .wait(3000)
    .click('#advanced')
    .wait(8000)
    .click('li.ml2:nth-child(3)')
    .wait('table#eventTbl')
    .evaluate(() => {
      return $('table#eventTbl').html();
    })
    .end()
    .then(data => {
      $eventTbl = data;
      console.log("\x1b[47m\x1b[34m", ` SAVE `, "\x1b[0m", "Log saved");
      fileReport();
    })
    .catch(err => {
      closeNote('error', err);
    });
}

const fileReport = () => {
  console.log("\x1b[47m\x1b[34m", ` ACT  `, "\x1b[0m", "Compiling data");
  
  report = {
    "basic": $devInfoTbl,
    "advanced": $ProcTbl,
    "log": $eventTbl
  }

  jsonfile.writeFile(file, report)
    .then(() => {
      console.log("\x1b[47m\x1b[32m", ` DATA `, "\x1b[0m", "Data saved");
      closeNote('success');
    })
    .catch(err => {
      console.error("\x1b[47m\x1b[31m", ` ERR  `, "\x1b[0m", "Data save error");
      closeNote('error', err);
    });
}

const closeNote = (status, err) => {
  if(status === 'success') {
    console.log("\n\x1b[42m\x1b[37m", `   SUCCESS   `, "\x1b[0m\n");
  } else if(status === 'error') {
    console.log("\n\x1b[45m\x1b[37m", `    ERROR    `, "\x1b[0m\n");
    console.error(err);
  }
}

start(getDeviceInfo);