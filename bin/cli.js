#! /usr/bin/env node
// 必须在文件头添加如上内容指定运行环境为node
import initAction from './init.js'
import { Command } from 'commander' // 处理用户输入的命令
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const JSONData = require('../package.json')

const program = new Command();
// 创建项目命令
program.argument('<name>', '项目名称')
    .version(JSONData.version)
    .description('欢迎使用我的脚本创建项目!') // 命令描述说明
    .action(initAction) // 执行函数

// 利用commander解析命令行输入，必须写在所有内容最后面
program.parse(process.argv)
