// import jest from 'jest'
import { throttle } from '../time'

jest.useFakeTimers()

describe('throttle', () => {
    it('should call after a delay', () => {
        const callback = jest.fn()

        const fn = throttle(200, callback)

        fn()

        expect(callback).not.toBeCalled()

        jest.runAllTimers()

        expect(callback).toBeCalled()
    })
    it('should call once', () => {
        let called = 0

        const fn = throttle(200, () => called++)

        fn()
        fn()
        fn()
        fn()

        expect(called).toBe(0)

        jest.runAllTimers()

        expect(called).toBe(1)
    })
})
