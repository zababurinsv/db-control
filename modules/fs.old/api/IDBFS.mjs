export let IDBFS = (object) => {
    return new Promise(async (resolve, reject) => {
        let idbfs = {
            fs: {
                load: () => {
                    return new Promise(async (resolve, reject) => {
                        object.fs.idbfs.syncfs(true,  (e) => {
                            if(e) {
                                console.error('error',e)
                                resolve(false)
                            } else {
                                console.log('fs is loaded')
                                resolve(true)
                            }
                        });
                    })
                },
                save: () => {
                    return new Promise(async (resolve, reject) => {
                        object.fs.idbfs.syncfs(false , (err) => {
                            if(err) {
                                resolve({
                                    status: "false",
                                    success: false,
                                    message: err
                                })
                            } else {
                                console.log('file save')
                                resolve({
                                    status: "true",
                                    success: true,
                                    message: 'file save'
                                })
                            }
                        });
                    })
                }
            },
            is: {
                file: async (file) => {
                    try {
                        let isFile = (object.fs.idbfs.analyzePath(file).exists)
                            ? await object.fs.idbfs.isFile(object.fs.idbfs.analyzePath(file).object.mode)
                            : false
                        console.log(`${file} file ${isFile}`)
                        resolve(isFile)
                    } catch (e) {
                        console.error('error', e)
                        resolve({
                            status: true,
                            message: e
                        })
                    }
                },
                dir: (dir = '/') => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            let isDir = (object.fs.idbfs.analyzePath(dir).exists)
                                ? await object.fs.idbfs.isDir(object.fs.idbfs.analyzePath(dir).object.mode)
                                : false
                            console.log(`${dir} dir ${isDir}`)
                            resolve(isDir)
                        } catch (e) {
                            console.error('error', e)
                            resolve({
                                status: true,
                                message: e
                            })
                        }
                    })
                }
            },
            file: {
                read: (file, encoding = "utf8") => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            let readFile = await object.fs.idbfs.readFile(`${object.dirShared}${object.dirData}/${file}`, { encoding: encoding })
                            console.log(readFile)
                            resolve(readFile)
                        }catch (e) {
                            console.error('error',e)
                            resolve({
                                status: true,
                                message: e
                            })
                        }
                    })
                },
                write: (file, contents) => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            let writeFile = (typeof contents !== "string")
                                ? await object.fs.idbfs.writeFile(`${object.dirShared}${object.dirData}/${file}`, JSON.stringify(contents))
                                : await object.fs.idbfs.writeFile(`${object.dirShared}${object.dirData}/${file}`, contents)
                            console.log('file is writ')
                            resolve(writeFile)
                        }catch (e) {
                            console.error('error',e)
                            resolve({
                                status: true,
                                message: e
                            })
                        }
                    })
                },
                createData: (folder, file, contents, readable = true, writable = true ) => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            let createDataFile = await object.fs.idbfs.createDataFile(folder, file, contents, readable, writable)
                            resolve(createDataFile)
                        }catch (e) {
                            resolve({
                                status: true,
                                message: e
                            })
                        }
                    })
                },
                rename: (oldName, newName) => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            let path = `${object.dirShared}${object.dirData}`
                        let rename = (idbfs.is.file(oldName))
                                ? (await object.fs.idbfs.rename(`${path}/${oldName}`, `${path}/${newName}`), true)
                                : false
                            resolve(rename)
                        } catch (e) {
                            console.error('error',e)
                            resolve({
                                status: true,
                                message: e
                            })
                        }
                    })
                },
                remove: (file) => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            let unlink = await object.fs.idbfs.unlink(file)
                            console.log('remove')
                            resolve(unlink)
                        }catch (e) {
                            resolve({
                                status: true,
                                message: e
                            })
                        }
                    })
                },
            },
            symlink: async (oldPath, newPath) => {
                try {
                    let symlink = await object.fs.idbfs.symlink(oldPath, newPath);
                    resolve(symlink)
                } catch (e) {
                    resolve({
                        status: true,
                        message: e
                    })
                }
            },
            mount: async (type = {}, dir = '/newKind', params = {}) => {
                try {
                    let mount = await object.fs.idbfs.mount(type, params, dir)
                    resolve(mount)
                } catch (e) {
                    resolve({
                        status: true,
                        message: e
                    })
                }
            },
            unmount: async (mountPoint = '/newKind') => {
                try {
                    let unmount = await object.fs.idbfs.unmount(mountPoint)
                    resolve(unmount)
                } catch (e) {
                    resolve({
                        status: true,
                        message: e
                    })
                }
            },
            mkdir: (path) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        let mkdir = await object.fs.idbfs.mkdir(path)
                        resolve(mkdir)
                    }catch (e) {
                        resolve({
                            status: true,
                            message: e
                        })
                    }
                })
            },
            readdir: (path) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        let readdir = await object.fs.idbfs.readdir(path)
                        resolve(readdir)
                    } catch (e) {
                        console.error('dir error:',e)
                        resolve({
                            status: true,
                            message: e
                        })
                    }
                })
            },
            rmdir: (path) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        let rmdir = await object.fs.idbfs.rmdir(path)
                        resolve(rmdir)
                    }catch (e) {
                        resolve({
                            status: true,
                            message: e
                        })
                    }
                })
            },
            cwd: (path) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        let cwd = await object.fs.idbfs.cwd()
                        resolve(cwd)
                    }catch (e) {
                        resolve({
                            status: true,
                            message: e
                        })
                    }
                })
            }
        }
        resolve(idbfs)
    })
}

export default {


}