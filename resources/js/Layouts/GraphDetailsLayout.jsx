export default function GraphDetailsLayout({ children, overflow = false }) {
    return (
        <div className={`max-w-[30vw] flex-grow dark:bg-gray-800 m-4 p-4 rounded-md shadow-2xl max-h-[80vh] block ${overflow ? 'overflow-show' : 'overflow-auto'}`}>
            {children}
        </div>
    );
}