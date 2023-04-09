#! /usr/bin/env node
import inquirer from 'inquirer'
import child_process from 'child_process'
import ora from "ora";
import chalk from "chalk";
import logSymbols from "log-symbols";
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const JSONData = require('../package.json')

const versionConfig = {
    "版本迭代": 'major',
    "版本迭代预发布": 'premajor',
    "功能变更": 'minor',
    "功能变更预发布": 'preminor',
    "细节变化": 'patch',
    "细节变化预发布": 'prepatch',
    "当前版本预发布": 'prerelease'
}
const choices = Object.keys(versionConfig)
async function deploy() {
    console.log(choices)
    const question = [{ // 选择模版类别
        type: 'list',
        name: 'selection',
        message: '请选择发布的npm包更新类型?',
        choices: Object.keys(versionConfig),
    }, {
        type: 'confirm',
        message: '是否确认发布版本?',
        default: 'Y',
        name: 'isConfirm'
    }]
    const answer = await inquirer.prompt(question);
    console.log(answer, 'answer')

    new Promise((resolve, reject) => {
        const cloneSpinner = ora('正在更新版本…').start();
        const g = child_process.spawn('npm', ['version', versionConfig[answer.selection]])
        // stdout 获取标准输出
        g.stdout.on('data', data => {
            console.log(`stdout: ${data}`)
        })
        // stderr 获取标准错误输出
        g.stderr.on('data', data => {
            console.error(`stderr: ${data}`)
            console.log(logSymbols.error, chalk.red(data));
        })
        g.on('close', (code) => {
            console.log(`子进程退出，退出码: ${code}`)
            if (!code) {
                cloneSpinner.succeed(chalk.green('版本更新成功'))
                resolve();
            }
        });
        g.on('error', (code) => {
            console.log(`子进程错误，错误码 ${code}`)
            cloneSpinner.fail();
            reject()
        });
    })

}
deploy()