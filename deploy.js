#! /usr/bin/env node
import inquirer from 'inquirer'
import chalk from "chalk";
import ora from "ora";
import logSymbols from "log-symbols";
import { runCommand, } from './utils/index.js'
import shell from 'shelljs'

import { createRequire } from 'module'

// 引入JSON
export const require = createRequire(import.meta.url)

const JSONData = require('./package.json')
const versionConfig = {
    "直接发布": null,
    "当前版本预发布": 'prerelease',
    "细节变化预发布": 'prepatch',
    "细节变化": 'patch',
    "功能变更预发布": 'preminor',
    "功能变更": 'minor',
    "版本迭代预发布": 'premajor',
    "版本迭代": 'major',
}

async function deploy() {
    // 判断是否有未commit代码
    const localCode = await runCommand(`git status -s`)
    if (localCode) {
        console.log(logSymbols.error, chalk.red('请先commit git代码'));
        shell.exit(1)
    }
    // 判断是否有未commit代码 END

    // 判断线上包和当前包的大小
    let data;
    try {
        data = await runCommand(`npm v douer-cli version`,)
    } catch (error) {
        console.log(logSymbols.error, chalk.red('npm查询线上版本出错,请确认是否发布过'));
        shell.exit(1)
    }
    console.log(`\n线上版本:`, chalk.bgGreen.green(`${data}`))
    console.log('本地版本:', chalk.bgGreen.green(`${JSONData.version}`), '\n')
    // 更新包版本号
    const answer = await inquirer.prompt({ // 选择模版类别
        type: 'list',
        name: 'selection',
        message: '请选择发布的npm包更新类型?',
        choices: Object.keys(versionConfig),
    });
    if (versionConfig[answer.selection]) {
        const cloneSpinner = ora('正在更新版本号…').start();
        try {
            await runCommand(`npm version patch -m ${versionConfig[answer.selection]}`)
            // cloneSpinner.succeed(chalk.green('版本更新成功'))
        } catch (error) {
            // console.log(logSymbols.error, chalk.red(error));
            // cloneSpinner.fail();
            // shell.exit(1)
        } finally {
            cloneSpinner.succeed(chalk.green('版本更新成功'))
        }
    }
    // 更新包版本号END

    // 确认发布
    const isConfirm = await inquirer.prompt({
        type: 'confirm',
        message: '是否确认发布?',
        default: 'Y',
        name: 'isConfirm'
    });
    if (!isConfirm.isConfirm) {
        return
    }
    const cloneSpinner2 = ora('正在发布').start();
    try {
        const data = await runCommand(`npm publish -q`)
        cloneSpinner2.succeed(chalk.green('版本发布成功'))
        console.log(logSymbols.success, chalk.bgGreen.green(data));
        shell.exit(1)
    } catch (error) {
        console.log(logSymbols.error, chalk.red(error));
        cloneSpinner2.fail();
        shell.exit(1)
    }
    // 确认发布 END

}
deploy()