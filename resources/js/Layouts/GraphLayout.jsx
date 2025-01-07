import { GraphProvider } from "@/Context/GraphContext";
import AppLayout from "@/Layouts/AppLayout";

export default function GraphLayout({ ...props }) {
    return (
        <GraphProvider>
            <AppLayout {...props}/>
        </GraphProvider>
    );
}