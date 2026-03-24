import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, Path, Text as SvgText } from "react-native-svg";
import Colors from "@/constants/colors";

const colors = Colors.light;

interface FractalCanvasProps {
  blocksMined: number;
  autoMine: boolean;
}

export function FractalCanvas({ blocksMined, autoMine }: FractalCanvasProps) {
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const numRings = 5;
  const baseRadius = 20;
  const complexity = Math.min(3 + Math.log(blocksMined + 1) * 1.5, 12);

  const wavePoints: string[] = [];
  for (let w = 0; w < 3; w++) {
    let d = `M 0 ${cy}`;
    for (let x = 0; x <= size; x += 2) {
      const freq = 0.03 + w * 0.015 + complexity * 0.002;
      const amp = 15 + w * 8 + Math.sin(blocksMined * 0.1 + w) * 5;
      const phase = w * 2.1 + blocksMined * 0.05;
      const y = cy + Math.sin(x * freq + phase) * amp * Math.sin((x / size) * Math.PI);
      d += ` L ${x} ${y}`;
    }
    wavePoints.push(d);
  }

  const orbitParticles: Array<{ cx: number; cy: number; r: number; ring: number }> = [];
  for (let ring = 0; ring < numRings; ring++) {
    const radius = baseRadius + ring * 16;
    const particlesInRing = Math.min(12, 4 + ring * 2);
    for (let p = 0; p < particlesInRing; p++) {
      const angle = (p / particlesInRing) * Math.PI * 2 + ring * 0.5 + blocksMined * 0.02;
      const px = cx + Math.cos(angle) * radius;
      const py = cy + Math.sin(angle) * radius;
      const pr = 1.5 + (ring === 0 ? 1 : 0);
      orbitParticles.push({ cx: px, cy: py, r: pr, ring });
    }
  }

  const spiralPath = (() => {
    let d = `M ${cx} ${cy}`;
    const turns = 3 + complexity * 0.5;
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const angle = t * turns * Math.PI * 2 + blocksMined * 0.03;
      const r = t * 80;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      d += ` L ${x} ${y}`;
    }
    return d;
  })();

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {wavePoints.map((d, i) => (
          <Path
            key={`wave-${i}`}
            d={d}
            stroke={
              i === 0
                ? colors.orange
                : i === 1
                ? colors.purple
                : colors.primary
            }
            strokeWidth={1.5}
            fill="none"
            opacity={0.4 + i * 0.1}
          />
        ))}

        <Path
          d={spiralPath}
          stroke={colors.accent}
          strokeWidth={0.8}
          fill="none"
          opacity={0.3}
        />

        {orbitParticles.map((p, i) => (
          <Circle
            key={`particle-${i}`}
            cx={p.cx}
            cy={p.cy}
            r={p.r}
            fill={
              p.ring === 0
                ? colors.orange
                : p.ring < 3
                ? colors.primary
                : colors.purple
            }
            opacity={0.6 + (p.ring === 0 ? 0.3 : 0)}
          />
        ))}

        {[...Array(numRings)].map((_, ring) => (
          <Circle
            key={`ring-${ring}`}
            cx={cx}
            cy={cy}
            r={baseRadius + ring * 16}
            stroke={ring === 0 ? colors.orange : colors.border}
            strokeWidth={ring === 0 ? 1.5 : 0.5}
            fill="none"
            opacity={ring === 0 ? 0.6 : 0.3}
          />
        ))}

        <Circle cx={cx} cy={cy} r={10} fill={colors.orange} opacity={0.6} />
        <Circle cx={cx} cy={cy} r={5} fill={colors.orange} opacity={0.9} />

        <SvgText
          x={cx}
          y={size - 6}
          textAnchor="middle"
          fill={colors.textSecondary}
          fontSize={9}
          opacity={0.6}
        >
          {autoMine ? "Magnetizing tokens..." : `Complexity: ${complexity.toFixed(1)}`}
        </SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
});
