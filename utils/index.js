import child_process from 'child_process'
import { createRequire } from 'module'

// 引入JSON
export const require = createRequire(import.meta.url)

// 运行命令Promise
export async function runCommand(command) {

    const commandArr = command.split(" ").filter(i => !!i)
    if (!commandArr.length) {
        throw Error('请输入命令(空号隔开)')
    }
    return new Promise((resolve, reject) => {
        const g = child_process.spawn(commandArr.shift(), commandArr)
        // stdout 获取标准输出
        g.stdout.on('data', data => {
            // console.log(`stdout:`, `${data}`)
            resolve(data)
        })
        // stderr 获取标准错误输出
        g.stderr.on('data', data => {
            // console.error(`stderr: ${data}`)
            reject(data)
        })
        g.on('close', (code) => {
            // console.log(`子进程退出，退出码: ${code}`)
            if (!code) {
                resolve();
            }
        });
        g.on('error', (code) => {
            // console.log(`子进程错误，错误码 ${code}`)
            reject(data)
        });
    })
}

// 比较版本号
export function compareVersion(version1, version2) {
    const arr1 = version1.split('.')
    const arr2 = version2.split('.')
    const length1 = arr1.length
    const length2 = arr2.length
    const minlength = Math.min(length1, length2)
    let i = 0
    for (i; i < minlength; i++) {
        let a = parseInt(arr1[i])
        let b = parseInt(arr2[i])
        if (a > b) {
            return 1
        } else if (a < b) {
            return -1
        }
    }
    if (length1 > length2) {
        for (let j = i; j < length1; j++) {
            if (parseInt(arr1[j]) != 0) {
                return 1
            }
        }
        return 0
    } else if (length1 < length2) {
        for (let j = i; j < length2; j++) {
            if (parseInt(arr2[j]) != 0) {
                return -1
            }
        }
        return 0
    }
    return 0
}