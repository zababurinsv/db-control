import { node } from '/static/html/components/component_modules/hooks/index.mjs'
import { Application } from '/static/html/components/auction-graph/modules/Graph/renderer.mjs';

export default function module(self) {
  try {
    const { render, useEffect, useState } = node
    const [component, setComponent] = useState(self)
    const [canvas, setCanvas] = useState(self.querySelector('.auction-graph__canvas'))
    const [menu, setMenu] = useState(self.querySelector('.auction-graph__menu'))
    const [renderer, setRenderer] = useState()
    const [isStart, setStart] = useState(false)

    const setCanvasSize = (canvas) => {
      const devicePixelRatio = window.devicePixelRatio || 1;
      const borderSize = (window.innerWidth * devicePixelRatio) / 6;
      canvas.width = ((window.innerWidth * devicePixelRatio) - borderSize) & ~3;
      canvas.height = ((window.innerHeight * devicePixelRatio) - borderSize) & ~3;
    }

    useEffect(() => {
      setRenderer(new Application(canvas));
      setCanvasSize(canvas);
    }, [])

    useEffect(() => {
        renderer.start();
    }, [isStart])

    return {
      start: () => {
        setStart(true)
        return node.render(module)
      },
      render: () => { }
    }
  } catch (e) {
    console.log('error', e)
  }
}
