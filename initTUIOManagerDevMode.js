const exec = require('child_process').exec;

const puts = function (error, stdout, stderr) {
  if (error) {
    console.error(error);
  }
}

exec('npm link', puts);
