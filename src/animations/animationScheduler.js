let nextAnimationTime = 0;

const ANIMATION_OFFSET = 25;
const ANIMATION_CHAIN_WINDOW = 250;

export function scheduleAnimation(callback) {
    const now = Date.now();

    // Nach einer längeren Pause beginnt eine neue Animationskette.
    if (
        nextAnimationTime === 0 ||
        now - nextAnimationTime > ANIMATION_CHAIN_WINDOW
    ) {
        nextAnimationTime = now;
    }

    const startTime = Math.max(now, nextAnimationTime);
    const delay = Math.max(0, startTime - now);

    nextAnimationTime = startTime + ANIMATION_OFFSET;

    setTimeout(callback, delay);
}