export const endianness = function () { return 'LE' };

export const hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

export const loadavg = function () { return [] };

export const uptime = function () { return 0 };

export const freemem = function () {
    return Number.MAX_VALUE;
};

export const totalmem = function () {
    return Number.MAX_VALUE;
};

export const cpus = function () { return [] };

export const type = function () { return 'Browser' };

export const release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

export const networkInterfaces = function () { return {} };

export const getNetworkInterfaces = function () { return {} };

export const arch = function () { return 'javascript' };

export const platform = function () { return 'browser' };

export const tmpdir = function () {
    return '/tmp';
};

export const EOL = '\n';

export const homedir = function () {
    return '/'
};
export default  {
    homedir,
    EOL,
    tmpdir,
    platform,
    arch,
    getNetworkInterfaces,
    networkInterfaces,
    release,
    type,
    cpus,
    totalmem,
    freemem,
    uptime,
    loadavg,
    hostname,
    endianness
}
