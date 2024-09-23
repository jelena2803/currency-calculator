import React, { useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";

function Modal({ title, text, confirmText, show, onClose, onConfirm }) {
  return (
    <MDBModal open={show} onClose={onClose} tabIndex="-1">
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>{title}</MDBModalTitle>
            <MDBBtn
              className="btn-close"
              color="none"
              onClick={onClose}
            ></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>{text}</MDBModalBody>

          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={onClose}>
              Close
            </MDBBtn>
            <MDBBtn onClick={onConfirm}>{confirmText}</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}

export default Modal;
