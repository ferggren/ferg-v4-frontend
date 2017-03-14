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

  componentDidUpdate() {
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

    const navigation_height = 40;
    const offset_top = this.ref_wrapper.offsetTop;
    const scroll_y = window.scrollY + navigation_height;
    let width = this.ref_wrapper.offsetWidth;
    let top = 0;

    if (isNaN(offset_top) ||
        isNaN(scroll_y) ||
        isNaN(width)
        ) {
      return;
    }

    width = `${width}px`;

    if (width !== this.ref_block.style.width) {
      this.ref_block.style.width = width;
    }

    if (offset_top < scroll_y) {
      top = scroll_y - offset_top;
    }

    let position = 'relative';

    if (top > 0) {
      top = navigation_height;
      position = 'fixed';
    }

    top = `${top}px`;
    
    if (this.ref_block.style.position !== position) {
      this.ref_block.style.position = position;
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
