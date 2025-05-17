import React, { useRef, useEffect, useState, useMemo, Suspense } from 'react';
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

// Helper: Normalize country name for matching
function normalizeCountryName(name) {
    return name?.toLowerCase().replace(/[^a-z]/g, '');
}

// Helper: Find country feature by name (normalized)
function findCountryFeature(geojson, countryName) {
    if (!geojson) return null;
    const norm = normalizeCountryName(countryName);
    return geojson.features.find(
        f =>
            normalizeCountryName(f.properties.ADMIN) === norm ||
            normalizeCountryName(f.properties.NAME) === norm
    );
}

// Draw country outlines as lines
function CountryLines({ geojson, highlightFeature, highlightPulse }) {
    const groupRef = useRef();
    useEffect(() => {
        if (!geojson) return;
        while (groupRef.current && groupRef.current.children.length) {
            groupRef.current.remove(groupRef.current.children[0]);
        }

        // Show more countries but still limit to major ones
        const visibleFeatures = geojson.features.filter(feature => {
            if (highlightFeature && feature === highlightFeature) return true;
            const majorCountries = [
                'United States', 'China', 'Russia', 'Canada', 'Brazil', 'Australia', 'India',
                'United Kingdom', 'France', 'Germany', 'Japan', 'South Korea', 'Mexico', 'South Africa'
            ];
            return majorCountries.includes(feature.properties.ADMIN) || majorCountries.includes(feature.properties.NAME);
        });

        visibleFeatures.forEach((feature) => {
            const isHighlight = highlightFeature && feature === highlightFeature;
            const color = isHighlight ? new THREE.Color(`hsl(0,0%,${80 + 20 * highlightPulse}%)`) : new THREE.Color('#fff');
            const mat = new THREE.LineBasicMaterial({
                color,
                linewidth: isHighlight ? 2 : 1,
                transparent: true,
                opacity: isHighlight ? 1 : 0.3
            });

            // Sample every 3rd point for better detail
            const coords = feature.geometry.coordinates;
            if (feature.geometry.type === 'Polygon') {
                coords.forEach(ring => {
                    const simplifiedPoints = ring.filter((_, i) => i % 3 === 0);
                    const points = simplifiedPoints.map(([lon, lat]) => latLonToVector3(lat, lon));
                    const geo = new THREE.BufferGeometry().setFromPoints(points);
                    const line = new THREE.Line(geo, mat);
                    groupRef.current.add(line);
                });
            } else if (feature.geometry.type === 'MultiPolygon') {
                coords.forEach(polygon => {
                    polygon.forEach(ring => {
                        const simplifiedPoints = ring.filter((_, i) => i % 3 === 0);
                        const points = simplifiedPoints.map(([lon, lat]) => latLonToVector3(lat, lon));
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

// Orbit ring component with random tilt
function OrbitRing({ radius = 2.3, segments = 128, color = '#fff', opacity = 0.18, tilt = [0, 0, 0] }) {
    const points = [];
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(
            Math.cos(theta) * radius,
            0,
            Math.sin(theta) * radius
        ));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return (
        <group rotation={tilt}>
            <line geometry={geometry}>
                <lineBasicMaterial attach="material" color={color} transparent opacity={opacity} />
            </line>
        </group>
    );
}

function Globe({ texture, bump, normal, specular, geojson, selectedCountry, autoRotate, focusCountry, highlightPulse }) {
    const meshRef = useRef();
    const [isInteracting, setIsInteracting] = useState(false);
    const lastFrameTime = useRef(0);

    // --- Sync globe rotation to selected country (bring to top) ---
    useEffect(() => {
        if (!geojson || !selectedCountry) return;
        const feature = findCountryFeature(geojson, selectedCountry);
        if (!feature) return;

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

        // Calculate target rotation to bring country to top
        const targetY = ((lon + 180) / 360) * Math.PI * 2;
        const targetX = ((90 - lat) / 180) * Math.PI; // latitude to X rotation
        let frame = 0;
        const animate = () => {
            if (!meshRef.current) return;
            // Interpolate Y (longitude) and X (latitude)
            meshRef.current.rotation.y += (targetY - meshRef.current.rotation.y) * 0.12;
            meshRef.current.rotation.x += (targetX - meshRef.current.rotation.x) * 0.12;
            frame++;
            if (frame < 25) requestAnimationFrame(animate);
        };
        animate();
    }, [geojson, selectedCountry]);

    // Faster auto-rotation
    useFrame((state, delta) => {
        if (autoRotate.current && meshRef.current && !isInteracting) {
            const time = state.clock.getElapsedTime() * 1000;
            if (time - lastFrameTime.current < 16) return; // Cap at ~60fps
            lastFrameTime.current = time;
            meshRef.current.rotation.y += 0.15 * delta;
        }
    });

    // Handle interaction state
    useEffect(() => {
        const handleInteractionStart = () => setIsInteracting(true);
        const handleInteractionEnd = () => {
            setTimeout(() => setIsInteracting(false), 1000);
        };

        window.addEventListener('mousedown', handleInteractionStart);
        window.addEventListener('mouseup', handleInteractionEnd);
        window.addEventListener('touchstart', handleInteractionStart);
        window.addEventListener('touchend', handleInteractionEnd);

        return () => {
            window.removeEventListener('mousedown', handleInteractionStart);
            window.removeEventListener('mouseup', handleInteractionEnd);
            window.removeEventListener('touchstart', handleInteractionStart);
            window.removeEventListener('touchend', handleInteractionEnd);
        };
    }, []);

    // Highlight feature with memoization
    const highlightFeature = useMemo(() =>
        geojson && selectedCountry ? findCountryFeature(geojson, selectedCountry) : null,
        [geojson, selectedCountry]
    );

    return (
        <group ref={meshRef}>
            {/* Orbit rings for shine/orbit effect, now randomized */}
            <OrbitRing radius={2.5} color="#fff" opacity={0.09} tilt={[0.2, 0.1, 0]} />
            <OrbitRing radius={2.6} color="#fff" opacity={0.07} tilt={[-0.6, 0.1, 0.5]} />
            <OrbitRing radius={2.7} color="#fff" opacity={0.1} tilt={[0.5, -0.1, 0.3]} />
            <mesh>
                <sphereGeometry args={[2, 32, 32]} />
                <meshPhongMaterial
                    map={texture}
                    bumpMap={bump}
                    bumpScale={0.14}
                    normalMap={normal}
                    specularMap={specular}
                    specular={new THREE.Color('#aaa')}
                    shininess={1}
                />
            </mesh>
            {geojson && <CountryLines geojson={geojson} highlightFeature={highlightFeature} highlightPulse={highlightPulse} />}
        </group>
    );
}

const Globe3D = ({ selectedCountry }) => {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef(null);

    // Intersection Observer for visibility
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);

    // Load textures with lower resolution
    const texture = useLoader(THREE.TextureLoader, '/earth_texture.jpg', (loader) => {
        loader.setCrossOrigin('anonymous');
    });
    const bump = useLoader(THREE.TextureLoader, '/earth_bump.jpeg', (loader) => {
        loader.setCrossOrigin('anonymous');
    });
    const normal = useLoader(THREE.TextureLoader, '/earth_normal.jpg', (loader) => {
        loader.setCrossOrigin('anonymous');
    });
    const specular = useLoader(THREE.TextureLoader, '/earth_specular.jpg', (loader) => {
        loader.setCrossOrigin('anonymous');
    });

    // Optimize textures
    useEffect(() => {
        if (texture) texture.minFilter = THREE.LinearFilter;
        if (bump) bump.minFilter = THREE.LinearFilter;
        if (normal) normal.minFilter = THREE.LinearFilter;
        if (specular) specular.minFilter = THREE.LinearFilter;
    }, [texture, bump, normal, specular]);

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
        <div ref={containerRef} style={{ width: '100%', height: '370px', background: 'radial-gradient(ellipse at center,rgba(255,255,255,0.18) 0%,rgba(44,44,44,0.85) 18%,rgba(17,17,17,0.61) 80%)', borderRadius: '16px' }}>
            {isVisible && (
                <Canvas camera={{ position: [0, 1, 7], fov: 40 }} dpr={[1.5, 2]}>
                    <Suspense fallback={null}>
                        <ambientLight intensity={0.96} />
                        <pointLight position={[10, 10, 10]} intensity={7.3} />
                        {/* More stars for denser background */}
                        <Stars radius={100} depth={10} count={400} factor={4} fade speed={1} />
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
                    </Suspense>
                </Canvas>
            )}
        </div>
    );
};

export default Globe3D; 