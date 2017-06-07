import React from 'react'
import style from './style.css'

import { memoize } from '../../util/memoize'

const createSelectTagHandler = memoize(
    (selectTag, writePosition, tag) => event => {
        if ('undefined' !== typeof document && document.body)
            document.body.scrollTop = 0
        const {
            top,
            width,
            left,
            height,
        } = event.target.getBoundingClientRect()
        writePosition('tag:' + tag, { top, width, left, height })
        selectTag(tag)
    }
)

export const TagCloud = ({ tags, selectTag, writePosition }) =>
    <div className={style.container}>
        {tags.map(tag =>
            <div
                key={tag}
                className={style.tag}
                onClick={createSelectTagHandler(selectTag, writePosition, tag)}
            >
                {tag}
            </div>
        )}
    </div>
