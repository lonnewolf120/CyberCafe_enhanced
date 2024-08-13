import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import "./Modal.css";

const Modal = ({ open, onClose, children }) => {
  // console.log("Modal children: ", children);
  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-center overflow-y-auto 
        overflow-x-hidden ${open ? "visible" : "invisible"}`}
      aria-hidden={!open}
    >
      <div
        className="relative p-4 w-full max-w-md max-h-full"
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative bg-gradient-to-r from-richblack-400 to-richblack-700 rounded-lg shadow"
        >
          <div
            className="flex items-center justify-between p-4 md:p-5 border-b
           rounded-t border-gray-200 dark:border-gray-600"
          >
            {/* title here */}
            <div className="text-xl font-semibold text-gray-900 dark:text-white">
              {children?.props?.children[0]} 
            </div>
            {/* close button */}
            <button
              type="button"
              className="end-2.5 text-richblue-300 hover:bg-gray-200 hover:text-pink-300 rounded-lg
               text-sm w-8 h-8 ms-auto inline-flex justify-center items-center 
               dark:hover:bg-gray-600 dark:hover:text-pink-500 bg-pink-50"
              onClick={onClose}
            >
              <AiOutlineClose className="w-3 h-3" />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* children here */}
          <div className="p-2 md:p-2">
            {children &&
              children.props.children.map((child, index) => {
                if (index === 0) 
                    return <div key={index}></div>;
                else if (index === 3) 
                    return <div key={index} className="flex justify-center items-center p-2">{child}</div>;
                else {
                  return (
                    <div key={index} className="p-2" id="modal-content">
                      {child}
                    </div>
                  );
                }
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
