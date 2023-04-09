#! /usr/bin/env node
import inquirer from 'inquirer'
import { questionsConfig, questionLinkConfig } from './questions.js'
// 获取问题结果
async function getQuestionAnswers(question = questionsConfig, options = {}) {
    let answersData = {}
    const answer = await inquirer.prompt(question);
    const keyName = Object.keys(answer)[0]
    Object.assign(answersData, answer)
    if (questionLinkConfig[keyName] && questionLinkConfig[keyName].include.includes(answer[keyName])) {
        return Object.assign(answersData, await getQuestionAnswers(questionLinkConfig[keyName].next))
    }
    return answersData
}

export default getQuestionAnswers