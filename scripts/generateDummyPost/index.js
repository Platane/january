const fs = require('fs')
const path = require('path')

const lorem = (() => {
    const wordPool = 'the beautiful temples of Angkor Wat at sunset or sunrise how far can you walk along The Great Wall of China walk Tokyo bustling streets of neon and tradition hong Kong skyscrapers the backpackers hub of Bangkok visit the Buddhist monasteries of Nepal  view or climb the magestic Himalayan Mountain Range the Temple of Heaven in Beijing see or visit Mt.Fuji the highest mountain in Japan view and hear the tales behind the Taj Mahal'.split(
        ' '
    )

    const capitalize = (s: string): string => s[0].toUpperCase() + s.slice(1)

    const _word = (): string =>
        wordPool[Math.floor(Math.random() * wordPool.length)]

    const word = (): string =>
        (Math.random() < 0.005 && '__' + _word() + '__') ||
        (Math.random() < 0.005 && '_' + _word() + '_') ||
        _word()

    const sentence = (): string =>
        capitalize(
            Array.from({ length: Math.floor(Math.random() * 4) + 5 })
                .map(word)
                .join(' ')
        ) + '.'

    const paragraph = (): string =>
        Array.from({ length: Math.floor(Math.random() * 4) + 5 })
            .map(sentence)
            .join(' ')

    const article = (): string =>
        Array.from({ length: Math.floor(Math.random() * 4) + 5 })
            .map(paragraph)
            .join('\n')

    return { word, sentence, paragraph, article }
})()

const createLoremImage = (imageDir: string) => {
    const imagePool = fs.readdirSync(imageDir)

    const get = () =>
        fs.readFileSync(
            path.join(
                imageDir,
                imagePool[Math.floor(Math.random() * imagePool.length)]
            )
        )

    return get
}

const safeMkdir = dirName => {
    try {
        fs.mkdirSync(dirName)
    } catch (err) {
        if ('EEXIST' != err.code) throw err
    }
}
export const generatePost = async (options: {
    targetDir: string,
    imageDir: string,
}) => {
    const loremImage = createLoremImage(options.imageDir)

    const title = lorem.sentence()

    const id = title
        .toLowerCase()
        .replace(/[^\w]|_/g, ' ')
        .trim()
        .replace(/ +/g, '-')

    const tags = [
        ['world', 'update', 'essential'][Math.floor(Math.random() * 3)],
        ...Array.from(
            { length: 2 + Math.floor(Math.random() * 5) },
            lorem.word
        ),
    ].filter(x => x.length > 3)

    const date = Math.floor(
        Date.now() - 365 * 24 * 60 * 60 * 1000 * Math.random()
    )

    const images = Array.from({
        length: Math.floor(3 * Math.random()) + 1,
    }).map((_, i) => ({
        buffer: loremImage(),
        fileName: `image${i}.jpg`,
    }))

    const content = [
        `${title}`,
        '===',
        '',
        `> ${new Date(date).toISOString().slice(0, 10)}`,
        '',
        `> tags: ${tags.join(', ')}`,
        '',
        `![${lorem.sentence()}](./${images[0].fileName})`,
        '',
        lorem.paragraph(),
        '',

        ...Array.from({ length: Math.floor(Math.random() * 5) + 2 }).map(() =>
            [
                ' ',
                Math.random() > 0.5 && '# ' + lorem.sentence(),
                ' ',
                Math.random() > 0.5 && lorem.paragraph(),
                ...images
                    .filter(() => Math.random() > 0.5)
                    .map(
                        ({ fileName }) =>
                            `![${lorem.sentence()}](./${fileName})`
                    ),
                ' ',
                Math.random() > 0.8 && '> ' + lorem.paragraph(),
                ' ',
                Math.random() > 0.8 && lorem.article(),
                ' ',
                Math.random() > 0.8 && lorem.paragraph(),
                ' ',
            ]
                .filter(Boolean)
                .join('\n')
        ),
    ].join('\n')

    safeMkdir(path.join(options.targetDir))
    safeMkdir(path.join(options.targetDir, id))

    fs.writeFileSync(path.join(options.targetDir, id, 'index.md'), content)

    images.forEach(({ buffer, fileName }) =>
        fs.writeFileSync(path.join(options.targetDir, id, fileName), buffer)
    )
}
