import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import "./Modal.css"; // Ensure the CSS file contains required animations

const Modal = ({ open, onClose, children }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-center overflow-y-auto 
        overflow-x-hidden transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      aria-hidden={!open}
    >
      <div
        className="relative w-full max-w-lg max-h-full p-6"
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative rounded-xl shadow-lg bg-black dark:bg-gray-900 p-6 
          ring-1 ring-gray-700"
        >
          {/* Header with title and close button */}
          <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2">
            <div className="text-2xl font-semibold text-white">
              {children?.props?.children[0]} 
            </div>
            <button
              type="button"
              className="text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg 
              p-2 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
              onClick={onClose}
            >
              <AiOutlineClose className="w-5 h-5" />
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          {/* Modal content */}
          <div className="space-y-4">
            {children &&
              children.props.children.map((child, index) => {
                if (index === 0) return <div key={index}></div>;
                if (index === 3)
                  return (
                    <div
                      key={index}
                      className="flex justify-center items-center p-4 bg-gray-700 rounded-lg"
                    >
                      {child}
                    </div>
                  );
                return (
                  <div key={index} className="p-4 text-white">
                    {child}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
