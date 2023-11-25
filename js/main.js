const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);

window.addEventListener("load", () => {
    const loadingScreen = document.getElementById("loading-screen");

    setTimeout(() => {
        loadingScreen.style.transition = "transform 1s";
        loadingScreen.style.transform = "translateX(100%)";
        setTimeout(() => {
            loadingScreen.style.display = "none";
        }, 1000);
    }, 5000);
});



window.addEventListener('resize', () => {
    engine.resize();
});

// Initialisation //
let coreSphere;

const createScene = () => {
    const scene = new BABYLON.Scene(engine);
    const camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2, 5, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);
    camera.inputs.attached.mousewheel.detachControl(canvas);
    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = (Math.PI / 2) * 0.99;
    camera.lowerRadiusLimit = 1;
    camera.upperRadiusLimit = 200;

    const light = new BABYLON.PointLight('light', new BABYLON.Vector3(0, 0, 0), scene);
    light.intensity = 1.5;
    coreSphere = particleAndSun(scene);

    light.specular = new BABYLON.Color3(0, 0, 0);
    const ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), scene);
    ambientLight.diffuse = new BABYLON.Color3(0.01, 0.01, 0.01);
    ambientLight.specular = new BABYLON.Color3(0.1, 0.1, 0.1);

    return { scene, camera };
}

// Sun Particle Part
const createParticleSystem = (name, capacity, textureUrl, scene) => {
    const system = new BABYLON.ParticleSystem(name, capacity, scene);
    system.particleTexture = new BABYLON.Texture(textureUrl, scene);
    return system;
};
const setInitialRotation = (particleSystem, minRotation, maxRotation) => {
    particleSystem.minInitialRotation = minRotation;
    particleSystem.maxInitialRotation = maxRotation;
};
const setEmitter = (particleSystem, emitter, particleEmitterType) => {
    particleSystem.emitter = emitter;
    particleSystem.particleEmitterType = particleEmitterType;
};
const setParticleSize = (particleSystem, minSize, maxSize) => {
    particleSystem.minSize = minSize;
    particleSystem.maxSize = maxSize;
};
const setParticleLifeTime = (particleSystem, minLifeTime, maxLifeTime) => {
    particleSystem.minLifeTime = minLifeTime;
    particleSystem.maxLifeTime = maxLifeTime;
};
const setEmitPower = (particleSystem, minEmitPower, maxEmitPower) => {
    particleSystem.minEmitPower = minEmitPower;
    particleSystem.maxEmitPower = maxEmitPower;
};
const setAngularSpeed = (particleSystem, minAngularSpeed, maxAngularSpeed) => {
    particleSystem.minAngularSpeed = minAngularSpeed;
    particleSystem.maxAngularSpeed = maxAngularSpeed;
};
const particleAndSun = (scene) => {
    // Setup environment
    scene.clearColor = new BABYLON.Color3(0.0, 0.0, 0.0);

    // Emitter object
    var stars = BABYLON.Mesh.CreateBox("emitter", 0.01, scene);

    // Create a particle system
    const textures = {
        surface: "https://raw.githubusercontent.com/PatrickRyanMS/BabylonJStextures/master/ParticleSystems/Sun/T_SunSurface.png",
        flare: "https://raw.githubusercontent.com/PatrickRyanMS/BabylonJStextures/master/ParticleSystems/Sun/T_SunFlare.png",
        corona: "https://raw.githubusercontent.com/PatrickRyanMS/BabylonJStextures/master/ParticleSystems/Sun/T_Star.png",
        stars: "https://raw.githubusercontent.com/PatrickRyanMS/BabylonJStextures/master/ParticleSystems/Sun/T_Star.png",
    };
    // Texture of each particle
    const surfaceParticles = createParticleSystem("surfaceParticles", 1600, textures.surface, scene);
    const flareParticles = createParticleSystem("flareParticles", 20, textures.flare, scene);
    const coronaParticles = createParticleSystem("coronaParticles", 600, textures.corona, scene);
    const starsParticles = createParticleSystem("starsParticles", 500, textures.stars, scene);

    // Create core sphere
    var coreSphere = BABYLON.MeshBuilder.CreateSphere("coreSphere", { diameter: 2.01, segments: 64 }, scene);

    // Create core material
    var coreMat = new BABYLON.StandardMaterial("coreMat", scene)
    coreMat.emissiveColor = new BABYLON.Color3(0.3773, 0.0930, 0.0266);

    // Assign core material to sphere
    coreSphere.material = coreMat;

    // Pre-warm
    surfaceParticles.preWarmStepOffset = 10;
    surfaceParticles.preWarmCycles = 100;

    flareParticles.preWarmStepOffset = 10;
    flareParticles.preWarmCycles = 100;

    coronaParticles.preWarmStepOffset = 10;
    coronaParticles.preWarmCycles = 100;

    // Initial rotation
    setInitialRotation(surfaceParticles, -2 * Math.PI, 2 * Math.PI);
    setInitialRotation(flareParticles, -2 * Math.PI, 2 * Math.PI);
    setInitialRotation(coronaParticles, -2 * Math.PI, 2 * Math.PI);

    // Where the sun particles come from
    var sunEmitter = new BABYLON.SphereParticleEmitter();
    sunEmitter.radius = 1;
    sunEmitter.radiusRange = 0; // emit only from shape surface

    // Where the stars particles come from
    var starsEmitter = new BABYLON.SphereParticleEmitter();
    starsEmitter.radius = 70;
    starsEmitter.radiusRange = 0; // emit only from shape surface

    // Assign particles to emitters
    setEmitter(surfaceParticles, coreSphere, sunEmitter);
    setEmitter(flareParticles, coreSphere, sunEmitter);
    setEmitter(coronaParticles, coreSphere, sunEmitter);
    setEmitter(starsParticles, stars, starsEmitter);

    // Random starting color
    starsParticles.color1 = new BABYLON.Color4(0.898, 0.737, 0.718, 1.0);
    starsParticles.color2 = new BABYLON.Color4(0.584, 0.831, 0.894, 1.0);

    // Color gradient over time
    surfaceParticles.addColorGradient(0, new BABYLON.Color4(0.8509, 0.4784, 0.1019, 0.0));
    surfaceParticles.addColorGradient(0.4, new BABYLON.Color4(0.6259, 0.3056, 0.0619, 0.5));
    surfaceParticles.addColorGradient(0.5, new BABYLON.Color4(0.6039, 0.2887, 0.0579, 0.5));
    surfaceParticles.addColorGradient(1.0, new BABYLON.Color4(0.3207, 0.0713, 0.0075, 0.0));

    flareParticles.addColorGradient(0, new BABYLON.Color4(1, 0.9612, 0.5141, 0.0));
    flareParticles.addColorGradient(0.25, new BABYLON.Color4(0.9058, 0.7152, 0.3825, 1.0));
    flareParticles.addColorGradient(1.0, new BABYLON.Color4(0.6320, 0.0, 0.0, 0.0));

    coronaParticles.addColorGradient(0, new BABYLON.Color4(0.8509, 0.4784, 0.1019, 0.0));
    coronaParticles.addColorGradient(0.5, new BABYLON.Color4(0.6039, 0.2887, 0.0579, 0.12));
    coronaParticles.addColorGradient(1.0, new BABYLON.Color4(0.3207, 0.0713, 0.0075, 0.0));

    // Size of each particle (random between...
    setParticleSize(surfaceParticles, 0.4, 0.7);

    flareParticles.minScaleX = 0.5;
    flareParticles.minScaleY = 0.5;
    flareParticles.maxScaleX = 1.0;
    flareParticles.maxScaleY = 1.0;

    coronaParticles.minScaleX = 0.5;
    coronaParticles.minScaleY = 0.75;
    coronaParticles.maxScaleX = 1.2;
    coronaParticles.maxScaleY = 3.0;

    setParticleSize(starsParticles, 0.15, 0.3);

    // Size over lifetime
    flareParticles.addSizeGradient(0, 0);
    flareParticles.addSizeGradient(1, 1);

    // Life time of each particle (random between...
    setParticleLifeTime(surfaceParticles, 8.0, 8.0);
    setParticleLifeTime(flareParticles, 10.0, 10.0);
    setParticleLifeTime(coronaParticles, 2.0, 2.0);
    setParticleLifeTime(starsParticles, 999999, 999999);

    // Emission rate
    surfaceParticles.emitRate = 200;
    flareParticles.emitRate = 1;
    coronaParticles.emitRate = 300;

    // Burst rate
    starsParticles.manualEmitCount = 500;
    starsParticles.maxEmitPower = 0.0;

    // Blend mode : BLENDMODE_ONEONE, BLENDMODE_STANDARD, or BLENDMODE_ADD
    surfaceParticles.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
    flareParticles.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
    coronaParticles.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
    starsParticles.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;

    // Set the gravity of all particles
    surfaceParticles.gravity = new BABYLON.Vector3(0, 0, 0);
    flareParticles.gravity = new BABYLON.Vector3(0, 0, 0);
    coronaParticles.gravity = new BABYLON.Vector3(0, 0, 0);
    starsParticles.gravity = new BABYLON.Vector3(0, 0, 0);

    // Angular speed
    setAngularSpeed(surfaceParticles, -0.4, 0.4);
    setAngularSpeed(flareParticles, 0.0, 0.0);
    setAngularSpeed(coronaParticles, 0.0, 0.0);
    setAngularSpeed(starsParticles, 0.0, 0.0);

    // Speed
    setEmitPower(surfaceParticles, 0, 0);
    surfaceParticles.updateSpeed = 0.005;

    setEmitPower(flareParticles, 0.001, 0.01);

    setEmitPower(coronaParticles, 0, 0);

    setEmitPower(starsParticles, 0, 0);

    // No billboard
    surfaceParticles.isBillboardBased = false;
    flareParticles.isBillboardBased = true;
    coronaParticles.isBillboardBased = true;
    starsParticles.isBillboardBased = true;

    // Render Order
    starsParticles.renderingGroupId = 0;
    coronaParticles.renderingGroupId = 0;
    flareParticles.renderingGroupId = 2;
    surfaceParticles.renderingGroupId = 0;
    coreSphere.renderingGroupId = 0;

    // Start the particle system
    surfaceParticles.start();
    flareParticles.start();
    coronaParticles.start();
    starsParticles.start();

    return coreSphere
}


const { scene, camera } = createScene();
let k = 0;
let actualdiameter = 4.02;
engine.runRenderLoop(() => { // Boucle de render
    planets.forEach(({ planet, rotationSpeed, animationSpeed, distance }) => {
        rotatePlanet(planet, rotationSpeed);
        animatePlanets(planet, animationSpeed, distance, scene);
    });
    if (currentPlanetTarget) {
        planets.forEach(({ planet, diameter }) => {
            if (planet.name == currentPlanetTarget.name) {
                actualdiameter = diameter;
                return;
            }
        });
        if (currentPlanetTarget.name == "coreSphere") {
            actualdiameter = 4.02;
        }
        const fixedDistance = actualdiameter * 2; // Ajustez cette valeur pour définir la distance fixe entre la caméra et la planète cible
        const direction = camera.target.subtract(camera.position).normalize();
        camera.position = camera.target.subtract(direction.scale(fixedDistance));
        const smoothingFactor = 0.1; // Ajustez cette valeur pour contrôler la vitesse de lissage
        camera.target = BABYLON.Vector3.Lerp(camera.target, currentPlanetTarget.position, smoothingFactor);
    }

    scene.render();
});

const createPlanet = (name, diameter, scene) => {
    const planet = BABYLON.MeshBuilder.CreateSphere(name, { diameter: diameter }, scene);
    planet.specular = new BABYLON.Color3(0, 0, 0);
    return planet;
}

const applyTexture = (planet, texturePath, scene) => { // Textures
    const material = new BABYLON.StandardMaterial(`${planet.name}Material`, scene);
    material.diffuseTexture = new BABYLON.Texture(texturePath, scene);
    planet.material = material;
}

// INITIALISATION PLANETES
const mercure = createPlanet('mercure', 0.038, scene);
const venus = createPlanet('venus', 0.095, scene);
const earth = createPlanet('earth', 0.1, scene);
const mars = createPlanet('mars', 0.053, scene);
const jupiter = createPlanet('jupiter', 1.12, scene);
const saturne = createPlanet('saturne', 0.945, scene);
const uranus = createPlanet('uranus', 0.401, scene);
const neptune = createPlanet('neptune', 0.388, scene);

const planets = [
    { planet: mercure, rotationSpeed: 0.017, animationSpeed: 0.161, distance: 10, diameter: 0.038 },
    { planet: venus, rotationSpeed: 0.004, animationSpeed: 0.118, distance: 20, diameter: 0.095 },
    { planet: earth, rotationSpeed: 0.01, animationSpeed: 0.1, distance: 30, diameter: 0.1 },
    { planet: mars, rotationSpeed: 0.0097, animationSpeed: 0.081, distance: 40, diameter: 0.053 },
    { planet: jupiter, rotationSpeed: 0.0244, animationSpeed: 0.044, distance: 50, diameter: 1.12 },
    { planet: saturne, rotationSpeed: 0.0222, animationSpeed: 0.033, distance: 60, diameter: 0.945 },
    { planet: uranus, rotationSpeed: 0.0139, animationSpeed: 0.023, distance: 70, diameter: 0.401 },
    { planet: neptune, rotationSpeed: 0.0149, animationSpeed: 0.018, distance: 80, diameter: 0.388 },
];


let i = 0;
planets.forEach(element => {
    element.planet.position = new BABYLON.Vector3(element.distance, 0, 0);
    applyTexture(element.planet, 'assets/textures/Planets/' + element.planet.name + '.jpg', scene);
    element.planet.orbitAngle = (2 * Math.PI) * (i++ / 8);
});

const rotatePlanet = (planet, speed) => { // Fonction Rotation
    planet.rotation.y += speed;
}
const animatePlanets = (planet, speed, distance, scene) => { // Fonction Animation
    const time = scene.getEngine().getDeltaTime() * 0.001;
    planet.orbitAngle = (planet.orbitAngle + speed * time) % (2 * Math.PI);
    planet.position.x = distance * Math.cos(planet.orbitAngle);
    planet.position.z = distance * Math.sin(planet.orbitAngle);
};

// BOUTTONS
let currentPlanetTarget = null;

const animateCameraToPlanet = (planet, camera, scene) => {
    currentPlanetTarget = planet;
    const targetPosition = planet.position.clone();
    targetPosition.y += 2;

    const cameraTargetAnimation = new BABYLON.Animation("cameraTargetAnimation", "target", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    const cameraRadiusAnimation = new BABYLON.Animation("cameraRadiusAnimation", "radius", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    const cameraAlphaAnimation = new BABYLON.Animation("cameraAlphaAnimation", "alpha", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    const targetKeys = [];
    const radiusKeys = [];
    const alphaKeys = [];

    targetKeys.push({ frame: 0, value: camera.target });
    targetKeys.push({ frame: 120, value: targetPosition });

    radiusKeys.push({ frame: 0, value: camera.radius });
    radiusKeys.push({ frame: 120, value: planet.position.length() + planet.scaling.x / 2 });

    alphaKeys.push({ frame: 0, value: camera.alpha });
    alphaKeys.push({ frame: 120, value: camera.alpha + Math.PI });

    cameraTargetAnimation.setKeys(targetKeys);
    cameraRadiusAnimation.setKeys(radiusKeys);
    cameraAlphaAnimation.setKeys(alphaKeys);

    camera.animations = [];
    camera.animations.push(cameraTargetAnimation);
    camera.animations.push(cameraRadiusAnimation);
    camera.animations.push(cameraAlphaAnimation);

    scene.beginAnimation(camera, 0, 120, false);
};

document.getElementById('btncoreSphere').addEventListener('click', () => animateCameraToPlanet(coreSphere, camera, scene));
document.getElementById('btnMercure').addEventListener('click', () => animateCameraToPlanet(mercure, camera, scene));
document.getElementById('btnVenus').addEventListener('click', () => animateCameraToPlanet(venus, camera, scene));
document.getElementById('btnEarth').addEventListener('click', () => animateCameraToPlanet(earth, camera, scene));
document.getElementById('btnMars').addEventListener('click', () => animateCameraToPlanet(mars, camera, scene));
document.getElementById('btnJupiter').addEventListener('click', () => animateCameraToPlanet(jupiter, camera, scene));
document.getElementById('btnSaturne').addEventListener('click', () => animateCameraToPlanet(saturne, camera, scene));
document.getElementById('btnUranus').addEventListener('click', () => animateCameraToPlanet(uranus, camera, scene));
document.getElementById('btnNeptune').addEventListener('click', () => animateCameraToPlanet(neptune, camera, scene));

const createSpaceSkybox = (scene) => { // Skybox
    const skybox = BABYLON.Mesh.CreateBox('0', 1000.0, scene);
    const skyboxMaterial = new BABYLON.StandardMaterial('skyboxMaterial', scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('assets/textures/Space/2/skybox', scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    skybox.infiniteDistance = true;
    skybox.renderingGroupId = 0;
    return skybox;
};

const skybox = createSpaceSkybox(scene);

// SUITE
let isAnimating = false;

document.querySelectorAll("#planetButtons div").forEach((div) => {
    div.addEventListener("click", function () {
        if (isAnimating) return;
        const divToShowId = this.id.slice(3).toLowerCase();
        const activeDiv = document.querySelector(".active");
        if (activeDiv) {
            fadeInOut(activeDiv, document.getElementById("div" + divToShowId));
        } else {
            const firstDiv = document.getElementById("divcoresphere");
            fadeInOut(firstDiv, document.getElementById("div" + divToShowId));
        }
    });
});

function fadeInOut(activeDiv, nextDiv) {
    if (activeDiv === nextDiv || !nextDiv) return;

    isAnimating = true;
    activeDiv.classList.remove("active");
    const activeRight = activeDiv.querySelector(".div-droite");

    let opacity = 0.8;
    let fadeOutInterval = setInterval(() => {
        if (opacity <= 0) {
            clearInterval(fadeOutInterval);
            activeDiv.style.visibility = "hidden";

            fadeIn(nextDiv);
        } else {
            opacity -= 0.03;
            activeRight.style.opacity = opacity;
        }
    }, 100);
}

function fadeIn(nextDiv) {
    if (!nextDiv) return;
    const nextRight = nextDiv.querySelector(".div-droite");
    let opacity = 0;
    let fadeInInterval = setInterval(() => {
        if (nextDiv.id == "divmercure") {
            skillscontent = document.querySelectorAll("#divmercure .div-droite .content .container .box .content");
            skillscontent.forEach(element => {
                element.style.visibility = "hidden";
            });
        }
        if (opacity >= 0.8) {
            if (nextDiv.id == "divmercure") {
                skillscontent.forEach(element => {
                    element.style.visibility = "visible";
                });
            }
            clearInterval(fadeInInterval);
            nextDiv.classList.add("active");
            isAnimating = false;
        } else {
            nextDiv.style.visibility = "visible";
            opacity += 0.03;
            nextRight.style.opacity = opacity;
        }
    }, 100);
}