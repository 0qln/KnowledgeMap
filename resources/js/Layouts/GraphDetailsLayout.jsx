export default function GraphDetailsLayout({ children }) {
    return (
        <div className="max-w-[30vw] flex-grow dark:bg-gray-800 m-4 p-4 rounded-md shadow-2xl max-h-[80vh] overflow-auto">
            {children}
        </div>
    );
}