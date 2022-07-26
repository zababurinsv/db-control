let reader = {
    isWorkerFs: (node, obj, path, highWaterMark, isRelation) => {
        return new Promise(async (resolve, reject) => {
            obj.stream = node.fs.worker.open(path, 'r');
            obj.highWaterMark = (highWaterMark)
                ? (isRelation)
                    ? (obj.stream.node.size / highWaterMark <= 1) ? obj.stream.node.size : obj.stream.node.size / highWaterMark
                    : highWaterMark
                : Math.trunc((obj.stream.node.size / 5 <= 1) ? obj.stream.node.size : obj.stream.node.size / 5)
            obj.read = () => {
                return new Promise((resolve, reject) => {
                    let done = false
                    let length = (obj.stream.node.size - obj.stream.position - obj.highWaterMark <= 0)
                        ? (done = true, obj.stream.node.size - obj.stream.position)
                        : obj.highWaterMark
                    let buffer = new Uint8Array(length);
                    node.fs.worker.read(obj.stream, buffer, 0, length);
                    let progress = 100 * obj.stream.position / obj.stream.node.size
                    resolve({
                        done:  done,
                        value: buffer,
                        progress: progress
                    })
                })
            }
            resolve(obj)
        })
    }
}

export default (node, type ='isWorkerFs'||'isIdbFs' ,path = "/",   highWaterMark, isRelation= false) => {
    return new Promise(async (resolve, reject) => {
        let obj =  { }
        if(type === 'isWorkerFs') {
            obj = await reader.isWorkerFs(node, obj, path, highWaterMark, isRelation)
        } else if(type === 'isIdbFs') {
            console.log('in Progress')
        } else {
            console.warn('неизвестный тип ридера', type)
        }
        resolve(obj)
    })
}