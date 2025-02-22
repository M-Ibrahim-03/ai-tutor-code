import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

// Text-to-Speech initialization
const synth = window.speechSynthesis;

function Avatar({ speaking, emotion = 'neutral' }) {
  const group = useRef();
  const { scene, isLoading } = useGLTF('/models/avatar.glb', true);

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [scene]);

  if (isLoading || !scene) {
    return null;
  }

  return <primitive object={scene} ref={group} position={[0, -1, 0]} scale={1} />;
}

export default function AIAvatarWrapper({ text, emotion, onFinishSpeaking }) {
  const [speaking, setSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for the avatar
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (text && !speaking) {
      setSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure voice
      utterance.rate = 1;
      utterance.pitch = 1;
      
      // Wait for voices to be loaded
      const setVoice = () => {
        const voices = synth.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.name.includes('Female') || 
          voice.name.includes('Samantha') ||
          voice.name.includes('Google')
        );
        utterance.voice = preferredVoice || voices[0];
      };

      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = setVoice;
      }
      setVoice();

      utterance.onend = () => {
        setSpeaking(false);
        onFinishSpeaking?.();
      };

      synth.speak(utterance);

      return () => {
        synth.cancel(); // Cancel any ongoing speech when component unmounts
      };
    }
  }, [text, onFinishSpeaking]);

  return (
    <div className="relative w-full h-[400px] bg-gray-900/30 rounded-xl overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [0, 1.5, 3], fov: 50 }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <Avatar speaking={speaking} emotion={emotion} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
      
      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
          <div className="text-white flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <div>Loading Avatar...</div>
          </div>
        </div>
      )}
      
      {/* Subtitles */}
      {speaking && text && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-xl max-w-md text-center">
          {text}
        </div>
      )}
    </div>
  );
} 