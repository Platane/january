export const throttle = (delay: number, fn: (*) => void) => {
    let timeout = null
    let args = []

    const _fn = () => {
        timeout = null
        fn(...args)
    }

    return (..._args: *) => {
        args = _args

        if (timeout) return

        timeout = setTimeout(_fn, delay)
    }
}
