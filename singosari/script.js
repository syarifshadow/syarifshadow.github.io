import {
    WebGLRenderer,
    PerspectiveCamera,
    Scene,
    sRGBEncoding,
    Clock,
    Vector3,
    Color,
} from "./three.module.js";

import {
    OrbitControls
} from "./OrbitControls.js";
import {
    GLTFLoader
} from "./GLTFLoader.js";
import {
    DRACOLoader
} from "./DRACOLoader.js";
import {
    gsap 
} from "./gsap-core.js";
import {
    SplitText
} from "./SplitText.js";
import {
    CSSPlugin
} from "./CSSPlugin.js";



class Sketch {
    constructor() {
        gsap.registerPlugin(CSSPlugin);
        gsap.registerPlugin(SplitText);

        this.loader = document.querySelector('.loader');

        this.canvas = document.querySelector('canvas.webgl');
        this.nextButton = document.querySelector('.button.next');
        this.previousButton = document.querySelector('.button.previous');

        this.renderer = new WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: false,
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 1);
        this.renderer.outputEncoding = sRGBEncoding;

        this.camera = new PerspectiveCamera(30,window.innerWidth / window.innerHeight,0.1,1000 );
        this.camera.position.set(0, 0, 50);

        this.scene = new Scene();
        this.scene.background = new Color(0x000000);
        this.cameras = [];
        this.targets = [];
        this.focuses = [];
        this.steps = 0;
        this.currentStep = -1;
        this.tempFocus = 0;
        this.tempTarget = new Vector3();
        this.nextTarget = new Vector3();
        this.nextCamPosition = new Vector3();

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;

        this.postprocessing = false;

        this.clock = new Clock();
        this.resize();
        this.init();
    }

    init() {
        this.addEvents();
        this.loadModel();
    }

    addCanvas() {
        this.canvas = this.renderer.domElement;
        document.body.appendChild(this.canvas);
    }

    addEvents() {
        window.addEventListener('resize', this.resize.bind(this));
        this.nextButton.addEventListener('click', this.nextStep.bind(this));
        this.previousButton.addEventListener('click', this.previousStep.bind(this));
    }

    loadModel() {
        const loader = new GLTFLoader();

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('./');
        loader.setDRACOLoader(dracoLoader);


        loader.load('./barbebleue2.glb', (gltf) => {
                this.gltf = gltf;
                this.scene.add(this.gltf.scene);
                this.steps = this.gltf.cameras.length;

                for (let i = 0; i < this.steps; i++) {
                    const camera = gltf.cameras.find(x => x.name === "Camera" + i + "_Orientation");
                    const target = this.scene.getObjectByName("target" + i);
                    const focus = this.scene.getObjectByName("focus" + i);
                    this.targets.push(target);
                    this.cameras.push(camera);
                    this.focuses.push(focus);
                }

                this.gltf.scene.position.set(0, -20, 0)
                this.gltf.scene.rotation.y = -3.14;

                this.loader.style.display = "none";

                this.onBoard();
                this.render();

                /*
                gltf.animations; // Array<THREE.AnimationClip>
                gltf.scene; // THREE.Group
                gltf.scenes; // Array<THREE.Group>
                gltf.cameras; // Array<THREE.Camera>
                gltf.asset; // Object
                */

            },
            // called while loading is progressing
            (xhr) => {
                this.loader.innerHTML = Math.round(xhr.loaded / xhr.total * 100) + '%';
                //console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

            },
            // called when loading has errors
            (error) => {

                console.log('An error happened', error);

            }
        );

    }

    onBoard() {
        this.firstPlay = true;
        this.setTitleAnim()
        this.showTitle();
        this.showHouse();
    }

    setTitleAnim() {
        const st = new SplitText(".title.big", {
            type: "chars"
        });
        this.chars = st.chars;

        this.tl = gsap.timeline({
            onComplete: () => {
                this.titleVisible();
            }
        });

        gsap.set(".title.big", {
            perspective: 400
        });
        gsap.set(".title.big", {
            opacity: 1
        });
        gsap.set(".outro", {
            opacity: 0
        });
        gsap.set(".intro", {
            opacity: 0
        });

        this.tl.add("showTitle");

        this.tl.from(this.chars, {
            duration: 3,
            opacity: 0,
            scale: 0,
            y: 120,
            rotationX: 90,
            transformOrigin: "0% 50% -50",

            ease: "Power4.easeOut",
            stagger: 0.05,
        }, "showTitle+=1");

        this.tl.to(".intro", {
            duration: 2,
            opacity: 1,
            ease: "Power2.easeOut",
        }, "showTitle+=1.3");

        this.tl.to(".outro", {
            duration: 2,
            opacity: 1,
            ease: "Power2.easeOut",
        }, "showTitle+=1.6");

        this.tl.pause();
    }

    showTitle() {
        this.tl.timeScale(1);
        this.tl.play();
    }

    titleVisible() {
        if (this.firstPlay) {
            this.nextStep();
            this.showButtons();
            this.firstPlay = false;
        }
    }

    showButtons() {
        gsap.to(".button.previous", {
            opacity: 1,
            duration: 1,
            ease: "Power4.easeOut"
        })

        gsap.to(".button.next", {
            opacity: 1,
            duration: 1,
            ease: "Power4.easeOut",
            delay: .1
        })
    }

    hideTitle() {
        this.tl.timeScale(2);
        this.tl.reverse();
    }

    showHouse() {
        gsap.to(this.gltf.scene.position, {
            x: 0,
            y: 0,
            z: 0,
            duration: 5,
            ease: "Power2.easeOut",
        })

        gsap.to(this.gltf.scene.rotation, {
            x: 0,
            y: 0,
            z: 0,
            duration: 5,
            ease: "Power2.easeOut",
        })
    }
    resize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
    previousStep() {
        this.currentStep--;
        this.currentStep = (this.currentStep < 0) ? this.steps - 1 : this.currentStep;
        this.updateStep();
    }

    nextStep() {
        this.currentStep++;
        this.currentStep = (this.currentStep > this.steps - 1) ? 0 : this.currentStep;
        this.updateStep();
    }

    updateStep() {

        if (this.currentStep == 0) {
            if (!this.firstPlay) {
                this.showTitle();
            }
        } else {
            this.hideTitle();
        }

        const camPos = this.cameras[this.currentStep].parent.position;
        const target = this.targets[this.currentStep].position;
        const focusPos = this.focuses[this.currentStep].position;
        const focusScale = this.focuses[this.currentStep].scale.x;

        gsap.to(this.tempTarget, {
            x: target.x,
            y: target.y,
            z: target.z,
            duration: 3,
            ease: "Power3.easeInOut",
        })

        gsap.to(this.camera.position, {
            x: camPos.x,
            y: camPos.y,
            z: camPos.z,
            duration: 3,
            ease: "Power3.easeInOut",

            onUpdate: () => {
                this.camera.lookAt(this.tempTarget)
                this.controls.target = this.tempTarget
            }
        })

    }

    render() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        this.renderer.setAnimationLoop(this.render.bind(this));

    }
}

new Sketch();