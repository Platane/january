const MAX_MEMORY = 30

export const memoize = (fn: any => *): (any => *) => {
    const memory = []

    return (...args) => {
        const lastValue = memory.find(
            x =>
                x.args.length === args.length &&
                x.args.every((a, i) => a === args[i])
        )

        if (lastValue) return lastValue.result

        memory.unshift({ args, result: fn(...args) })

        if (memory.length > MAX_MEMORY) memory.pop()

        return memory[0].result
    }
}
