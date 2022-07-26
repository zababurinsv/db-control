export default (uint8) => {
    return new Promise(async (resolve, reject)=>{
         new ReadableStream({
            async start(controller) {
                while (true) {
                    const { done, value } = await reader.read();

                    // When no more data needs to be consumed, break the reading
                    if (done) {
                        break;
                    }

                    // Enqueue the next data chunk into our target stream
                    controller.enqueue(value);
                }

                // Close the stream
                controller.close();
                reader.releaseLock();
            }
        })

    })
}
fetch('./tortoise.png')
    // Retrieve its body as ReadableStream
    .then(response => response.body)
    .then(rs => {
        const reader = rs.getReader();

        return new ReadableStream({
            async start(controller) {
                while (true) {
                    const { done, value } = await reader.read();

                    // When no more data needs to be consumed, break the reading
                    if (done) {
                        break;
                    }

                    // Enqueue the next data chunk into our target stream
                    controller.enqueue(value);
                }

                // Close the stream
                controller.close();
                reader.releaseLock();
            }
        })
    })
    // Create a new response out of the stream
    .then(rs => new Response(rs))
    // Create an object URL for the response
    .then(response => response.blob())
    .then(blob => URL.createObjectURL(blob))
    // Update image
    .then(url => image.src = url)
    .catch(console.error);