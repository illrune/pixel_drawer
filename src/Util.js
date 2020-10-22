const Util = (() => {
    class Util {}

    Util.lerp = (start, end, r) => {
        return (start * (1 - r)) + (end * r);
    }

    return Util;
})();

export default Util;