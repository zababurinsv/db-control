import { hooks } from '/service/WCNode/hooks/index.mjs';

const service = async (self) => {
    try {
        const { render, useEffect, useState } = hooks;
        const [click, setClick] = useState(0);
        // await useEffect(async () => {
        //     console.log('==== init module ====')
        // }, [])
        //
        await useEffect(async () => {
            console.log('==== set click ====', click)
        }, [click])

        return {
            async click() {
                console.log('Click', click)
                setClick(click + 1);
                return await render(service);
            },

            async update() {
                return {
                    state: await render(service)
                };
            },
        };
    } catch (e) {
        console.log('error', e)
    }
}

export default service
