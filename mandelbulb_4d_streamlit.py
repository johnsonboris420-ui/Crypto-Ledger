"""
4D Mandelbulb Explorer - Streamlit Web App
With smooth μ coloring + real triangulated mesh export
"""

import streamlit as st
import numpy as np
import matplotlib.pyplot as plt
import math
import os

st.set_page_config(page_title="4D Mandelbulb Explorer", layout="wide", page_icon="🌌")
st.title("🌌 4D Mandelbulb Explorer")
st.markdown("**Raymarched with Smooth μ • Real Mesh Export • Quantum Timelapse**")

# ====================== CORE 4D MANDELBULB ======================
def mandelbulb_4d_power(p, n=8, max_iter=50, bailout=4.0):
    cx, cy, cz, cw = p
    x = y = z = w = 0.0
    for i in range(max_iter):
        r_xy = math.hypot(x, y)
        r_xyz = math.hypot(r_xy, z)
        r = math.hypot(r_xyz, w)

        if r > bailout:
            log_r = math.log(max(r, 1e-10))
            log_b = math.log(bailout)
            return i + 1.0 - math.log(log_r / log_b) / math.log(n)

        if r == 0.0:
            phi = theta = psi = 0.0
        else:
            phi = math.atan2(y, x)
            theta = math.atan2(z, r_xy)
            psi = math.atan2(w, r_xyz)

        r_new = r ** n
        phi_new = n * phi
        theta_new = n * theta
        psi_new = n * psi

        cos_psi, sin_psi = math.cos(psi_new), math.sin(psi_new)
        cos_theta, sin_theta = math.cos(theta_new), math.sin(theta_new)
        cos_phi, sin_phi = math.cos(phi_new), math.sin(phi_new)

        x = r_new * cos_psi * cos_theta * cos_phi + cx
        y = r_new * cos_psi * cos_theta * sin_phi + cy
        z = r_new * cos_psi * sin_theta + cz
        w = r_new * sin_psi + cw

    return float(max_iter)


def distance_estimator(p, n=8, steps=12, bailout=4.0):
    return mandelbulb_4d_power(p, n, steps, bailout) * 0.5 / (steps + 1)


# ====================== RAYMARCHED VIEW ======================
def render_raymarched_view(power=8, max_iter=50, res=350, w_slice=0.0, bound=1.5):
    x = np.linspace(-bound, bound, res)
    y = np.linspace(-bound, bound, res)
    X, Y = np.meshgrid(x, y)

    mu_map = np.full_like(X, float(max_iter), dtype=float)

    for i in range(res):
        for j in range(res):
            pos = np.array([X[i, j], Y[i, j], 0.0, w_slice], dtype=float)
            t = 0.0

            for _ in range(100):
                mu = mandelbulb_4d_power(pos, power, max_iter, 4.0)

                if mu < max_iter:
                    mu_map[i, j] = mu
                    break

                d = distance_estimator(pos, power, steps=12)
                if d < 0.001:
                    mu_map[i, j] = 0.0
                    break

                t += max(d, 0.001)
                pos[2] = t - bound

            else:
                mu_map[i, j] = float(max_iter)

    fig, ax = plt.subplots(figsize=(13.5, 10), facecolor="#0a0a0a")
    mu_norm = np.clip(mu_map, 0, max_iter * 0.85)

    img = ax.imshow(mu_norm, cmap='inferno', extent=[-bound, bound, -bound, bound],
                    origin='lower', interpolation='bilinear')

    ax.set_title(f"4D Mandelbulb • Raymarched with Smooth μ\n"
                 f"Power = {power:.1f}  |  w = {w_slice:.3f}  |  Max Iter = {max_iter}",
                 color="white", fontsize=16, pad=30)

    ax.set_xlabel("X", color="white")
    ax.set_ylabel("Y", color="white")
    ax.tick_params(colors="white")

    cbar = plt.colorbar(img, ax=ax, label="Smooth Escape Time μ")
    cbar.ax.yaxis.set_tick_params(color="white")
    cbar.outline.set_edgecolor("white")

    ax.set_facecolor("#0a0a0a")
    fig.patch.set_facecolor("#0a0a0a")

    return fig


# ====================== REAL MESH EXPORT ======================
def export_surface_to_obj(power=8, res=50, w_slice=0.0, bound=1.5, filename="mandelbulb_4d_mesh.obj"):
    """
    Exports a real triangulated mesh of the 4D Mandelbulb slice at given w_slice.
    Uses a reliable voxel-face method → solid, connected triangles for Blender.
    """
    step = bound * 2.0 / res
    vertices = []
    faces = []
    vmap = {}          # (i, j, k) -> vertex index (0-based)
    vidx = 0

    # Step 1: Collect all inside vertices
    for i in range(res + 1):
        x = -bound + i * step
        for j in range(res + 1):
            y = -bound + j * step
            for k in range(res + 1):
                z = -bound + k * step
                if mandelbulb_4d_power((x, y, z, w_slice), power, 15) >= 15:
                    vmap[(i, j, k)] = vidx
                    vertices.append((x, y, z))
                    vidx += 1

    if len(vertices) < 4:
        return None

    # Step 2: Generate triangles for boundary faces (6 directions)
    for i in range(res):
        for j in range(res):
            for k in range(res):
                if (i, j, k) not in vmap:
                    continue

                v0 = vmap[(i, j, k)] + 1   # OBJ indices start at 1

                # +X direction
                if (i + 1, j, k) not in vmap:
                    v1 = vmap.get((i, j + 1, k), v0) + 1
                    v2 = vmap.get((i, j, k + 1), v0) + 1
                    v3 = vmap.get((i, j + 1, k + 1), v0) + 1
                    faces.append((v0, v1, v2))
                    faces.append((v1, v3, v2))

                # -X direction
                if i > 0 and (i - 1, j, k) not in vmap:
                    v1 = vmap.get((i, j + 1, k), v0) + 1
                    v2 = vmap.get((i, j, k + 1), v0) + 1
                    v3 = vmap.get((i, j + 1, k + 1), v0) + 1
                    faces.append((v0, v2, v1))
                    faces.append((v2, v3, v1))

                # +Y direction
                if (i, j + 1, k) not in vmap:
                    v1 = vmap.get((i + 1, j, k), v0) + 1
                    v2 = vmap.get((i, j, k + 1), v0) + 1
                    v3 = vmap.get((i + 1, j, k + 1), v0) + 1
                    faces.append((v0, v1, v2))
                    faces.append((v1, v3, v2))

                # -Y direction
                if j > 0 and (i, j - 1, k) not in vmap:
                    v1 = vmap.get((i + 1, j, k), v0) + 1
                    v2 = vmap.get((i, j, k + 1), v0) + 1
                    v3 = vmap.get((i + 1, j, k + 1), v0) + 1
                    faces.append((v0, v2, v1))
                    faces.append((v2, v3, v1))

                # +Z direction
                if (i, j, k + 1) not in vmap:
                    v1 = vmap.get((i + 1, j, k), v0) + 1
                    v2 = vmap.get((i, j + 1, k), v0) + 1
                    v3 = vmap.get((i + 1, j + 1, k), v0) + 1
                    faces.append((v0, v1, v2))
                    faces.append((v1, v3, v2))

                # -Z direction
                if k > 0 and (i, j, k - 1) not in vmap:
                    v1 = vmap.get((i + 1, j, k), v0) + 1
                    v2 = vmap.get((i, j + 1, k), v0) + 1
                    v3 = vmap.get((i + 1, j + 1, k), v0) + 1
                    faces.append((v0, v2, v1))
                    faces.append((v2, v3, v1))

    # Write OBJ file
    with open(filename, "w") as f:
        f.write("# 4D Mandelbulb - Real triangulated mesh export\n")
        f.write(f"# Power={power} | w={w_slice:.4f} | Vertices={len(vertices)} | Triangles={len(faces)}\n\n")

        for v in vertices:
            f.write(f"v {v[0]:.6f} {v[1]:.6f} {v[2]:.6f}\n")

        f.write("\n")
        for face in faces:
            if len(face) == 3:
                f.write(f"f {face[0]} {face[1]} {face[2]}\n")

    return filename


# ====================== STREAMLIT UI ======================
col1, col2 = st.columns([1, 2])

with col1:
    st.subheader("Controls")
    power = st.slider("Power (n)", 2.0, 20.0, 8.0, 0.1)
    w_slice = st.slider("W-Slice (4th dimension)", -1.5, 1.5, 0.0, 0.01)
    bound = st.slider("Bounds", 0.5, 3.0, 1.5, 0.1)
    resolution = st.slider("Render Resolution", 100, 600, 350)

    if st.button("🚀 Render Raymarched View", type="primary"):
        with st.spinner("Raymarching..."):
            fig = render_raymarched_view(power, 50, resolution, w_slice, bound)
            st.pyplot(fig)

    if st.button("💾 Export as Real Mesh OBJ for Blender", type="primary"):
        with st.spinner("Generating triangulated mesh..."):
            fname = f"mandelbulb_4d_mesh_w{w_slice:.2f}_p{int(power)}.obj"
            mesh_res = max(25, resolution // 10)
            path = export_surface_to_obj(power, mesh_res, w_slice, bound, fname)
            if path and os.path.exists(path):
                with open(path, "rb") as f:
                    st.download_button("⬇️ Download Real Mesh .obj", f, file_name=fname)
                st.success("✅ Real mesh OBJ exported! Open in Blender.")
            else:
                st.error("❌ No surface points found")

    if st.button("🌌 Generate Quantum Timelapse Frames"):
        os.makedirs("mandelbulb_frames", exist_ok=True)
        with st.spinner("Generating 8 frames..."):
            for i in range(8):
                ws = -1.2 + i * 0.3
                fig = render_raymarched_view(power, 40, resolution//2, ws, bound)
                fig.savefig(f"mandelbulb_frames/cycle_{i:04d}.png", facecolor="#0a0a0a")
                plt.close(fig)
        st.success("8 frames saved to mandelbulb_frames/ folder!")

with col2:
    st.info("👈 Adjust parameters on the left.\n\n"
            "• Raymarched view uses smooth μ for beautiful gradients\n"
            "• Mesh export creates real triangles for Blender")

st.caption("Pure Python 4D hyperspherical Mandelbulb | Smooth μ coloring | Real mesh export")
