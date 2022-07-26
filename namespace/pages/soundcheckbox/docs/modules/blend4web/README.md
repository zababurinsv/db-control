# blend4web

An official repository for Blend4Web WebGL engine (free version).

Blend4Web is a tool for creating interactive, web-based 3D content. The framework can be used for showcasing products, e-learning, game development, advertising and web design.


* It works right in the web browser without installing any plug-ins (thanks to WebGL);
* Not only does it render 3D graphics but it also integrates realistic physics and spatial audio;
* It is extremely simple to use because it is based on Blender in which 3D scenes can be made and then directly exported, even as a standalone web page;
* It is available as a fully functional open source version or as under a paid commercial license.
* It does not depend on any non-free components or cloud services.

## Getting support

We are always glad to answer your questions on the [Blend4Web forums](https://www.blend4web.com/en/forums/).
We also offer assistance for Blend4Web PRO owners with any technical issues which may arise (more [here](https://www.blend4web.com/en/services/support/)).

## Installing

```
npm install blend4web
```

## Usage

**Using built version (ES5)**

1. Include `b4w.min.js`, `b4w.simple.min.js` or `b4w.whitespace.min.js` into your html-file:
    ```
    <script src="node_modules/blend4web/dist/b4w.min.js"></script>
    ```

2. Use b4w global variable in your script:
    ```
    b4w.register("simple_app_es5", function(exports, require) {
        // import modules used by the app

        var m_app       = b4w.require("app");
        var m_cfg       = b4w.require("config");
        var m_data      = b4w.require("data");
        var m_preloader = b4w.require("preloader");
        var m_ver       = b4w.require("version");
        var m_anim      = b4w.require("animation");
        ...
    }

    b4w.require("simple_app_es5").init();
    ```
**Using ES6 module**

1. Include your javascript ES6 module into html:

    ```
    <script type="module" src="simple_app.js"></script>
    ```
2. Use b4w variable from `blend4web` module:
    ```
    import b4w from "blend4web";
    var m_app       = b4w.app;
    var m_cfg       = b4w.config;
    var m_data      = b4w.data;
    var m_preloader = b4w.preloader;
    var m_ver       = b4w.version;
    var m_anim      = b4w.animation;
    var m_cont      = b4w.container;
    var m_mouse     = b4w.mouse;
    var m_scenes    = b4w.scenes;
    ...
    ```
3. Use builders like `webpack`, `rollup` to run your application.

See examples in `projects` directory.

## Blender Addon

You can find a Blender addon in `dist/addons` directory.

## License

### Open source license

If you are creating an open source application under a license compatible with the [GNU GPL license v3](https://www.gnu.org/licenses/gpl-3.0.html), you may use Blend4Web under the terms of the GPLv3. To get away from GPLv3 restrictions, you should purchase commercial license.

You may not redistribute, sublicense or sell this program without written permission of Triumph LLC, the author of Blend4Web software.

This software is provided without warranty.

### Commercial license

If you want to use Blend4Web to develop commercial sites, themes, projects, and applications, the Commercial license is the appropriate license. With this option, your source code is kept proprietary. Purchase a Blend4Web Commercial License at [Blend4Web Online Store](https://www.blend4web.com/en/order_form/).

[Read more about Blend4Web's Commercial license](https://www.blend4web.com/pub/Blend4Web_SDK_Pro_license_en.pdf).

## More info

Visit [Blend4Web website](https://www.blend4web.com/) for more information and documentation.

## Contact us

* Email: info@blend4web.com
* Web: https://www.blend4web.com/
* Facebook: https://www.facebook.com/blend4web
* Twitter: https://twitter.com/blend4web
* Google+: https://plus.google.com/+blend4web
