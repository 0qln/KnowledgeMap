export default function GraphDetailsLayout({ children }) {
    return (
        <div className="mw-[40vw] flex-grow dark:bg-gray-800 m-4 p-4 rounded-md shadow-2xl">
            {children}
        </div>
    );
}