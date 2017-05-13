import 'jest'
import { memoize } from '../memoize'

describe('memoize', () => {
    it('should return wrapped function', () => {
        const fn = memoize(x => ({ x }))

        expect(fn(12)).toEqual({ x: 12 })
    })
    it('should return memoized version', () => {
        const fn = memoize(x => ({ x }))

        expect(fn(12)).toBe(fn(12))
    })
})
