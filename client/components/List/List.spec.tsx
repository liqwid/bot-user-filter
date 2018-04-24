import * as React from 'react'
import { shallow, mount, ShallowWrapper } from 'enzyme'

import { List, ListProps, ListWrap } from "./List"
import { FetchModel } from 'models/fetch.model'
import { Loader } from 'components/Loader'
import { ListItem } from 'material-ui'

const defaultListProps = {
  loading: false,
  loadingNext: false,
  loadingPrevious: false,
  items: [],
  renderChild: (item) => <StubChild key={item.id} {...item} />
}

const StubChild = (item) => <div id={`id${item.id}`}/>

const STUB_ITEMS_LENGTH = 10
const STUB_ITEMS = Array(STUB_ITEMS_LENGTH).fill(undefined)
.map((_, id) => ({ id }))

describe('List', () => {
  let wrapper: ShallowWrapper<ListProps<FetchModel>>
  beforeEach(() => {
    wrapper = shallow(<List {...defaultListProps} />)
  })

  it('should render Loader when loading prop is true', () => {
    expect(wrapper.find(Loader)).toHaveLength(0)

    wrapper.setProps({ loading: true })

    expect(wrapper.find(Loader)).toHaveLength(1)
  })

  it('should render items list', () => {
    expect(wrapper.find(StubChild)).toHaveLength(0)

    wrapper.setProps({ items: STUB_ITEMS })

    expect(wrapper.find(StubChild)).toHaveLength(STUB_ITEMS_LENGTH)

    wrapper.find(StubChild).forEach((node, index) => {
      expect(node.find(`#id${STUB_ITEMS[index].id}`)).toBeTruthy()
    })
  })

  it('should not render items list when loading prop is true', () => {
    wrapper.setProps({ loading: true, items: STUB_ITEMS })
    expect(wrapper.find(StubChild)).toHaveLength(0)
  })

  it('should append loader to items at the end when loadingNext is true', () => {
    wrapper.setProps({ items: STUB_ITEMS })
    expect(wrapper.find(ListItem).last().find(Loader)).toHaveLength(0)
    
    wrapper.setProps({ loadingNext: true })
    expect(wrapper.find(ListItem).last().find(Loader)).toHaveLength(1)
  })

  it('should append loader to items at start when loadingPrevious is true', () => {
    wrapper.setProps({ items: STUB_ITEMS })
    expect(wrapper.find(ListItem).first().find(Loader)).toHaveLength(0)
    
    wrapper.setProps({ loadingPrevious: true })
    expect(wrapper.find(ListItem).first().find(Loader)).toHaveLength(1)
  })

  it('should append loader to items at start when loadingPrevious is true', () => {
    wrapper.setProps({ items: STUB_ITEMS })
    expect(wrapper.find(ListItem).first().find(Loader)).toHaveLength(0)
    
    wrapper.setProps({ loadingPrevious: true })
    expect(wrapper.find(ListItem).first().find(Loader)).toHaveLength(1)
  })
})
