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
            remote: 'https://github.com/nekobc1998923/vitecamp.git',
        },
        [React]: {
            remote: 'https://github.com/joaopaulomoraes/reactjs-vite-tailwindcss-boilerplate.git',
        },
    },
    [H5Web]: {
        [Vue]: {
            remote: 'https://github.com/LZHD/vue-vite-h5.git',
        },
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