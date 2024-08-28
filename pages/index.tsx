// pages/index.tsx
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";

function Sphere({ videoRef }: { videoRef: React.RefObject<HTMLVideoElement> }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    if (meshRef.current && videoRef.current) {
      meshRef.current.rotation.y += 0.01; // 必要に応じて回転
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial side={THREE.BackSide}>
        {videoRef.current && (
          <videoTexture attach="map" args={[videoRef.current]} />
        )}
      </meshBasicMaterial>
    </mesh>
  );
}

function GyroControl() {
  const { camera } = useThree();

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const alpha = event.alpha ? THREE.MathUtils.degToRad(event.alpha) : 0;
      const beta = event.beta ? THREE.MathUtils.degToRad(event.beta) : 0;
      const gamma = event.gamma ? THREE.MathUtils.degToRad(event.gamma) : 0;

      const euler = new THREE.Euler(beta, alpha, -gamma, "YXZ");
      camera.quaternion.setFromEuler(euler);
    };

    window.addEventListener("deviceorientation", handleOrientation, true);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [camera]);

  return null;
}

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const playVideo = async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.play();
        } catch (error) {
          console.error("Video playback failed:", error);
        }
      }
    };
    playVideo();
  }, []);

  return (
    <>
      <Canvas style={{ width: "100vw", height: "100vh" }}>
        <GyroControl />
        <Sphere videoRef={videoRef} />
      </Canvas>
      <video
        ref={videoRef}
        src="./video/demo.mp4"
        autoPlay
        loop
        muted
        style={{ display: "none" }}
      />
    </>
  );
}
