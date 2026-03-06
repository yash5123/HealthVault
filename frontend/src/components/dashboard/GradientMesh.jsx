import { useEffect } from "react";

export default function GradientMesh() {

  useEffect(() => {

    const mesh = document.createElement("div");
    mesh.className = "gradient-mesh";

    document.body.appendChild(mesh);

    return () => mesh.remove();

  }, []);

  return null;
}