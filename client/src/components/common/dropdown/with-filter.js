import { Component } from 'react';
import { test } from 'fuzzy';
import debounce from 'lodash.debounce';
import {
  func, arrayOf, object,
} from 'prop-types';

export class WithFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameFilter: '',
    };
  }

  setFilter(event) {
    event.persist();
    this.setFilterByValue(event.target.value);
  }

  setFilterByValue(nameFilter) {
    return debounce(
      this.setState({ nameFilter }),
      250,
      { maxWait: 500 },
    );
  }

  render() {
    const { items, children } = this.props;
    const { nameFilter } = this.state;
    const filteredItems = nameFilter === ''
      ? items
      : items.filter((
        { item: { name, abbrKey } },
      ) => test(nameFilter, `${name}${abbrKey}`));
    return children({
      filteredItems,
      setFilterFromEvent: this.setFilter,
      setFilterByValue: this.setFilterByValue,
    });
  }
}

WithFilter.defaultProps = {
  items: [],
};

WithFilter.propTypes = {
  items: arrayOf(object),
  // eslint-disable-next-line react/require-default-props
  children: func,
};
