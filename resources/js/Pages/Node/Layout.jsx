import { GraphProvider } from "@/Context/GraphContext";
import AppLayout from "@/Layouts/AppLayout";

export default function Layout({ children }) {
    return (
        <GraphProvider>
            <AppLayout childrenRight={
                <div className="w-[40vw] dark:bg-gray-800 m-4 p-4 rounded-md">
                    {children}
                </div>
            }>
            </AppLayout>
        </GraphProvider>
    );
}