/**
 * Normalize path, based on python os.path.normpath() function
 */
export function normpath(path) {
    var sep = '/';
    var empty = '';
    var dot = '.';
    var dotdot = '..';

    if (path == empty)
        return dot;

    var initial_slashes = (path.indexOf(sep) == 0) | 0;

    // allow one or two initial slashes, more than two treats as single
    if (initial_slashes && (path.indexOf(sep + sep) == 0)
            && (path.indexOf(sep + sep + sep) != 0))
        initial_slashes = 2;

    var comps = path.split(sep);
    var new_comps = [];
    for (var i = 0; i < comps.length; i++) {
        var comp = comps[i];
        if (comp == empty || comp == dot)
            continue;
        if (comp != dotdot || (!initial_slashes && !new_comps.length)
                || (new_comps.length && (new_comps[new_comps.length - 1] == dotdot)))
            new_comps.push(comp);
        else if (new_comps.length)
            new_comps.pop();
    }

    comps = new_comps;
    path = comps.join(sep);
    for (var i = 0; i < initial_slashes; i++)
        path = sep + path;

    return path || dot;
}

export function normpath_preserve_protocol(dir_path) {
    var separated_str = dir_path.split('://',2);
    if (separated_str.length > 1) {
        separated_str[1] = normpath(separated_str[1]);
        return separated_str.join('://');
    } else
        return normpath(dir_path);
}

export function get_file_extension(file_path) {
    var re = /(?:\.([^.]+))?$/;
    return re.exec(file_path)[1];
}
