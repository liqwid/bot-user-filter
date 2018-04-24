import * as React from 'react'

import styled from 'styled-components'

import { List as MUIList, ListItem } from 'material-ui'

import { PageableState, FetchableState } from 'models/fetch.model'

import { Loader } from 'components/Loader'

export const ListWrap = styled(MUIList)`
  overflow: auto;
  height: 100%;
`

export interface ListProps<Model> extends Partial<PageableState>, FetchableState<Model> {
  style?: React.CSSProperties
  onScrollPastTop?(): void
  onScrollPastBottom?(): void
  renderChild(item: Model): React.ReactElement<any>
}

export function List<Model>({
  style, onScrollPastTop, onScrollPastBottom, items, loading, loadingNext,
  loadingPrevious, renderChild
}: ListProps<Model>) {
  function checkScrollPastBoundaries({ currentTarget }: React.UIEvent<HTMLUListElement>) {
    const { top, bottom } = currentTarget.getBoundingClientRect()
    const firstChildTop = currentTarget.children[0].getBoundingClientRect().top
    const lastChildBottom = currentTarget.children[currentTarget.childElementCount - 1].getBoundingClientRect().bottom

    if (top <= firstChildTop && onScrollPastTop) return onScrollPastTop()
    if (bottom >= lastChildBottom && onScrollPastBottom) return onScrollPastBottom()
  }

  return (
    <ListWrap
      style={style}
      onScroll={checkScrollPastBoundaries}
    >
      { loading && <Loader/> }
      {
        loadingPrevious && <ListItem>
          <Loader />
        </ListItem>
      }
      {
        !loading && items.map((item) =>
          renderChild(item)
        )
      }
      {
        loadingNext && <ListItem>
          <Loader />
        </ListItem>
      }
    </ListWrap>
  )
}
