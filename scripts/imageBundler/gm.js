const spawn = require('child_process').spawn

type Options = {
    dimension?: [number, number],
    quality?: number,
    noProfile?: boolean,
    format?: 'jpg' | 'png' | 'gif' | 'bmp',
    commandName?: string,
}

const prepareArgs = (options: Options): Array<string> => [
    'convert',

    ...(options.dimension
        ? ['-resize', `${options.dimension[0]}x${options.dimension[1]}`]
        : []),

    ...(options.quality ? ['-quality', '' + options.quality] : []),

    ...(options.noProfile ? ['+profile', '"*"'] : []),

    '-',

    (options.format || 'jpg').toUpperCase() + ':-',
]

const exec = (cmd: string, args: Array<string>, input?: string | Buffer) =>
    new Promise((resolve, reject) => {
        try {
            const proc = spawn(cmd, args)

            const buffer = []
            let stderr = ''

            proc.stdout.on('data', data => buffer.push(data))
            proc.stderr.on('data', data => (stderr += data))

            proc.on('close', (code, signal) => {
                // something bad happend
                if (code !== 0 || signal !== null) return reject(stderr)

                resolve(new Buffer(Buffer.concat(buffer)))
            })
            proc.on('error', err => reject(err))

            if (input) {
                proc.stdin.write(input)
                proc.stdin.end()
            }
        } catch (err) {
            reject(err)
        }
    })

export const getSize = async (
    imageBuffer: string | Buffer,
    options: Options
): Promise<[number, number]> => {
    const res = await exec(
        options.commandName || 'gm',
        ['identify', '-format', '"%wx%h"', '-'],
        imageBuffer
    )

    const [width, height] = res.toString().replace(/[^x\d]/g, '').split('x')
    return [+width, +height]
}

export const convert = (
    imageInput: string | Buffer,
    options: Options
): Promise<Buffer> =>
    exec(options.commandName || 'gm', prepareArgs(options), imageInput)
