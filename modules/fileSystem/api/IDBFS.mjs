export let IDBFS = (object) => {
    return new Promise(async (resolve, reject) => {
        const idbfs = {
            is: {
                file: async (file) => {
                    try {
                        let isFile = (object.fs.self.analyzePath(file).exists)
                            ? await object.fs.self.isFile(object.fs.self.analyzePath(file).object.mode)
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
                            let isDir = (object.fs.self.analyzePath(dir).exists)
                                ? await object.fs.self.isDir(object.fs.self.analyzePath(dir).object.mode)
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
            set: {
                file: ( file, contents, path = `${object.dirShared}${object.dirData}`) => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            console.log('file is write',`${path}/${file}`)
                            let writeFile = (typeof contents !== "string")
                              ? await object.fs.self.writeFile(`${path}/${file}`, JSON.stringify(contents))
                              : await object.fs.self.writeFile(`${path}/${file}`, contents)
                            resolve(writeFile)
                        } catch (e) {
                            console.error('error',e)
                            resolve({
                                status: true,
                                message: e
                            })
                        }
                    })
                },
                data: (folder, file, contents, readable = true, writable = true ) => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            let createDataFile = await object.fs.self.createDataFile(folder, file, contents, readable, writable)
                            resolve(createDataFile)
                        }catch (e) {
                            resolve({
                                status: true,
                                message: e
                            })
                        }
                    })
                },
            },
            get: {
                all: {
                    files: async (path) => {
                        let dir = await idbfs.get.dir(path)
                        let files = []
                        for(let i =0; i < dir.length; i++) {
                            if(dir[i] !== '.' && dir[i] !== '..') {
                                files.push(JSON.parse(object.fs.self.readFile(`${path}/${dir[i]}`, { encoding: "utf8" })))
                            }
                        }
                        return files
                    }
                },
                dir: (dir) => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            const readdir = await object.fs.self.readdir(dir)
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
                file: (file, path = `${object.dirShared}${object.dirData}`, encoding = "utf8") => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            let readFile = await object.fs.self.readFile(`${path}/${file}`, { encoding: encoding })
                            console.log('=== get file =========', readFile)
                            resolve(readFile)
                        } catch (e) {
                            console.error('error',e)
                            resolve({
                                status: true,
                                message: e
                            })
                        }
                    })
                }
            },
            delete: {
                file: (file) => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            let unlink = await object.fs.self.unlink(file)
                            console.log('remove')
                            resolve(unlink)
                        } catch (e) {
                            resolve({
                                status: true,
                                message: e
                            })
                        }
                    })
                },
                dir: (path) => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            let rmdir = await object.fs.self.rmdir(path)
                            resolve(rmdir)
                        } catch (e) {
                            resolve({
                                status: true,
                                message: e
                            })
                        }
                    })
                }
            },
            file: {
                rename: (oldName, newName, path = `${object.dirShared}${object.dirData}`) => {
                    return new Promise(async (resolve, reject) => {
                        try {
                        let rename = (await idbfs.is.file(oldName))
                                ? (await object.fs.self.rename(`${path}/${oldName}`, `${path}/${newName}`), true)
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
                }
            },
            create: {
                dir: (path) => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            let mkdir = await object.fs.self.mkdir(path)
                            resolve(mkdir)
                        } catch (e) {
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
                    let symlink = await object.fs.self.symlink(oldPath, newPath);
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
                    let mount = await object.fs.self.mount(type, params, dir)
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
                    let unmount = await object.fs.self.unmount(mountPoint)
                    resolve(unmount)
                } catch (e) {
                    resolve({
                        status: true,
                        message: e
                    })
                }
            },
            cwd: (path) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        let cwd = await object.fs.self.cwd()
                        resolve(cwd)
                    } catch (e) {
                        resolve({
                            status: true,
                            message: e
                        })
                    }
                })
            },
            load: () => {
                return new Promise(async (resolve, reject) => {
                    object.fs.self.syncfs(true,  (e) => {
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
                    object.fs.self.syncfs(false , (err) => {
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
        }
        resolve(idbfs)
    })
}

export default {


}
