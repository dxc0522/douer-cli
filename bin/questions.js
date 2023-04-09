#! /usr/bin/env node
import {
    AdminWeb,
    H5Web,
    MicroApp,
    NpmPackage,
    UniappMiniProgram,
    Threejs,
    Python,
    Vue,
    React
} from './types.js'
export const questionLinkConfig = {
    category: {
        include: [
            AdminWeb,
            H5Web,
            MicroApp,
            NpmPackage,
        ],
        next: { // 选择模版类别
            type: 'list',
            name: 'selection',
            message: 'choice project framework?',
            choices: [
                Vue,
                React,
            ],
        },
    }
}
export const questionsConfig = [
    { // 选择模版类别
        type: 'list',
        name: 'category',
        message: 'choice project category?',
        choices: [
            AdminWeb,
            H5Web,
            NpmPackage,
            UniappMiniProgram,
            Threejs,
            Python,
        ],
    },

]

export const getBaseQuestions = name => [
    {
        type: 'input',
        message: `请输入项目名称：（${name}）`,
        name: 'name',
        validate(val) {
            if (val.match(/[^A-Za-z0-9\u4e00-\u9fa5_-]/g)) {
                return '项目名称包含非法字符'
            }
            return true;
        }
    },
    {
        type: 'input',
        message: '请输入项目关键词,分割：',
        name: 'keywords'
    },
    {
        type: 'input',
        message: '请输入项目简介：',
        name: 'description'
    },
    {
        type: 'input',
        message: '请输入作者名称：',
        name: 'author'
    },
];