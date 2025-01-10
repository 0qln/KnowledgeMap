export default function GraphFilterLayout({ children }) {
    return (
        <div className="max-w-[40vw] flex-shrink dark:bg-gray-800 m-4 p-4 rounded-md">
            {children}
        </div>
    );
}