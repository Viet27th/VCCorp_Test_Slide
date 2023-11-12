const getElementInnerWidth = (el) => {
    const elWidth = el.clientWidth;
    const { paddingLeft, paddingRight } = window.getComputedStyle(el, null);
    const elInnerWidth = elWidth - parseInt(paddingLeft) - parseInt(paddingRight);

    return elInnerWidth;
}

const animationX = (el, xPosition, delay = 500) => {
    el.style.transitionDuration = `${delay}ms`;
    el.style.transform = `translateX(${xPosition}px)`;
    setTimeout(() => {
        el.style.transitionDuration = "0ms";
    }, delay);
}

const getPositionX = (e) => {
    return e.type.includes('mouse') ? e.x : e.touches[0]?.clientX
};

export const utils = {
    getElementInnerWidth,
    animationX,
    getPositionX
}