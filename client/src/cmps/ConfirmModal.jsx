import React, { Component, useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group'
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

export const ConfirmModal = ({ title, type, id, arg, close, deleteFunc }) => {
  const [mounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])
  const modalRoot = document.getElementById('modal-root')
  const modalTemplate = <div className="modal-wrapper" onClick={() => setIsMounted(false)}>
    <CSSTransition in={mounted} classNames="fade" timeout={200} onExited={close}>
      <div className="modal-content" onClick={ev => ev.stopPropagation()}>
        <h3>{`Are you sure You want to delete this ${type}?`}</h3>
        <p>{`(${title})`}</p>
        <div className="btn-confirm">
          <Button
            onClick={() => {
              setIsMounted(false)
              deleteFunc(id, arg)
            }}
            variant="contained"
            color="secondary"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
          <Button
            onClick={() => setIsMounted(false)}
            variant="contained"
            color="default"
          >
            Cancel
          </Button>

        </div>
      </div>
    </CSSTransition>
  </div>

  return ReactDOM.createPortal(modalTemplate, modalRoot)
}
