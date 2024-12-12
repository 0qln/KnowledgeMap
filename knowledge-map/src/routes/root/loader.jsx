export async function loader() {
    const data = await import("/public/miserables.json");
    const miserables = data.miserables;
    return { miserables }
}