'use strict';

import React from 'react';
import './styles';

const propTypes = {
  children: React.PropTypes.node,
};

const defaultProps = {
  children: null,
};

class StickyBlock extends React.PureComponent {
  constructor(props) {
    super(props);

    this.ref_wrapper = false;
    this.ref_block = false;

    this.setRefWrapper = this.setRefWrapper.bind(this);
    this.setRefBlock = this.setRefBlock.bind(this);

    this.updatePosition = this.updatePosition.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.updatePosition);
    window.addEventListener('resize', this.updatePosition);

    this.updatePosition();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.updatePosition);
    window.removeEventListener('resize', this.updatePosition);
    this.ref_wrapper = false;
    this.ref_block = false;
  }

  setRefBlock(c) {
    this.ref_block = c;
  }

  setRefWrapper(c) {
    this.ref_wrapper = c;
  }

  updatePosition() {
    if (!this.ref_block) return;
    if (!this.ref_wrapper) return;

    const offset_top = this.ref_wrapper.offsetTop;
    const scroll_y = window.scrollY + 40;
    let top = '0px';

    if (isNaN(offset_top) || isNaN(scroll_y)) return;

    if (offset_top < scroll_y) {
      top = `${scroll_y - offset_top}px`;
    }
    
    if (this.ref_block.style.top !== top) {
      this.ref_block.style.top = top;
    }
  }

  render() {
    return (
      <div className="sticky-block__wrapper" ref={this.setRefWrapper}>
        <div className="sticky-block" ref={this.setRefBlock}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

StickyBlock.propTypes = propTypes;
StickyBlock.defaultProps = defaultProps;

export default StickyBlock;
