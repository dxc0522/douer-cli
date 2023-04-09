#! /usr/bin/env node
import symbol from 'log-symbols'
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


import clone from './clone.js'

const repositoriesData = {
    [AdminWeb]: {
        [Vue]: {
            remote: 'https://gitee.com/dxc12345/vue-visualization-screen.git',
            branch: 'master',
        },
        [React]: {
            remote: 'https://github.com/dxc0522/auto_script.git',
            branch: 'master',
        },
    },
    [H5Web]: {
    },
    [NpmPackage]: {
    },
    [MicroApp]: {
    },
    [UniappMiniProgram]: {
    },
    [Threejs]: {
    },
    [Python]: {
    },
}
export function getConfigRepositories(config) {
    if (Object.keys(repositoriesData[config.category]).length) {
        if (repositoriesData[config.category].remote) {
            return repositoriesData[config.category]
        } else if (Object.keys(repositoriesData[config.category][config.selection]).length) {
            return repositoriesData[config.category][config.selection]
        }
    }
    return null
}

export async function cloneRepositories(name, config) {
    const data = getConfigRepositories(config)
    if (!data || !data.remote) {
        console.log(symbol.error, '暂无对应仓库配置');
        throw ('暂无对应仓库配置')
    }
    await clone(data.remote, data.branch, name,)

}