export default class SeededRandom {

    constructor(seed) {
        this.seed = seed;
    }

    next() {
        this.seed = (this.seed * 9301 + 49297) % 233280;

        return this.seed / 233280;
    }

    range(min, max) {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }

    bool(chance = 0.5) {
        return this.next() < chance;
    }

}