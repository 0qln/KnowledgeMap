import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const ExpansionMenuContext = createContext();

const ExpansionMenu = ({ children }) => {
    const [openOption, setOpenOption] = useState(null);

    let counter = 0;
    const registerOption = () => {
        const id = counter;
        counter += 1;
        return id;
    };

    const toggleOpen = (option) => {
        setOpenOption((prevOption) => (prevOption === option ? null : option));
    };

    return (
        <ExpansionMenuContext.Provider value={{ openOption, toggleOpen, registerOption }}>
            <div className="relative">{children}</div>
        </ExpansionMenuContext.Provider>
    );
};

const Option = ({ children }) => {
    const { registerOption } = useContext(ExpansionMenuContext);
    const id = registerOption();

    return (
        <div className="mb-2">
            {React.Children.map(children, (child) =>
                React.cloneElement(child, { id })
            )}
        </div>
    );
};

const Trigger = ({ children, id }) => {
    const { toggleOpen } = useContext(ExpansionMenuContext);

    const handleClick = () => {
        toggleOpen(id);
    };

    return (
        <div onClick={handleClick} className="cursor-pointer">
            {children}
        </div>
    );
};

const Content = ({ children, id }) => {
    const { openOption } = useContext(ExpansionMenuContext);
    const contentRef = useRef(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (contentRef.current) {
            setHeight(openOption === id ? contentRef.current.scrollHeight : 0);
        }
    }, [openOption, id]);

    return (
        <div
            className="transition-all ease-in-out duration-500 overflow-hidden"
            style={{ height: `${height}px` }}
            ref={contentRef}
        >
            <div className="p-4 rounded-md ring-1 ring-black ring-opacity-5">
                {children}
            </div>
        </div>
    );
};

Option.Trigger = Trigger;
Option.Content = Content;

ExpansionMenu.Option = Option;

export default ExpansionMenu;
