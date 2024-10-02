import React from 'react'

export default function GrButtons({ variant, children }) {
    let gradientClass = '';

    switch (variant) {
        case 'PurpleToBlue':
            gradientClass = 'from-purple-600 to-blue-500';
            break;
        case 'CyanToBlue':
            gradientClass = 'from-cyan-500 to-blue-500';
            break;
        case 'GreenToBlue':
            gradientClass = 'from-green-400 to-blue-600';
            break;
        case 'PurpleToPink':
            gradientClass = 'from-purple-500 to-pink-500';
            break;
        case 'PinkToOrange':
            gradientClass = 'from-pink-500 to-orange-400';
            break;
        case 'TealToLime':
            gradientClass = 'from-teal-300 to-lime-300';
            break;
        case 'RedTocaribbeangreen':
            gradientClass = 'from-red-200 via-red-300 to-caribbeangreen-200';
            break;
        default:
            gradientClass = 'from-purple-600 to-blue-500';
    }

    return (
        <div>
            <button
                className={`relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br ${gradientClass} group-hover:${gradientClass} hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800`}
            >
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                    {children}
                </span>
            </button>
        </div>
    );
}
