export default function IconBtn({
    text,
    onclick,
    children,
    disabled = false,
    outline = false,
    customClasses = '',
    type = 'button',
}) {
    return (
        <button
            disabled={disabled}
            onClick={onclick}
            className={`flex items-center justify-center outline-none 
                ${outline ? "border border-caribbeangreen-50 bg-transparent" : "bg-caribbeangreen-50"}
                gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 
                hover:bg-black hover:text-caribbeangreen-50 duration-300 
                ${disabled ? 'cursor-not-allowed bg-caribbeangreen-50 text-black' : customClasses}`}
            type={type}
        >
            {/* If children exist, render text and children */}
            {children ? (
                <>
                    <span className={`${outline ? "text-caribbeangreen-50" : ""}`}>
                        {text}
                    </span>
                    {children}
                </>
            ) : (
                // If no children, just render the text
                text
            )}
        </button>
    );
}
