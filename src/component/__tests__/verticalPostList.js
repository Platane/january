import React from 'react'
import { mount } from 'enzyme'
import { VerticalPostList } from '../verticalPostList'

import postPreviewStyle from '../verticalPostList/postPreview/style.css'

describe('component/verticalPostList', () => {
    it('should render posts', () => {
        const props = {
            posts: [
                {
                    id: 'a',
                    title: 'tilte-a',
                    medias: [],
                    content: [],
                },
                {
                    id: 'b',
                    title: 'tilte-b',
                    medias: [],
                    content: [],
                },
            ],
        }

        const wrapper = mount(<VerticalPostList {...props} />)

        expect(
            wrapper
                .find('.' + postPreviewStyle.container)
                .map(x => x.find('.' + postPreviewStyle.title).text())
        ).toEqual(['tilte-a', 'tilte-b'])
    })
})
