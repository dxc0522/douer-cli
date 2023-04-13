#! /usr/bin/env node
import ora from "ora";
import chalk from "chalk";
import logSymbols from "log-symbols";
import child_process from 'child_process'

export default function (remote, branch, name,) {
  const cloneSpinner = ora('正在拉取项目…').start();
  return new Promise((resolve, reject) => {
    console.log(remote,branch,name)
    const g = child_process.spawn('git', ['clone', '-b', branch, remote, name])
    g.on('close', (data) => {
      cloneSpinner.succeed(chalk.green('拉取成功'))
      resolve();
    });
    g.on('error', (data) => {
      cloneSpinner.fail();
      console.log(logSymbols.error, chalk.red(data));
      reject()
    });
  })
}