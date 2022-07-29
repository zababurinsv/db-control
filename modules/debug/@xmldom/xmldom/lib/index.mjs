import dom from './dom.mjs'
import domParser from './dom-parser.mjs'
export default {
  DOMImplementation: dom.DOMImplementation,
  XMLSerializer: dom.XMLSerializer,
  DOMParser: domParser.DOMParser
}
