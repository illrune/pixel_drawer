const Util = (() => {
    class Util {}

    Util.clamp = (n, min, max) => {
        return Math.max(Math.min(n, max), min);
    };

    Util.lerp = (start, end, r) => {
        return (start * (1 - r)) + (end * r);
    };

    return Util;
})();

export default Util;