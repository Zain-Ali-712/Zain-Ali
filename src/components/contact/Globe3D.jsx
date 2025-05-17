import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Helper: Convert lat/lon to 3D coordinates on a sphere
function latLonToVector3(lat, lon, radius = 2.01) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
    );
}

// Helper: Find country feature by name
function findCountryFeature(geojson, countryName) {
    if (!geojson) return null;
    return geojson.features.find(
        f => f.properties.ADMIN?.toLowerCase() === countryName?.toLowerCase() ||
            f.properties.NAME?.toLowerCase() === countryName?.toLowerCase()
    );
}

// Draw country outlines as lines
function CountryLines({ geojson, highlightFeature, highlightPulse }) {
    const groupRef = useRef();
    useEffect(() => {
        if (!geojson) return;
        // Remove previous children
        while (groupRef.current && groupRef.current.children.length) {
            groupRef.current.remove(groupRef.current.children[0]);
        }
        geojson.features.forEach((feature) => {
            const isHighlight = highlightFeature && feature === highlightFeature;
            const color = isHighlight ? new THREE.Color(`hsl(0,0%,${80 + 20 * highlightPulse}%)`) : new THREE.Color('#fff');
            const mat = new THREE.LineBasicMaterial({ color, linewidth: isHighlight ? 2 : 1, transparent: true, opacity: isHighlight ? 1 : 0.5 });
            const coords = feature.geometry.coordinates;
            if (feature.geometry.type === 'Polygon') {
                coords.forEach(ring => {
                    const points = ring.map(([lon, lat]) => latLonToVector3(lat, lon));
                    const geo = new THREE.BufferGeometry().setFromPoints(points);
                    const line = new THREE.Line(geo, mat);
                    groupRef.current.add(line);
                });
            } else if (feature.geometry.type === 'MultiPolygon') {
                coords.forEach(polygon => {
                    polygon.forEach(ring => {
                        const points = ring.map(([lon, lat]) => latLonToVector3(lat, lon));
                        const geo = new THREE.BufferGeometry().setFromPoints(points);
                        const line = new THREE.Line(geo, mat);
                        groupRef.current.add(line);
                    });
                });
            }
        });
    }, [geojson, highlightFeature, highlightPulse]);
    return <group ref={groupRef} />;
}

function Globe({ texture, bump, normal, specular, geojson, selectedCountry, autoRotate, focusCountry, highlightPulse }) {
    const meshRef = useRef();
    // Animate to focus on selected country
    useEffect(() => {
        if (!geojson || !selectedCountry || !focusCountry) return;
        const feature = findCountryFeature(geojson, selectedCountry);
        if (!feature) return;
        // Find centroid
        let lat = 0, lon = 0;
        if (feature.geometry.type === 'Polygon') {
            const ring = feature.geometry.coordinates[0];
            ring.forEach(([lng, lt]) => { lat += lt; lon += lng; });
            lat /= ring.length; lon /= ring.length;
        } else if (feature.geometry.type === 'MultiPolygon') {
            const ring = feature.geometry.coordinates[0][0];
            ring.forEach(([lng, lt]) => { lat += lt; lon += lng; });
            lat /= ring.length; lon /= ring.length;
        }
        // Animate rotation
        const targetY = ((lon + 180) / 360) * Math.PI * 2;
        const targetX = ((90 - lat) / 180) * Math.PI;
        let frame = 0;
        const animate = () => {
            if (!meshRef.current) return;
            // Smoothly interpolate
            meshRef.current.rotation.y += (targetY - meshRef.current.rotation.y) * 0.08;
            meshRef.current.rotation.x += (targetX - meshRef.current.rotation.x) * 0.08;
            frame++;
            if (frame < 40) requestAnimationFrame(animate);
        };
        animate();
    }, [geojson, selectedCountry, focusCountry]);

    // Auto-rotation
    useFrame((state, delta) => {
        if (autoRotate.current && meshRef.current) {
            meshRef.current.rotation.y += 0.15 * delta;
        }
    });

    // Highlight feature
    const highlightFeature = useMemo(() => geojson && selectedCountry ? findCountryFeature(geojson, selectedCountry) : null, [geojson, selectedCountry]);

    return (
        <group ref={meshRef}>
            <mesh>
                <sphereGeometry args={[2, 64, 64]} />
                <meshPhongMaterial
                    map={texture}
                    bumpMap={bump}
                    bumpScale={0.07}
                    normalMap={normal}
                    specularMap={specular}
                    specular={new THREE.Color('#aaa')}
                    shininess={20}
                />
            </mesh>
            {geojson && <CountryLines geojson={geojson} highlightFeature={highlightFeature} highlightPulse={highlightPulse} />}
        </group>
    );
}

const Globe3D = ({ selectedCountry }) => {
    // Load textures
    const texture = useLoader(THREE.TextureLoader, '/earth_texture.jpg');
    const bump = useLoader(THREE.TextureLoader, '/earth_bump.jpeg');
    const normal = useLoader(THREE.TextureLoader, '/earth_normal.jpg');
    const specular = useLoader(THREE.TextureLoader, '/earth_specular.jpg');

    // Load GeoJSON
    const [geojson, setGeojson] = useState(null);
    useEffect(() => {
        fetch('/assets/globe/countries.geojson').then(r => r.json()).then(setGeojson);
    }, []);

    const autoRotate = useRef(true);
    const controlsRef = useRef();
    const [focusCountry, setFocusCountry] = useState(false);
    const [highlightPulse, setHighlightPulse] = useState(0);

    // Pulse animation for highlight
    useEffect(() => {
        let frame;
        const animate = () => {
            setHighlightPulse(Math.abs(Math.sin(Date.now() / 400)));
            frame = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(frame);
    }, []);

    // When selectedCountry changes, focus and pause auto-rotation
    useEffect(() => {
        if (!selectedCountry) return;
        setFocusCountry(true);
        autoRotate.current = false;
        const timeout = setTimeout(() => {
            setFocusCountry(false);
            autoRotate.current = true;
        }, 3000);
        return () => clearTimeout(timeout);
    }, [selectedCountry]);

    // Pause auto-rotation on interaction
    useEffect(() => {
        const controls = controlsRef.current;
        if (!controls) return;
        const handleStart = () => (autoRotate.current = false);
        const handleEnd = () => {
            setTimeout(() => {
                autoRotate.current = true;
            }, 2500);
        };
        controls.addEventListener('start', handleStart);
        controls.addEventListener('end', handleEnd);
        return () => {
            controls.removeEventListener('start', handleStart);
            controls.removeEventListener('end', handleEnd);
        };
    }, []);

    return (
        <div style={{ width: '100%', height: '320px', background: 'radial-gradient(ellipse at center, #222 70%, #000 100%)', borderRadius: '16px' }}>
            <Canvas camera={{ position: [0, 0, 6], fov: 40 }}>
                <ambientLight intensity={0.7} />
                <pointLight position={[10, 10, 10]} intensity={1.2} />
                <Stars radius={100} depth={50} count={500} factor={4} fade speed={1} />
                <Globe
                    texture={texture}
                    bump={bump}
                    normal={normal}
                    specular={specular}
                    geojson={geojson}
                    selectedCountry={selectedCountry}
                    autoRotate={autoRotate}
                    focusCountry={focusCountry}
                    highlightPulse={highlightPulse}
                />
                <OrbitControls
                    ref={controlsRef}
                    enableZoom={false}
                    enablePan={false}
                    enableDamping
                    dampingFactor={0.1}
                    rotateSpeed={0.5}
                    maxPolarAngle={Math.PI}
                    minPolarAngle={0}
                    enableRotate
                    makeDefault
                />
            </Canvas>
        </div>
    );
};

export default Globe3D; 