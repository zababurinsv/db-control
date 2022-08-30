function base64(myFile: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
        const fileReader = new FileReader();
        if (fileReader && myFile) {
            fileReader.readAsDataURL(myFile);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        } else {
            reject('No file provided');
        }
    });
}

export {base64}