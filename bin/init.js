#! /usr/bin/env node

import fs from 'fs'
import fsExtra from 'fs-extra'
import ora from 'ora'
import shell from 'shelljs'
import chalk from 'chalk'
import symbol from 'log-symbols'
import inquirer from 'inquirer'
import { getBaseQuestions } from './questions.js'
import getQuestionAnswers from './answers.js'
import { cloneRepositories } from './repositories.js'

const initAction = async (name, option) => {

  // 检查控制台是否可运行git
  if (!shell.which('git')) {
    console.log(symbol.error, 'git命令不可用！');
    shell.exit(1); // 退出
    return;
  }
  // 验证name输入是否合法
  if (name.match(/[^A-Za-z0-9\u4e00-\u9fa5_-]/g)) {
    console.log(symbol.error, '项目名称存在非法字符！');
    return;
  }
  // 下载完毕后，定义自定义问题

  // 获取用户选择配置
  const projectConfig = await getQuestionAnswers()
  // 获取基本项目信息
  const answers = await inquirer.prompt(getBaseQuestions(name));
  // 确认是否创建
  const confirm = await inquirer.prompt([{
    type: 'confirm',
    message: '是否确认创建项目',
    default: 'Y',
    name: 'isConfirm'
  }]);
  if (!confirm.isConfirm) {
    return false;
  }
  // 验证文件夹是否存在
  if (fs.existsSync(name) && !option.force) {
    // 确认是否创建
    const confirm = await inquirer.prompt([{
      type: 'confirm',
      message: `已存在项目文件夹${name},是否强制覆盖`,
      default: 'Y',
      name: 'isConfirm'
    }]);
    if (confirm.isConfirm) {
      // 强制覆盖
      try {
        const removeSpinner = ora(`${name}已存在，正在删除文件夹…`).start();
        fsExtra.removeSync(`./${name}`)
        removeSpinner.succeed(chalk.green('删除成功'))
      } catch (err) {
        removeSpinner.fail(chalk.red('删除失败'))
        return;
      }
    }
  }
  // 验证文件夹 END

  // 下载模板
  await cloneRepositories(name, projectConfig)

  // 初始化项目
  const installSpinner = ora('正在初始化项目').start();
  // 根据用户输入，调整配置文件
  // 读取package.json文件
  let jsonData = fs.readFileSync(`./${name}/package.json`)
  jsonData = JSON.parse(jsonData)
  Object.keys(answers).forEach(item => {
    if (item === 'name') {
      // 如果未输入项目名，则使用文件夹名
      jsonData[item] = answers[item] && answers[item].trim() ? answers[item] : name
    } else if (answers[item] && answers[item].trim()) {
      jsonData[item] = answers[item]
    }
  })
  // 写入package.json文件
  let obj = JSON.stringify(jsonData, null, '\t')
  fs.writeSync(fs.openSync(`./${name}/package.json`, "r+"), obj)
  // 初始化git
  if (shell.exec(`cd ${shell.pwd()}/${name} && git init`).code !== 0) {
    console.log(symbol.error, chalk.red('git 初始化失败'));
    shell.exit(1)
  }
  installSpinner.succeed(chalk.green('项目创建完成'))
  shell.exit(1)
}

export default initAction;