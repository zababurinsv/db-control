import b4w from "./b4w.js";

var _factories = {};

// TODO: assign export_functions into module_context to allow old module system to work.
export default function(module_name, module_context, export_functions) {
  var _ns = {};
  var is_internal = module_name.split("").slice(0, 2).join("") == "__";
  function internal_factory() {
    return function (ns) {
      ns = ns || "__b4w_default";

      if (_ns[ns] !== undefined) {
        return _ns[ns];
      }

      _ns[ns] = is_internal ? {} : internal_factory();
      module_context(ns, _ns[ns]);

      return _ns[ns];
    };
  };

  if (_factories[module_name] !== undefined) {
    return _factories[module_name];
  } else {
    // FIXME: the next code is bad. PLZ understand and forgive me
    var factory = is_internal ? internal_factory() : internal_factory()();

    b4w._n_module[module_name] = _factories[module_name] = factory;

    return factory;
  }
}
