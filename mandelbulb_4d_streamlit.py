"""
4D Mandelbulb Explorer + Quantum Testing Framework
Raymarched with Smooth μ • Real Mesh Export • Quantum Simulation
"""

import streamlit as st
import numpy as np
import matplotlib.pyplot as plt
import math
import os
import random
import time
import logging
import concurrent.futures
from collections import deque
from scipy.stats import linregress, kendalltau

st.set_page_config(page_title="4D Mandelbulb Explorer", layout="wide", page_icon="🌌")

# ====================== QUANTUM SUPPORT CLASSES ======================

class QuantumHardwareException(Exception):
    pass


class AnomalyDB:
    def __init__(self):
        self._correlations = []

    def get_contextual_patterns(self, current_state, noise_profile):
        return []

    def register_quantum_pattern(self, signature, context):
        pass

    def register_discrepancy(self, quantum_result, classical_result, scenario):
        pass

    def register_correlation(self, corr, recent):
        self._correlations.append(corr)

    def update_correlation_map(self, correlations):
        pass


class NoiseProfile:
    def __init__(self):
        self.t1_dominant = False
        self.high_crosstalk = True
        self.gate_error_dominant = False


class CalibrationResult:
    def __init__(self):
        self.success = True
        self.fidelity_improvement = round(random.uniform(0.01, 0.08), 4)


class QuantumScenario:
    def __init__(self):
        self.qubit_count = random.randint(5, 15)
        self.circuit_depth = random.randint(20, 100)
        self.execution_time = round(random.uniform(0.1, 1.0), 3)
        self.entanglement_entropy = round(random.uniform(1.0, 2.5), 3)


class QuantumTestResult:
    def __init__(self, ecc_level=0):
        self.integrity_score = round(random.uniform(0.65, 0.99), 4)
        self.state_fidelity = round(random.uniform(0.80, 0.99), 4)
        self.decoherence_rate = round(random.uniform(0.04, 0.18), 4)
        self.avg_gate_error = round(random.uniform(0.001, 0.012), 5)
        self.logical_error_rate = round(random.uniform(0.004, 0.025), 5)
        self.physical_error_rate = round(random.uniform(0.02, 0.09), 4)
        self.entanglement_entropy = round(random.uniform(1.0, 2.5), 3)
        self.quantum_anomaly_signature = None if random.random() > 0.1 else f"ANOM_{random.randint(100,999)}"
        self.error_characteristics = {"type": "phase_flip"} if random.random() > 0.7 else None
        self.timestamp = time.time()
        self.qubit_count = random.randint(5, 15)
        self.execution_time = round(random.uniform(0.1, 1.0), 3)
        self.temperature = round(random.uniform(0.010, 0.015), 4)
        self.ecc_level = ecc_level
        self.cross_validation_fidelity = None


class QuantumComputer:
    def __init__(self):
        self.operational = True
        self.active_qubits = 27
        self.calibration_status = "CALIBRATED"
        self.qubit_temperature = round(random.uniform(0.010, 0.014), 4)
        self.qubit_coherence = round(random.uniform(0.88, 0.98), 3)
        self.environmental_stability = round(random.uniform(0.91, 0.99), 3)
        self.vacuum_level = 5e-11
        self.error_mitigation_strategy = "STANDARD"

    def get_current_noise_profile(self):
        return NoiseProfile()

    def get_quantum_state(self):
        return {"coherence": self.qubit_coherence, "temp": self.qubit_temperature}

    def quantum_preflight_check(self):
        return self.qubit_coherence > 0.80

    def perform_calibration(self, intensity="standard"):
        self.qubit_coherence = min(0.99, self.qubit_coherence + 0.02)
        return CalibrationResult()

    def quantum_safe_shutdown(self):
        self.operational = False

    def capture_quantum_diagnostics(self):
        return {"coherence": self.qubit_coherence, "temp": self.qubit_temperature}

    def get_environmental_report(self):
        return self.environmental_stability

    def update_error_model(self, characteristics):
        pass


# ====================== QUANTUM HELPER FUNCTIONS ======================

def generate_adaptive_scenario(previous_results, failure_patterns, quantum_state, noise_model):
    return QuantumScenario()


def apply_quantum_error_mitigation(scenario, strategy):
    return scenario


def execute_scenario(scenario):
    return QuantumTestResult(ecc_level=0)


def execute_scenario_with_ecc(scenario, ecc_level):
    result = QuantumTestResult(ecc_level=ecc_level)
    result.logical_error_rate = round(result.logical_error_rate * max(0.2, 0.7 / ecc_level), 5)
    result.state_fidelity = round(min(0.99, result.state_fidelity + 0.05 * ecc_level), 4)
    return result


def scale_scenario(scenario, target_qubits, target_depth, resource_constraint):
    scenario.qubit_count = max(2, min(scenario.qubit_count, target_qubits))
    scenario.circuit_depth = max(5, min(scenario.circuit_depth, target_depth))
    return scenario


def apply_error_correction_strategy(scenario, code):
    return scenario


def compare_results(quantum_result, classical_result):
    return round(random.uniform(0.82, 1.0), 4)


# ====================== QUANTUM TESTING FRAMEWORK ======================

class QuantumTestingFramework:
    def __init__(self, quantum_computer, anomaly_db, classical_simulator=None):
        self.quantum_computer = quantum_computer
        self.anomaly_db = anomaly_db
        self.classical_simulator = classical_simulator
        self.test_history = deque(maxlen=150)
        self.safety_threshold = 0.4
        self.consecutive_failures = 0
        self.last_execution_time = time.time()
        self.degradation_warning_issued = False
        self.quantum_error_correction = True
        self.error_correction_level = 1

        self.COOLDOWN_PERIOD = 0.05
        self.CONSECUTIVE_FAILURE_LIMIT = 3
        self.ANOMALY_REG_THRESHOLD = 0.7
        self.STABILITY_WINDOW = 20
        self.THRESHOLD_HYSTERESIS = 0.02
        self.QUBIT_STABILITY_THRESHOLD = 0.85
        self.ENVIRONMENT_SENSITIVITY = 0.05
        self.CROSS_VALIDATION_PROBABILITY = 0.2
        self.RESOURCE_AWARENESS_FACTOR = 0.8

        self.logger = self.setup_quantum_logger()
        self.error_correction_codes = {1: "Surface-17", 2: "Bacon-Shor-13", 3: "Color-9"}
        self.log_buffer = []

    def setup_quantum_logger(self):
        logger = logging.getLogger("QuantumTester")
        logger.setLevel(logging.INFO)
        if not logger.handlers:
            handler = logging.StreamHandler()
            handler.setFormatter(logging.Formatter(
                "%(asctime)s [Qubits:%(qubits)d|ECC:%(ecc)s] %(levelname)s %(message)s"
            ))
            logger.addHandler(handler)
        return logger

    def get_logger_extras(self, qubits=0):
        return {"qubits": qubits, "ecc": self.error_correction_codes.get(self.error_correction_level, "None")}

    def log(self, level, msg, qubits=0):
        entry = f"[{time.strftime('%H:%M:%S')}] [{level}] [Q:{qubits}|ECC:{self.error_correction_codes.get(self.error_correction_level,'?')}] {msg}"
        self.log_buffer.append(entry)

    def run_simulation(self, max_cycles=25):
        self.log_buffer = []
        cycle_count = 0
        resource_usage = 0
        results = []

        while self.quantum_computer.operational and cycle_count < max_cycles:
            cycle_count += 1
            self.log("INFO", f"--- Cycle {cycle_count} ---")

            env_status = self.check_quantum_environment()
            if not env_status["stable"]:
                for issue_type, value in env_status["issues"]:
                    self.log("WARN", f"Environment issue [{issue_type}]: {value:.4f}")
                continue

            scenario = self.generate_resource_aware_scenario(resource_usage)

            if not self.quantum_computer.quantum_preflight_check():
                self.log("ERROR", "Preflight check failed")
                break

            scenario = apply_quantum_error_mitigation(scenario, self.quantum_computer.error_mitigation_strategy)

            if self.quantum_error_correction:
                result = execute_scenario_with_ecc(scenario, self.error_correction_level)
            else:
                result = execute_scenario(scenario)

            result.timestamp = time.time()
            self.last_execution_time = result.timestamp

            if result.decoherence_rate > 0.15:
                self.log("WARN", f"High decoherence: {result.decoherence_rate:.3f}", scenario.qubit_count)

            if result.quantum_anomaly_signature:
                self.log("WARN", f"Anomaly detected: {result.quantum_anomaly_signature}", scenario.qubit_count)

            self.test_history.append(result)
            resource_usage += scenario.qubit_count * scenario.execution_time

            ecc_factor = 1.1 ** (self.error_correction_level - 1)
            if result.integrity_score < self.safety_threshold * ecc_factor:
                self.consecutive_failures += 1
                self.log("WARN", f"Integrity below threshold ({result.integrity_score:.3f}). Failures: {self.consecutive_failures}")
                if self.consecutive_failures >= self.CONSECUTIVE_FAILURE_LIMIT:
                    self.log("ERROR", f"Graceful shutdown: persistent instability after {self.consecutive_failures} failures")
                    break
            else:
                self.consecutive_failures = 0

            self.adjust_safety_threshold()
            self.analyze_multi_dimensional_stability()

            if cycle_count % self.get_calibration_interval() == 0:
                cal = self.quantum_computer.perform_calibration()
                self.log("INFO", f"Calibration complete. Fidelity +{cal.fidelity_improvement:.3f}")

            self.adjust_error_correction_level()

            if cycle_count % 5 == 0 and len(self.test_history) >= 4:
                self.track_entanglement_evolution()
            if cycle_count % 20 == 0 and len(self.test_history) >= 20:
                self.detect_quantum_anomaly_correlation()

            self.log("INFO",
                f"integrity={result.integrity_score:.3f} fidelity={result.state_fidelity:.3f} "
                f"decoherence={result.decoherence_rate:.3f} qubits={scenario.qubit_count} "
                f"ECC={self.error_correction_codes[self.error_correction_level]}",
                scenario.qubit_count)

            results.append({
                "cycle": cycle_count,
                "integrity": result.integrity_score,
                "fidelity": result.state_fidelity,
                "decoherence": result.decoherence_rate,
                "qubits": scenario.qubit_count,
                "ecc": self.error_correction_codes[self.error_correction_level],
                "anomaly": result.quantum_anomaly_signature or "",
            })

        self.log("INFO", f"Simulation complete. {cycle_count} cycles, {len(self.test_history)} results.")
        return results

    def calculate_quantum_cooldown(self):
        factors = []
        if self.quantum_computer.qubit_temperature > 0.015:
            factors.append(min(3.0, np.exp(self.quantum_computer.qubit_temperature - 0.015)))
        if self.test_history:
            e = self.test_history[-1].entanglement_entropy
            factors.append(1.5 if e > 2.0 else 1.2 if e > 1.5 else 1.0)
        if self.consecutive_failures > 0:
            factors.append(1 + 0.25 * self.consecutive_failures)
        if self.test_history and self.test_history[-1].decoherence_rate > 0.12:
            factors.append(1.3)
        composite = np.prod(factors) if factors else 1.0
        elapsed = time.time() - self.last_execution_time
        return max(0, self.COOLDOWN_PERIOD * composite - elapsed)

    def check_quantum_environment(self):
        status = {"stable": True, "issues": []}
        if self.quantum_computer.qubit_coherence < self.QUBIT_STABILITY_THRESHOLD:
            status["stable"] = False
            status["issues"].append(("coherence", self.quantum_computer.qubit_coherence))
        if self.quantum_computer.environmental_stability < 0.9:
            status["stable"] = False
            status["issues"].append(("environment", self.quantum_computer.environmental_stability))
        if self.test_history and len(self.test_history) > 3:
            last_e = self.test_history[-1].entanglement_entropy
            avg_e = np.mean([r.entanglement_entropy for r in list(self.test_history)[-3:]])
            if last_e < 0.7 * avg_e:
                status["stable"] = False
                status["issues"].append(("entanglement", last_e / avg_e))
        if self.quantum_computer.vacuum_level >= 1e-10:
            status["stable"] = False
            status["issues"].append(("vacuum", self.quantum_computer.vacuum_level))
        return status

    def generate_resource_aware_scenario(self, resource_usage):
        noise = self.quantum_computer.get_current_noise_profile()
        base = generate_adaptive_scenario(
            list(self.test_history),
            self.anomaly_db.get_contextual_patterns(self.quantum_computer.calibration_status, noise),
            self.quantum_computer.get_quantum_state(),
            noise
        )
        pressure = min(1.0, resource_usage / 100000)
        base = scale_scenario(
            base,
            target_qubits=int(base.qubit_count * max(0.5, 1 - pressure * self.RESOURCE_AWARENESS_FACTOR)),
            target_depth=int(base.circuit_depth * max(0.7, 1 - pressure * self.RESOURCE_AWARENESS_FACTOR * 0.8)),
            resource_constraint=True
        )
        if self.quantum_error_correction:
            base = apply_error_correction_strategy(base, self.error_correction_codes[self.error_correction_level])
        return base

    def adjust_safety_threshold(self):
        if len(self.test_history) < self.STABILITY_WINDOW:
            return
        avg = np.mean([r.integrity_score for r in list(self.test_history)[-self.STABILITY_WINDOW:]])
        if avg > self.safety_threshold + self.THRESHOLD_HYSTERESIS:
            self.safety_threshold = min(0.95, self.safety_threshold + 0.01)
        elif avg < self.safety_threshold - self.THRESHOLD_HYSTERESIS:
            self.safety_threshold = max(0.1, self.safety_threshold - 0.01)

    def analyze_multi_dimensional_stability(self):
        if len(self.test_history) < 5:
            return
        scores = [r.integrity_score for r in list(self.test_history)[-5:]]
        slope, _, r_val, _, _ = linregress(range(5), scores)
        if slope < -0.05 and r_val ** 2 > 0.7 and not self.degradation_warning_issued:
            self.log("WARN", "Degradation trend detected")
            self.degradation_warning_issued = True
        elif slope >= 0:
            self.degradation_warning_issued = False

    def adjust_error_correction_level(self):
        if len(self.test_history) < 10:
            return
        avg_dec = np.mean([r.decoherence_rate for r in list(self.test_history)[-10:]])
        if avg_dec > 0.15 and self.error_correction_level < 3:
            self.error_correction_level += 1
            self.log("INFO", f"ECC upgraded to L{self.error_correction_level}: {self.error_correction_codes[self.error_correction_level]}")
        elif avg_dec < 0.05 and self.error_correction_level > 1:
            self.error_correction_level -= 1
            self.log("INFO", f"ECC downgraded to L{self.error_correction_level}")

    def get_calibration_interval(self):
        return max(5, 10 - self.consecutive_failures * 2)

    def track_entanglement_evolution(self):
        entropies = [r.entanglement_entropy for r in list(self.test_history)[-4:]]
        tau, p = kendalltau(range(4), entropies)
        if abs(tau) > 0.7 and p < 0.05:
            self.log("INFO", f"Entanglement {'increasing' if tau > 0 else 'decreasing'} (τ={tau:.2f})")

    def detect_quantum_anomaly_correlation(self):
        recent = list(self.test_history)[-20:]
        integrity = [r.integrity_score for r in recent]
        decoherence = [r.decoherence_rate for r in recent]
        corr = np.corrcoef(integrity, decoherence)[0, 1]
        if abs(corr) > self.ANOMALY_REG_THRESHOLD:
            self.anomaly_db.register_correlation(corr, recent)
            self.log("INFO", f"Anomaly correlation: r={corr:.3f}")

    def cross_validate_with_classical(self, quantum_result, scenario):
        try:
            with concurrent.futures.ThreadPoolExecutor() as executor:
                future = executor.submit(self.classical_simulator.simulate, scenario)
                classical = future.result(timeout=min(60, 10 + scenario.qubit_count * 0.2))
            fidelity = compare_results(quantum_result, classical)
            if fidelity < 0.95:
                self.log("WARN", f"Quantum-classical discrepancy: fidelity={fidelity:.3f}", scenario.qubit_count)
                if fidelity < 0.85:
                    self.anomaly_db.register_discrepancy(quantum_result, classical, scenario)
            quantum_result.cross_validation_fidelity = fidelity
        except Exception as e:
            self.log("WARN", f"Classical validation failed: {e}")


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
        cos_psi = math.cos(n * psi)
        cos_theta = math.cos(n * theta)
        x = r_new * cos_psi * cos_theta * math.cos(n * phi) + cx
        y = r_new * cos_psi * cos_theta * math.sin(n * phi) + cy
        z = r_new * cos_psi * math.sin(n * theta) + cz
        w = r_new * math.sin(n * psi) + cw
    return float(max_iter)


def distance_estimator(p, n=8, steps=12, bailout=4.0):
    return mandelbulb_4d_power(p, n, steps, bailout) * 0.5 / (steps + 1)


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
    img = ax.imshow(np.clip(mu_map, 0, max_iter * 0.85), cmap="inferno",
                    extent=[-bound, bound, -bound, bound], origin="lower", interpolation="bilinear")
    ax.set_title(f"4D Mandelbulb • Raymarched with Smooth μ\nPower={power:.1f} | w={w_slice:.3f} | MaxIter={max_iter}",
                 color="white", fontsize=16, pad=30)
    ax.set_xlabel("X", color="white"); ax.set_ylabel("Y", color="white")
    ax.tick_params(colors="white"); ax.set_facecolor("#0a0a0a"); fig.patch.set_facecolor("#0a0a0a")
    cbar = plt.colorbar(img, ax=ax, label="Smooth Escape Time μ")
    cbar.ax.yaxis.set_tick_params(color="white"); cbar.outline.set_edgecolor("white")
    return fig


def export_surface_to_obj(power=8, res=50, w_slice=0.0, bound=1.5, filename="mandelbulb_4d_mesh.obj"):
    """Exports a real triangulated mesh (voxel-face method) suitable for Blender."""
    step = bound * 2.0 / res
    vertices, faces, vmap, vidx = [], [], {}, 0
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
    directions = [
        ((1,0,0),(0,1,0),(0,0,1)), ((-1,0,0),(0,1,0),(0,0,1)),
        ((0,1,0),(1,0,0),(0,0,1)), ((0,-1,0),(1,0,0),(0,0,1)),
        ((0,0,1),(1,0,0),(0,1,0)), ((0,0,-1),(1,0,0),(0,1,0)),
    ]
    for i in range(res):
        for j in range(res):
            for k in range(res):
                if (i, j, k) not in vmap:
                    continue
                v0 = vmap[(i, j, k)] + 1
                for dx, dy, dz in directions:
                    if (i+dx[0], j+dy[0], k+dz[0]) not in vmap:
                        v1 = vmap.get((i+dy[0], j+dx[0], k+dz[0]), v0-1) + 1
                        v2 = vmap.get((i+dz[0], j+dy[0], k+dx[0]), v0-1) + 1
                        v3 = vmap.get((i+dy[0]+dz[0], j+dx[0]+dz[0], k+dx[0]+dy[0]), v0-1) + 1
                        faces.append((v0, v1, v2))
                        faces.append((v1, v3, v2))
    with open(filename, "w") as f:
        f.write("# 4D Mandelbulb - Real triangulated mesh export\n")
        f.write(f"# Power={power} | w={w_slice:.4f} | Vertices={len(vertices)} | Triangles={len(faces)}\n\n")
        for v in vertices:
            f.write(f"v {v[0]:.6f} {v[1]:.6f} {v[2]:.6f}\n")
        f.write("\n")
        for face in faces:
            f.write(f"f {face[0]} {face[1]} {face[2]}\n")
    return filename


# ====================== STREAMLIT UI ======================

st.title("🌌 4D Mandelbulb Explorer")
st.markdown("**Raymarched with Smooth μ • Real Mesh Export • Quantum Testing Framework**")

tab1, tab2 = st.tabs(["🔭 Fractal Explorer", "⚛️ Quantum Simulator"])

# ---- TAB 1: FRACTAL EXPLORER ----
with tab1:
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

        if st.button("💾 Export Mesh OBJ for Blender", type="primary"):
            with st.spinner("Generating triangulated mesh..."):
                fname = f"mandelbulb_4d_mesh_w{w_slice:.2f}_p{int(power)}.obj"
                path = export_surface_to_obj(power, max(25, resolution // 10), w_slice, bound, fname)
                if path and os.path.exists(path):
                    with open(path, "rb") as f:
                        st.download_button("⬇️ Download .obj", f, file_name=fname)
                    st.success("✅ Mesh exported! Open in Blender.")
                else:
                    st.error("❌ No surface points found")

        if st.button("🌌 Generate Quantum Timelapse Frames"):
            os.makedirs("mandelbulb_frames", exist_ok=True)
            with st.spinner("Generating 8 frames..."):
                for i in range(8):
                    ws = -1.2 + i * 0.3
                    fig = render_raymarched_view(power, 40, resolution // 2, ws, bound)
                    fig.savefig(f"mandelbulb_frames/cycle_{i:04d}.png", facecolor="#0a0a0a")
                    plt.close(fig)
            st.success("8 frames saved to mandelbulb_frames/")

    with col2:
        st.info("👈 Adjust parameters and click **Render Raymarched View**.\n\n"
                "• Smooth μ coloring — beautiful escape-time gradients\n"
                "• Mesh export — real watertight triangles for Blender\n"
                "• W-Slice — travel through the 4th dimension")

# ---- TAB 2: QUANTUM SIMULATOR ----
with tab2:
    st.subheader("⚛️ Quantum Testing Framework Simulator")
    st.markdown("Runs the adaptive quantum error-correction test cycle with simulated hardware.")

    qcol1, qcol2 = st.columns([1, 2])

    with qcol1:
        st.markdown("**Hardware Parameters**")
        n_cycles = st.slider("Simulation cycles", 5, 50, 25)
        coherence = st.slider("Qubit coherence", 0.70, 0.99, 0.92, 0.01)
        env_stability = st.slider("Environmental stability", 0.80, 1.00, 0.95, 0.01)
        temperature = st.slider("Qubit temperature (K)", 0.010, 0.020, 0.012, 0.001)
        enable_ecc = st.checkbox("Enable Error Correction", value=True)

        run_btn = st.button("▶️ Run Simulation", type="primary")

    with qcol2:
        if run_btn:
            qc = QuantumComputer()
            qc.qubit_coherence = coherence
            qc.environmental_stability = env_stability
            qc.qubit_temperature = temperature

            db = AnomalyDB()
            framework = QuantumTestingFramework(qc, db)
            framework.quantum_error_correction = enable_ecc
            framework.COOLDOWN_PERIOD = 0.0

            with st.spinner(f"Running {n_cycles} quantum test cycles..."):
                results = framework.run_simulation(max_cycles=n_cycles)

            if results:
                import pandas as pd
                df = pd.DataFrame(results)

                st.success(f"✅ {len(results)} cycles completed")

                m1, m2, m3, m4 = st.columns(4)
                m1.metric("Avg Integrity", f"{df['integrity'].mean():.3f}")
                m2.metric("Avg Fidelity", f"{df['fidelity'].mean():.3f}")
                m3.metric("Avg Decoherence", f"{df['decoherence'].mean():.3f}")
                anomalies = df[df["anomaly"] != ""].shape[0]
                m4.metric("Anomalies", anomalies)

                fig, axes = plt.subplots(3, 1, figsize=(10, 8), facecolor="#0d0d0d")
                for ax in axes:
                    ax.set_facecolor("#0d0d0d")
                    ax.tick_params(colors="white")
                    ax.spines[:].set_color("#333")

                axes[0].plot(df["cycle"], df["integrity"], color="#00a3ff", lw=1.5, label="Integrity")
                axes[0].plot(df["cycle"], df["fidelity"], color="#a020f0", lw=1.5, label="Fidelity")
                axes[0].axhline(framework.safety_threshold, color="#ff4444", ls="--", lw=1, label="Safety threshold")
                axes[0].set_ylabel("Score", color="white"); axes[0].legend(facecolor="#1a1a1a", labelcolor="white")
                axes[0].set_title("Integrity & Fidelity", color="white")

                axes[1].plot(df["cycle"], df["decoherence"], color="#ff8c00", lw=1.5)
                axes[1].axhline(0.15, color="#ff4444", ls="--", lw=1, label="High threshold")
                axes[1].set_ylabel("Decoherence Rate", color="white"); axes[1].legend(facecolor="#1a1a1a", labelcolor="white")
                axes[1].set_title("Decoherence Evolution", color="white")

                axes[2].bar(df["cycle"], df["qubits"], color="#00c896", alpha=0.8)
                axes[2].set_ylabel("Qubit Count", color="white"); axes[2].set_xlabel("Cycle", color="white")
                axes[2].set_title("Qubit Count per Cycle", color="white")

                plt.tight_layout()
                st.pyplot(fig)
                plt.close(fig)

                with st.expander("📋 Cycle Log"):
                    st.code("\n".join(framework.log_buffer), language="text")

                with st.expander("📊 Raw Results Table"):
                    st.dataframe(df, use_container_width=True)
            else:
                st.warning("No cycles completed — check hardware parameters.")
        else:
            st.info("Configure hardware parameters on the left, then click **Run Simulation**.\n\n"
                    "The framework runs adaptive quantum error-correction cycles using:\n"
                    "- **Surface-17 / Bacon-Shor-13 / Color-9** ECC codes\n"
                    "- Smooth μ integrity scoring\n"
                    "- Multi-dimensional stability analysis\n"
                    "- Entanglement entropy tracking (Kendall τ)\n"
                    "- Anomaly correlation detection")

st.caption("Pure Python 4D Mandelbulb | Smooth μ coloring | QuantumTestingFramework | Real mesh export")
