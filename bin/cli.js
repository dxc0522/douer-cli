#! /usr/bin/env node
// 必须在文件头添加如上内容指定运行环境为node
import initAction from './init.js'
import { Command } from 'commander' // 处理用户输入的命令
// import { name as cliName, version } from './package.json'
const program = new Command();
// 创建项目命令
program.argument('<name>', 'project name')
    .description('welcome to use my cli to create project') // 命令描述说明
    .action(initAction) // 执行函数

// 利用commander解析命令行输入，必须写在所有内容最后面
program.parse(process.argv)
