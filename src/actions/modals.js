'use strict';

export function openModal(modal) {
  return {
    type: 'OPEN_MODAL',
    modal_type: modal.type,
    replace: modal.replace || false,
    data: modal.data || {},
    style: modal.style === 'minimal' ? 'minimal' : 'normal',
  };
}

export function closeModal(modal_type) {
  return {
    type: 'CLOSE_MODAL',
    modal_type,
  };
}
