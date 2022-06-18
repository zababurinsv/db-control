var TYPE = "DEBUG";
var DATE = null;
var VERSION = null;
var PREVENT_CACHE = "_b4w_ver_";

export function version() {
    if (TYPE == "DEBUG") {
        var d = date();
        return [parseInt(String(d.getFullYear()).slice(-2), 10), d.getMonth() + 1];
    } else
        return VERSION;
}

export function version_str() {
    var str = "";
    var ver = version();

    for (var i = 0; i < ver.length; i++) {
        if (i == 1)
            str += ver[i] < 10 ? "0" + ver[i] : ver[i];
        else
            str += ver[i];
        if (i != ver.length - 1)
            str += ".";
    }

    return str;
}

export function type() {
    return TYPE;
}

/**
 * Return build date or current date for DEBUG version
 */
export function date() {
    if (TYPE == "DEBUG")
        return new Date();
    else
        return DATE;
}

/**
 * Return build date or current date for DEBUG version represented as a string.
 */
export function date_str() {
    var d = date();

    var day = d.getDate();
    day = day < 10 ? "0" + String(day) : String(day);

    var month = d.getMonth() + 1;
    month = month < 10 ? "0" + String(month) : String(month);

    var year = String(d.getFullYear());

    var hour = d.getHours();
    hour = hour < 10 ? "0" + String(hour) : String(hour);

    var minute = d.getMinutes();
    minute = minute < 10 ? "0" + String(minute) : String(minute);

    var second = d.getSeconds();
    second = second < 10 ? "0" + String(second) : String(second);

    // UNIX date +%d.%m.%Y\ %H:%M:%S
    var date_str = day + "." + month + "." + year + " " + hour + ":" + 
        minute + ":" + second;
    return date_str;
}

export function get_build_version() {
    if (TYPE != "DEBUG")
        return PREVENT_CACHE;

    var ts = date_str();
    // remove special symbols
    ts = ts.split(" ").join("").split(":").join("").split(".").join("");
    return ts;
}
