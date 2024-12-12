export async function loader({params}) {
    const data = await import("/public/miserables.json");
    const miserables = data.miserables;
    const node = miserables.nodes.find(n => n.id === params.id);
    return { node };
}