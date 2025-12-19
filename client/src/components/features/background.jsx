import React from "react"
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react'

function Background({ zoom = 1 }) {
  // Calculer le cameraZoom en fonction du zoom (zoom initial * facteur de zoom)
  const baseCameraZoom = 4.5;
  const currentCameraZoom = baseCameraZoom * zoom;

  return (
    <ShaderGradientCanvas
      style={{ position: 'absolute', inset: 0 }}
      pixelDensity={1}
      fov={45}
    >
      <ShaderGradient 
        animate="on"
        axesHelper={false}
        brightness={0.6}
        cAzimuthAngle={321}
        cDistance={0.51}
        cPolarAngle={97}
        cameraZoom={currentCameraZoom}
        color1="#cfa0a9"
        color2="#c97b4f"
        color3="#00ceac"
        destination="onCanvas"
        embedMode={false}
        envPreset="lobby"
        fov={45}
        gizmoHelper={false}
        grain={true}
        lightType="env"
        pixelDensity={1}
        positionX={-0.1}
        positionY={0}
        positionZ={0}
        range="disabled"
        rangeEnd={40}
        rangeStart={0}
        reflection={0.6}
        rotationX={0}
        rotationY={130}
        rotationZ={70}
        shader="defaults"
        type="sphere"
        uAmplitude={3.2}
        uDensity={2.4}
        uFrequency={5.5}
        uSpeed={0.2}
        uStrength={0.1}
        wireframe={false}
      />
    </ShaderGradientCanvas>
  )
}

export default Background