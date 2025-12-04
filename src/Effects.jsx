import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

export default function Effects() {
  return (
    // Fix: Set multisampling to 0. This gives a HUGE fps boost.
    <EffectComposer disableNormalPass multisampling={0}>
      <Bloom 
        luminanceThreshold={1.1} 
        mipmapBlur 
        intensity={0.5} // Slightly reduced intensity for cleaner look
        radius={0.6}
      />
      
      <Noise opacity={0.05} />
      
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
      
      <ChromaticAberration 
        blendFunction={BlendFunction.NORMAL}
        offset={[0.002, 0.002]} 
        radialModulation={false}
        modulationOffset={0}
      />
    </EffectComposer>
  )
}