import { useContext } from "react";
import { GraphContext } from "../Context/GraphContext";


export const useGraph = () => useContext(GraphContext);
