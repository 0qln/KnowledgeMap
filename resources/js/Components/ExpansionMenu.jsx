import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const ExpansionMenuContext = createContext();

const ExpansionMenu = ({ children, multiple = false, defaultOpen = null }) => {
    const [openOptions, setOpenOptions] = useState(defaultOpen !== null ? defaultOpen : multiple ? [] : null);

    const toggleOpen = (option) => {
        if (multiple) {
            setOpenOptions((prevOptions) =>
                prevOptions.includes(option)
                    ? prevOptions.filter((id) => id !== option)
                    : [...prevOptions, option]
            );
        } else {
            setOpenOptions((prevOption) => (prevOption === option ? null : option));
        }
    };

    const isOpen = (option) => {
        return multiple ? openOptions.includes(option) : openOptions === option;
    };

    return (
        <ExpansionMenuContext.Provider value={{ isOpen, toggleOpen }}>
            <div className="relative">{children}</div>
        </ExpansionMenuContext.Provider>
    );
};

const Option = ({ children, className="mb-2" }) => {
    return (
        <div className={className}>
            {children}
        </div>
    );
};

const Trigger = ({ children, id }) => {
    const { isOpen, toggleOpen } = useContext(ExpansionMenuContext);

    const handleClick = () => {
        toggleOpen(id);
    };

    return (
        <div onClick={handleClick} className="cursor-pointer">
            {typeof children === 'function' ? children({ isOpen: isOpen(id) }) : children}
        </div>
    );
};

const Content = ({ children, id, className="p-4 rounded-md ring-1 ring-black ring-opacity-5" }) => {
    const { isOpen } = useContext(ExpansionMenuContext);
    const contentRef = useRef(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (contentRef.current) {
            setHeight(isOpen(id) ? contentRef.current.scrollHeight : 0);
        }
    }, [id, isOpen]);

    return (
        <div
            className="transition-all ease-in-out duration-300 overflow-hidden"
            style={{ maxHeight: `${height}px` }}
            ref={contentRef}
        >
            <div className={className}>
                {children}
            </div>
        </div>
    );
};

Option.Trigger = Trigger;
Option.Content = Content;

ExpansionMenu.Option = Option;

export default ExpansionMenu;
