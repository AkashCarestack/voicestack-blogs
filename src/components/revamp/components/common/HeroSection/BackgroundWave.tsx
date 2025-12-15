'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'

// Animation constants
const RIBBON_LENGTH = 50 // Number of segments
const HAIRLINE_WIDTH = 0.02 // Hairline thread width
const THREADS_PER_RIBBON = 1000 // Number of hairline threads per ribbon (5x density)
const RIBBON_WIDTH = (HAIRLINE_WIDTH * THREADS_PER_RIBBON) // Total ribbon width (~11.25, very wide ribbons)
const WAVE_SPEED = 0.15 // Animation speed
const WAVE_AMPLITUDE = 3.0 // Wave height
const WAVE_FREQUENCY = 0.12 // Wave frequency

// High-fidelity vertex shader with proper lighting and random variations
const vertexShader = `
precision highp float;

uniform float uTime;
uniform float uRibbonWidth;
uniform float uPhaseOffset;
uniform float uAmplitudeVariation;
uniform float uFrequencyVariation;
uniform float uSpeedVariation;
uniform float uYOffset;
uniform float uXOffset;
uniform float uThreadOffset; // Offset for this specific thread within ribbon
uniform float uThreadPhase; // Unique phase for each thread's waviness

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewDirection;
varying float vPathPosition;

void main() {
  vUv = uv;
  vPathPosition = uv.x; // Position along ribbon (0 to 1)
  
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  
  // Apply position offsets for random placement
  modelPosition.x += uXOffset;
  modelPosition.y += uYOffset + uThreadOffset; // Offset thread within ribbon
  
  // Smooth, organic wave animation with variations
  float t = uTime * (0.3 + uSpeedVariation);
  float x = modelPosition.x;
  
  // Primary wave - smooth S-curve with variations
  float waveX = x * (0.12 + uFrequencyVariation) + t + uPhaseOffset;
  float primaryWave = sin(waveX) * (3.0 + uAmplitudeVariation);
  
  // Secondary harmonic for extra smoothness
  float secondaryWave = sin(waveX * 2.3 + t * 0.7 + uPhaseOffset * 0.5) * (0.9 + uAmplitudeVariation * 0.3);
  
  // Tertiary for fluidity
  float tertiaryWave = sin(waveX * 4.1 + t * 1.2 + uPhaseOffset * 0.8) * (0.45 + uAmplitudeVariation * 0.15);
  
  // Combine waves
  float waveY = primaryWave + secondaryWave + tertiaryWave;
  modelPosition.y += waveY;
  
  // Add waviness along the length of each thread (like flowing strands)
  // Each thread has its own sinuous curve along the X-axis
  float threadWaveX = x * 0.25 + t * 0.4 + uThreadPhase;
  float threadWaviness = sin(threadWaveX) * 0.15 + 
                         sin(threadWaveX * 2.1 + uThreadPhase * 0.5) * 0.08 +
                         sin(threadWaveX * 3.7 + uThreadPhase * 0.8) * 0.04;
  
  // Apply waviness perpendicular to thread direction (Y-axis)
  modelPosition.y += threadWaviness;
  
  // Subtle 3D depth variation with randomness
  float depthWave = cos(waveX * 0.8 + t * 0.5 + uPhaseOffset * 0.3) * 0.4;
  modelPosition.z += depthWave;
  
  // Calculate tangent for proper normal calculation
  float freq = 0.12 + uFrequencyVariation;
  float amp = 3.0 + uAmplitudeVariation;
  float waveDerivative = cos(waveX) * freq * amp +
                         cos(waveX * 2.3 + t * 0.7 + uPhaseOffset * 0.5) * 2.3 * freq * (0.9 + uAmplitudeVariation * 0.3) +
                         cos(waveX * 4.1 + t * 1.2 + uPhaseOffset * 0.8) * 4.1 * freq * (0.45 + uAmplitudeVariation * 0.15);
  
  // Add thread waviness derivative
  float threadWaveDerivative = cos(threadWaveX) * 0.25 * 0.15 +
                               cos(threadWaveX * 2.1 + uThreadPhase * 0.5) * 2.1 * 0.25 * 0.08 +
                               cos(threadWaveX * 3.7 + uThreadPhase * 0.8) * 3.7 * 0.25 * 0.04;
  
  waveDerivative += threadWaveDerivative;
  
  float depthDerivative = -sin(waveX * 0.8 + t * 0.5 + uPhaseOffset * 0.3) * 0.8 * freq * 0.4;
  
  // Calculate proper normal for lighting
  vec3 tangent = normalize(vec3(1.0, waveDerivative, depthDerivative));
  vec3 bitangent = vec3(0.0, 0.0, 1.0);
  vNormal = normalize(cross(tangent, bitangent));
  
  // Transform normal to world space
  vNormal = normalize(normalMatrix * vNormal);
  
  vWorldPosition = modelPosition.xyz;
  
  // Calculate view direction for rim lighting
  vec4 viewPosition = viewMatrix * modelPosition;
  vViewDirection = normalize(-viewPosition.xyz);
  
  gl_Position = projectionMatrix * viewPosition;
}
`

// High-fidelity fragment shader with premium lighting and gradient blending
const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uColorStart;
uniform vec3 uColorEnd;
uniform float uOpacity;
uniform float uGradientMix; // For blending between threads
uniform float uThreadPhase; // For unique gradient shift per thread

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewDirection;
varying float vPathPosition;

void main() {
  // Animated gradient shift - simulates light moving along hair strands
  // Each thread has a unique phase offset for organic variation
  float gradientShift = uTime * 0.15 + uThreadPhase * 0.3; // Slow, organic shift
  float shiftedPosition = mod(vPathPosition + gradientShift, 1.0); // Wrap around for continuous effect
  
  // Create a smooth gradient that shifts along the ribbon length
  // Use a sine wave for more organic, flowing gradient transitions
  float gradientWave = sin(shiftedPosition * 3.14159) * 0.5 + 0.5; // 0 to 1 range
  vec3 baseColor = mix(uColorStart, uColorEnd, gradientWave);
  
  // Add subtle secondary gradient shift for depth (like light catching different angles)
  float secondaryShift = uTime * 0.08 + uThreadPhase * 0.2;
  float secondaryPosition = mod(vPathPosition * 0.7 + secondaryShift, 1.0);
  float secondaryWave = sin(secondaryPosition * 6.28318) * 0.3 + 0.7; // Subtle variation
  baseColor = mix(baseColor, uColorEnd, (1.0 - secondaryWave) * 0.2);
  
  // Blend with neighboring threads for smooth gradient transitions
  baseColor = mix(baseColor, uColorEnd, uGradientMix * 0.3);
  
  // Pure silk lighting - highly reflective and glossy
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewDirection);
  
  // Global illumination light from angle (matches directional light position [8, 10, 8])
  vec3 globalLightDir = normalize(vec3(0.6, 0.75, 0.6)); // Normalized from [8, 10, 8]
  float NdotGlobal = max(dot(normal, globalLightDir), 0.0);
  
  // Multiple directional lights for silk illumination
  vec3 lightDir1 = normalize(vec3(0.2, 0.7, 0.6));
  float NdotL1 = max(dot(normal, lightDir1), 0.0);
  
  vec3 lightDir2 = normalize(vec3(-0.2, 0.6, -0.5));
  float NdotL2 = max(dot(normal, lightDir2), 0.0);
  
  vec3 lightDir3 = normalize(vec3(0.8, 0.2, 0.3));
  float NdotL3 = max(dot(normal, lightDir3), 0.0);
  
  vec3 lightDir4 = normalize(vec3(-0.7, 0.3, -0.4));
  float NdotL4 = max(dot(normal, lightDir4), 0.0);
  
  // Base lighting for silk with strong global illumination
  float ambient = 0.5; // Increased for brighter base
  float lighting = ambient + 
                   (NdotGlobal * 1.5) +  // Increased global illumination - brightens colors
                   (NdotL1 * 0.5) +  
                   (NdotL2 * 0.35) +   
                   (NdotL3 * 0.3) +  
                   (NdotL4 * 0.25);
  
  // SOFT MATERIAL WITH SUBTLE REFLECTIONS
  // Soft fresnel reflection for gentle reflectivity
  float fresnel = 1.0 - max(dot(normal, viewDir), 0.0);
  float fresnelPower = pow(fresnel, 3.0);
  float fresnelReflection = 0.15 + fresnelPower * 0.4; // Increased reflection for brightness
  
  // Soft environment reflection (white background)
  vec3 reflectDir = reflect(-viewDir, normal);
  vec3 envReflection = vec3(1.0, 1.0, 1.0); // White environment
  vec3 reflection = envReflection * fresnelReflection * 0.5; // Increased reflection intensity
  
  // SOFT SPECULAR HIGHLIGHTS - Softer appearance
  vec3 halfDirGlobal = normalize(globalLightDir + viewDir);
  vec3 halfDir1 = normalize(lightDir1 + viewDir);
  
  // Softer specular highlights (reduced power for softer look)
  float specularGlobal = pow(max(dot(normal, halfDirGlobal), 0.0), 45.0); // Softer
  float specular1 = pow(max(dot(normal, halfDir1), 0.0), 45.0); // Softer
  vec3 specularColor = vec3(1.0, 1.0, 1.0) * (specularGlobal * 0.12 + specular1 * 0.1);
  
  // Soft rim lighting for gentle edge glow
  float rim = 1.0 - max(dot(normal, viewDir), 0.0);
  float rimPower = pow(rim, 3.5); // Softer falloff
  vec3 rimColor = vec3(0.85, 0.9, 1.0) * rimPower * 0.25; // Softer rim
  
  // Softer width-based shading
  float widthGradient = smoothstep(0.0, 0.3, abs(vUv.y - 0.5) * 2.0);
  float widthShading = 0.97 + widthGradient * 0.03; // Softer shading
  
  // Softer edge fade
  float edgeDistance = min(vUv.y, 1.0 - vUv.y);
  float edgeAlpha = smoothstep(0.0, 0.2, edgeDistance); // Softer edges
  
  // Soft animated shimmer
  float shimmer = sin(vWorldPosition.x * 0.15 + uTime * 0.6) * 0.015;
  baseColor += vec3(shimmer * 0.4, shimmer * 0.5, shimmer * 0.45);
  
  // SELF-ILLUMINATION - Threads emit their own light
  // Emissive glow based on base color - makes threads glow from within
  vec3 emissive = baseColor * 0.6; // Increased self-illumination for brightness
  // Add subtle variation along thread length for organic glow
  float emissiveVariation = 0.9 + sin(vPathPosition * 3.14159 + uTime * 0.3) * 0.1;
  emissive *= emissiveVariation;
  
  // Combine soft lighting effects with subtle reflections
  // Base color with lighting
  vec3 finalColor = baseColor * lighting * widthShading;
  
  // Add self-illumination (emissive glow)
  finalColor += emissive;
  
  // Add subtle reflections for soft reflectivity
  finalColor = mix(finalColor, reflection, fresnelReflection * 0.3); // Increased reflection mix
  
  // Add soft specular highlights
  finalColor += specularColor;
  
  // Add soft rim glow
  finalColor += rimColor;
  
  // Ensure vibrant colors with silk reflectivity
  finalColor = clamp(finalColor, 0.0, 1.0);
  
  float alpha = uOpacity * edgeAlpha;
  
  gl_FragColor = vec4(finalColor, alpha);
}
`

interface ThreadProps {
  colorStart: string
  colorEnd: string
  phaseOffset: number
  amplitudeVariation: number
  frequencyVariation: number
  speedVariation: number
  yOffset: number
  xOffset: number
  rotation: number
  zPosition: number
  threadIndex: number
  totalThreads: number
}

const Thread: React.FC<ThreadProps> = ({
  colorStart,
  colorEnd,
  phaseOffset,
  amplitudeVariation,
  frequencyVariation,
  speedVariation,
  yOffset,
  xOffset,
  rotation,
  zPosition,
  threadIndex,
  totalThreads,
}) => {
  const mesh = useRef<THREE.Mesh>(null)

  // Calculate thread position within ribbon (spread across ribbon width, perpendicular to length)
  // Threads run along the length (X axis), positioned side-by-side along width (Y axis)
  // Reduced spacing multiplier to pack threads closer together
  const spacingMultiplier = 0.2 // Reduce spacing by 30% to pack threads tighter
  const threadOffset = (threadIndex - totalThreads / 2) * HAIRLINE_WIDTH * spacingMultiplier
  // Gradient mix for blending (0 to 1 across ribbon width)
  const gradientMix = threadIndex / totalThreads
  // Unique phase for each thread's waviness (so threads don't all wave the same)
  // Use threadIndex to create deterministic but unique phases
  const threadPhase = useMemo(() => (threadIndex / totalThreads) * Math.PI * 4, [threadIndex, totalThreads])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRibbonWidth: { value: HAIRLINE_WIDTH },
      uPhaseOffset: { value: phaseOffset },
      uAmplitudeVariation: { value: amplitudeVariation },
      uFrequencyVariation: { value: frequencyVariation },
      uSpeedVariation: { value: speedVariation },
      uYOffset: { value: yOffset },
      uXOffset: { value: xOffset },
      uThreadOffset: { value: threadOffset },
      uThreadPhase: { value: threadPhase },
      uGradientMix: { value: gradientMix },
      uColorStart: { value: new THREE.Color(colorStart) },
      uColorEnd: { value: new THREE.Color(colorEnd) },
      uOpacity: { value: 0.65 }, // Reduced opacity for translucency
    }),
    [
      colorStart,
      colorEnd,
      phaseOffset,
      amplitudeVariation,
      frequencyVariation,
      speedVariation,
      yOffset,
      xOffset,
      threadOffset,
      threadPhase,
      gradientMix,
    ]
  )

  useFrame((state) => {
    const { clock } = state
    if (mesh.current) {
      // @ts-ignore
      mesh.current.material.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

  return (
    <mesh ref={mesh} rotation={[0, 0, rotation]} position={[0, 0, zPosition]}>
      {/* High-resolution geometry: length (X) = 45, width (Y) = HAIRLINE_WIDTH */}
      {/* Threads run along the length direction, positioned side-by-side to form ribbon width */}
      <planeGeometry args={[45, HAIRLINE_WIDTH, RIBBON_LENGTH * 5, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  )
}

interface RibbonProps {
  colorStart: string
  colorEnd: string
  phaseOffset: number
  amplitudeVariation: number
  frequencyVariation: number
  speedVariation: number
  yOffset: number
  xOffset: number
  rotation: number
  zPosition: number
}

const Ribbon: React.FC<RibbonProps> = (config) => {
  // Generate random gradient colors for each thread that blend together
  const threadColors = useMemo(() => {
    const colors: Array<{ start: string; end: string }> = []
    const baseStart = new THREE.Color(config.colorStart)
    const baseEnd = new THREE.Color(config.colorEnd)

    for (let i = 0; i < THREADS_PER_RIBBON; i++) {
      const t = i / THREADS_PER_RIBBON
      // Create smooth gradient that blends across threads
      const startColor = new THREE.Color().lerpColors(baseStart, baseEnd, t * 0.7)
      const endColor = new THREE.Color().lerpColors(baseStart, baseEnd, 0.3 + t * 0.7)

      // Add random variation for more interesting gradients
      const randomHue = (Math.random() - 0.5) * 0.1
      startColor.offsetHSL(randomHue, 0, 0)
      endColor.offsetHSL(randomHue * 0.5, 0, 0)

      // Convert to hex with proper padding
      const startHex = '#' + startColor.getHexString().padStart(6, '0')
      const endHex = '#' + endColor.getHexString().padStart(6, '0')
      
      colors.push({
        start: startHex,
        end: endHex,
      })
    }
    return colors
  }, [config.colorStart, config.colorEnd])

  return (
    <>
      {threadColors.map((colors, index) => (
        <Thread
          key={index}
          {...config}
          colorStart={colors.start}
          colorEnd={colors.end}
          threadIndex={index}
          totalThreads={THREADS_PER_RIBBON}
        />
      ))}
    </>
  )
}

// White reflective sphere that contains the ribbons
const ReflectiveSphere = () => {
  const sphereRef = useRef<THREE.Mesh>(null)
  
  // Create a white/light environment map
  const envMap = useMemo(() => {
    const size = 256
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const context = canvas.getContext('2d')!
    
    // Create a light gradient environment map (white to light gray)
    const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    gradient.addColorStop(0, '#ffffff')
    gradient.addColorStop(0.5, '#f8f8f8')
    gradient.addColorStop(1, '#f0f0f0')
    
    context.fillStyle = gradient
    context.fillRect(0, 0, size, size)
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.mapping = THREE.EquirectangularReflectionMapping
    return texture
  }, [])
  
  return (
    <mesh ref={sphereRef} scale={[1, 1, 1]}>
      {/* Large sphere - inverted normals so we see inside */}
      <sphereGeometry args={[20, 64, 64]} />
      <meshStandardMaterial
        metalness={0.3}
        roughness={0.4}
        color="#ffffff"
        side={THREE.BackSide} // Inverted so we see the inside
        transparent={false}
        opacity={1.0}
        envMap={envMap}
        envMapIntensity={0.8}
      />
    </mesh>
  )
}

const BackgroundWave = () => {
  // Create 4 ribbons using website brand colors: purple, blue, and complementary colors
  const ribbons = useMemo(() => {
    const ribbonConfigs: RibbonProps[] = [
      {
        // Brand Purple to Blue (primary brand colors)
        colorStart: '#4A3CE1', // vs-purple (brand purple)
        colorEnd: '#5342FF',   // vs-blue-secondary (bright blue)
        phaseOffset: 0,
        amplitudeVariation: 0.4,
        frequencyVariation: 0.02,
        speedVariation: 0.05,
        yOffset: 0,
        xOffset: -1.5,
        rotation: Math.PI / 5.5,
        zPosition: -5.2,
      },
      {
        // Light Purple to Pink (from brand gradient)
        colorStart: '#CAC5FF', // Light purple from gradient
        colorEnd: '#FF708C',   // Pink from vs-blue-purple gradient
        phaseOffset: Math.PI * 0.4,
        amplitudeVariation: -0.3,
        frequencyVariation: -0.015,
        speedVariation: -0.03,
        yOffset: 0.8,
        xOffset: 0.5,
        rotation: Math.PI / 6.2,
        zPosition: -5.0,
      },
      {
        // Blue to Green (complementary - vibrant)
        colorStart: '#4A3CE1', // Brand purple/blue
        colorEnd: '#B5EB92',   // vs-lemon-green (bright green)
        phaseOffset: Math.PI * 0.8,
        amplitudeVariation: 0.5,
        frequencyVariation: 0.025,
        speedVariation: 0.08,
        yOffset: -0.6,
        xOffset: -0.8,
        rotation: Math.PI / 5.8,
        zPosition: -5.4,
      },
      {
        // Purple to Light Purple (brand gradient variation)
        colorStart: '#4A3CE1', // Brand purple
        colorEnd: '#E0DDFF',   // vs-purple-50 (very light purple)
        phaseOffset: Math.PI * 1.2,
        amplitudeVariation: -0.2,
        frequencyVariation: -0.02,
        speedVariation: -0.05,
        yOffset: 1.2,
        xOffset: 1.2,
        rotation: Math.PI / 6.5,
        zPosition: -4.8,
      },
    ]
    return ribbonConfigs
  }, [])

  return (
    <div className="absolute inset-0 z-0 h-full w-full overflow-hidden pointer-events-none bg-white">
      <div className="absolute inset-0 bg-white">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 50 }}
          gl={{ 
            antialias: false, // Disable for better performance
            alpha: true, 
            powerPreference: 'high-performance',
            precision: 'highp',
            preserveDrawingBuffer: false, // Disable for better performance
            stencil: false, // Disable unused features
            depth: true
          }}
          dpr={[1, 2]}
        >
          {/* Reflective sphere containing everything */}
          <ReflectiveSphere />
          
          {/* Optimized lighting for white background - bright and even */}
          {/* Base ambient - bright foundation for white background */}
          <ambientLight intensity={0.7} color="#ffffff" />
          
          {/* Global illumination light from angle - brightens colors in camera view */}
          <directionalLight 
            position={[8, 10, 8]} 
            intensity={3.5} 
            color="#ffffff"
            castShadow={false}
          />
          
          {/* Main directional lights for optimal ribbon illumination */}
          <directionalLight 
            position={[5, 8, 5]} 
            intensity={1.2} 
            color="#ffffff"
          />
          <directionalLight 
            position={[-5, 6, 5]} 
            intensity={0.8} 
            color="#ffffff"
          />
          <directionalLight 
            position={[0, 10, 0]} 
            intensity={1.0} 
            color="#ffffff"
          />
          
          {/* Evenly distributed point lights for uniform illumination */}
          <pointLight 
            position={[6, 6, 6]} 
            intensity={0.6} 
            distance={30} 
            decay={2}
            color="#ffffff"
          />
          <pointLight 
            position={[-6, 6, 6]} 
            intensity={0.6} 
            distance={30} 
            decay={2}
            color="#ffffff"
          />
          <pointLight 
            position={[6, -6, 6]} 
            intensity={0.5} 
            distance={30} 
            decay={2}
            color="#ffffff"
          />
          <pointLight 
            position={[-6, -6, 6]} 
            intensity={0.5} 
            distance={30} 
            decay={2}
            color="#ffffff"
          />
          <pointLight 
            position={[0, 8, 0]} 
            intensity={0.7} 
            distance={30} 
            decay={2}
            color="#ffffff"
          />
          <pointLight 
            position={[0, -8, 0]} 
            intensity={0.4} 
            distance={30} 
            decay={2}
            color="#ffffff"
          />
          
          {/* Accent lights for highlights and depth */}
          <pointLight 
            position={[4, 4, -4]} 
            intensity={0.5} 
            distance={25} 
            decay={2}
            color="#ffffff"
          />
          <pointLight 
            position={[-4, 4, -4]} 
            intensity={0.5} 
            distance={25} 
            decay={2}
            color="#ffffff"
          />
          
          {/* Render 4 ribbons, each made of many hairline threads */}
          {ribbons.map((config, index) => (
            <Ribbon key={index} {...config} />
          ))}
        </Canvas>
      </div>
    </div>
  )
}

export default BackgroundWave
