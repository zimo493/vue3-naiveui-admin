<template>
  <canvas ref="canvas" block :width="width" :height="height" />
</template>

<script lang="ts" setup>
// 类型定义
interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Point3DWithP extends Point3D {
  p: number;
}

interface Camera {
  obj: Point3D;
  dest: Point3D;
  dist: Point3D;
  ang: {
    cplane: number;
    splane: number;
    ctheta: number;
    stheta: number;
  };
  zoom: number;
  disp: Point3D;
  upd: () => void;
}

interface ThreeDParam {
  vtx: Point3D;
  sz: Point3D;
  rot: Point3D;
  pos: Point3D;
}

defineOptions({ name: "DynamicCanvas" });

// 响应式状态
const canvasRef = useTemplateRef("canvas");
const width = ref(window.innerWidth);
const height = ref(window.innerHeight);

// 常量
/**
 * 初始粒子数量
 */
const INITIAL_PARTICLES = 180;
/**
 * 粒子位置差值
 */
const PARTICLE_DIFF = 200;
/**
 * 速度
 */
const VELOCITY = 0.04;
/**
 * 旋转角度限制
 */
const ROTATION_LIMIT = 360;
/**
 * 相机Z轴位置(相机高度)
 */
const CAMERA_Z = 150;

// 辅助函数
const degreesToRadians = (degrees: number): number => (degrees * Math.PI) / 180;
const randomSin = (): number => Math.sin((Math.floor(Math.random() * 360) * Math.PI) / 180);

// 相机实例
const cam: Camera = {
  obj: { x: 0, y: 0, z: CAMERA_Z },
  dest: { x: 0, y: 0, z: 1 },
  dist: { x: 0, y: 0, z: 200 },
  ang: { cplane: 0, splane: 0, ctheta: 0, stheta: 0 },
  zoom: 1,
  disp: { x: width.value / 2, y: height.value / 2, z: 0 },
  upd() {
    this.dist.x = this.dest.x - this.obj.x;
    this.dist.y = this.dest.y - this.obj.y;
    this.dist.z = this.dest.z - this.obj.z;

    const distXZ = Math.sqrt(this.dist.x * this.dist.x + this.dist.z * this.dist.z);
    const distXYZ = Math.sqrt(distXZ * distXZ + this.dist.y * this.dist.y);

    this.ang.cplane = -this.dist.z / distXZ;
    this.ang.splane = this.dist.x / distXZ;
    this.ang.ctheta = distXZ / distXYZ;
    this.ang.stheta = -this.dist.y / distXYZ;
  },
};

// 变换实例
const trans = {
  parts: {
    sz: (p: Point3D, sz: Point3D): Point3DWithP => ({
      x: p.x * sz.x,
      y: p.y * sz.y,
      z: p.z * sz.z,
      p: 0,
    }),
    rot: {
      x: (p: Point3DWithP, rot: Point3D): Point3DWithP => ({
        x: p.x,
        y: p.y * Math.cos(degreesToRadians(rot.x)) - p.z * Math.sin(degreesToRadians(rot.x)),
        z: p.y * Math.sin(degreesToRadians(rot.x)) + p.z * Math.cos(degreesToRadians(rot.x)),
        p: p.p,
      }),
      y: (p: Point3DWithP, rot: Point3D): Point3DWithP => ({
        x: p.x * Math.cos(degreesToRadians(rot.y)) + p.z * Math.sin(degreesToRadians(rot.y)),
        y: p.y,
        z: -p.x * Math.sin(degreesToRadians(rot.y)) + p.z * Math.cos(degreesToRadians(rot.y)),
        p: p.p,
      }),
      z: (p: Point3DWithP, rot: Point3D): Point3DWithP => ({
        x: p.x * Math.cos(degreesToRadians(rot.z)) - p.y * Math.sin(degreesToRadians(rot.z)),
        y: p.x * Math.sin(degreesToRadians(rot.z)) + p.y * Math.cos(degreesToRadians(rot.z)),
        z: p.z,
        p: p.p,
      }),
    },
    pos: (p: Point3DWithP, pos: Point3D): Point3DWithP => ({
      x: p.x + pos.x,
      y: p.y + pos.y,
      z: p.z + pos.z,
      p: p.p,
    }),
  },
  pov: {
    plane: (p: Point3DWithP): Point3DWithP => ({
      x: p.x * cam.ang.cplane + p.z * cam.ang.splane,
      y: p.y,
      z: p.x * -cam.ang.splane + p.z * cam.ang.cplane,
      p: p.p,
    }),
    theta: (p: Point3DWithP): Point3DWithP => ({
      x: p.x,
      y: p.y * cam.ang.ctheta - p.z * cam.ang.stheta,
      z: p.y * cam.ang.stheta + p.z * cam.ang.ctheta,
      p: p.p,
    }),
    set: (p: Point3DWithP): Point3DWithP => ({
      x: p.x - cam.obj.x,
      y: p.y - cam.obj.y,
      z: p.z - cam.obj.z,
      p: p.p,
    }),
  },
  persp: (p: Point3D): Point3DWithP => ({
    x: ((p.x * cam.dist.z) / p.z) * cam.zoom,
    y: ((p.y * cam.dist.z) / p.z) * cam.zoom,
    z: p.z * cam.zoom,
    p: cam.dist.z / p.z,
  }),
  disp: (p: Point3DWithP, disp: Point3D): Point3DWithP => ({
    x: p.x + disp.x,
    y: -p.y + disp.y,
    z: p.z + disp.z,
    p: p.p,
  }),
  steps: (obj: Point3D, sz: Point3D, rot: Point3D, pos: Point3D, disp: Point3D): Point3DWithP => {
    let p = trans.parts.sz(obj, sz);

    p = trans.parts.rot.x(p, rot);
    p = trans.parts.rot.y(p, rot);
    p = trans.parts.rot.z(p, rot);
    p = trans.parts.pos(p, pos);
    p = trans.pov.plane(p);
    p = trans.pov.theta(p);
    p = trans.pov.set(p);
    p = trans.persp(p);
    p = trans.disp(p, disp);

    return p;
  },
};

// ThreeD 类
class ThreeD {
  transIn: ThreeDParam;
  transOut: Point3DWithP;

  constructor(param: ThreeDParam) {
    this.transIn = {
      vtx: param.vtx,
      sz: param.sz,
      rot: param.rot,
      pos: param.pos,
    };
    this.transOut = { x: 0, y: 0, z: 0, p: 0 };
  }

  vupd(): void {
    this.transOut = trans.steps(
      this.transIn.vtx,
      this.transIn.sz,
      this.transIn.rot,
      this.transIn.pos,
      cam.disp
    );
  }
}

// ParticleSystem 类
class ParticleSystem {
  private readonly vel = VELOCITY;
  private readonly lim = ROTATION_LIMIT;
  private readonly diff = PARTICLE_DIFF;
  private toX = 0;
  private toY = 0;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly particles: ThreeD[] = [];
  private readonly calculations: Point3D[] = [];
  private rotationObj: Point3D = { x: 0, y: 0, z: 0 };
  private readonly objSize: Point3D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Failed to get 2D context");
    this.ctx = ctx;
    this.objSize = {
      x: width.value / 5,
      y: height.value / 5,
      z: width.value / 5,
    };
    this.initialize();
  }

  private initialize(): void {
    this.ctx.globalCompositeOperation = "source-over";
    for (let i = 0; i < INITIAL_PARTICLES; i++) {
      this.addParticle();
    }
  }

  private addParticle(): void {
    const angle = Math.random() * Math.PI * 2;
    const pos = {
      x: this.diff * Math.sin(angle),
      y: this.diff * Math.sin(angle),
      z: this.diff * Math.sin(angle),
    };

    this.particles.push(
      new ThreeD({
        vtx: { x: randomSin(), y: randomSin(), z: randomSin() },
        sz: { x: 0, y: 0, z: 0 },
        rot: { x: 20, y: -20, z: 0 },
        pos,
      })
    );

    this.calculations.push({
      x: Math.random() * 360,
      y: Math.random() * 360,
      z: Math.random() * 360,
    });
  }

  public update(): void {
    cam.obj.x += (this.toX - cam.obj.x) * 0.05;
    cam.obj.y += (this.toY - cam.obj.y) * 0.05;
  }

  public draw(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    cam.upd();
    this.updateRotation();
    this.drawParticles();
  }

  private updateRotation(): void {
    this.rotationObj.x += 0.1;
    this.rotationObj.y += 0.1;
    this.rotationObj.z += 0.1;
  }

  private drawParticles(): void {
    this.particles.forEach((particle, i) => {
      this.updateParticleCalculations(i);
      this.updateParticleTransform(particle, i);
      this.renderParticle(particle, i);
    });
  }

  private updateParticleCalculations(index: number): void {
    for (const axis of ["x", "y", "z"] as const) {
      this.calculations[index][axis] += this.vel;
      if (this.calculations[index][axis] > this.lim) {
        this.calculations[index][axis] = 0;
      }
    }
  }

  private updateParticleTransform(particle: ThreeD, index: number): void {
    particle.transIn.pos = {
      x: this.diff * Math.cos((this.calculations[index].x * Math.PI) / 180),
      y: this.diff * Math.sin((this.calculations[index].y * Math.PI) / 180),
      z: this.diff * Math.sin((this.calculations[index].z * Math.PI) / 180),
    };
    particle.transIn.rot = this.rotationObj;
    particle.transIn.sz = this.objSize;
    particle.vupd();
  }

  private renderParticle(particle: ThreeD, index: number): void {
    if (particle.transOut.p < 0) return;

    const g = this.ctx.createRadialGradient(
      particle.transOut.x,
      particle.transOut.y,
      particle.transOut.p,
      particle.transOut.x,
      particle.transOut.y,
      particle.transOut.p * 2
    );

    this.ctx.globalCompositeOperation = "lighter";
    g.addColorStop(0, "hsla(255, 255%, 255%, 1)");
    g.addColorStop(0.5, `hsla(${index + 2}, 85%, 40%, 1)`);
    g.addColorStop(1, `hsla(${index}, 85%, 40%, .5)`);

    this.ctx.fillStyle = g;
    this.ctx.beginPath();
    this.ctx.arc(
      particle.transOut.x,
      particle.transOut.y,
      particle.transOut.p * 2,
      0,
      Math.PI * 2,
      false
    );
    this.ctx.fill();
    this.ctx.closePath();
  }

  public handleResize(): void {
    this.canvas.width = width.value;
    this.canvas.height = height.value;
  }

  public handleMouseMove(e: MouseEvent): void {
    this.toX = (e.clientX - this.canvas.width / 2) * -0.8;
    this.toY = (e.clientY - this.canvas.height / 2) * 0.8;
  }

  public handleTouchMove(e: TouchEvent): void {
    e.preventDefault();
    this.toX = (e.touches[0].clientX - this.canvas.width / 2) * -0.8;
    this.toY = (e.touches[0].clientY - this.canvas.height / 2) * 0.8;
  }

  public addParticles(count = 100): void {
    for (let i = 0; i < count; i++) {
      this.addParticle();
    }
  }
}

// 初始化
let particleSystem: ParticleSystem | null;
// 添加 animationFrameId 变量
let animationFrameId: number;

/**
 * 处理鼠标移动事件
 * @param {MouseEvent} e - 鼠标事件对象
 */
const handleMouseMove = (e: MouseEvent) => particleSystem?.handleMouseMove(e);
/**
 * 处理触摸移动事件
 * @param {TouchEvent} e - 触摸事件对象
 */
const handleTouchMove = (e: TouchEvent) => particleSystem?.handleTouchMove(e);
/**
 * 处理鼠标按下事件的函数
 * 当鼠标按下时，调用粒子系统的 addParticles 方法生成粒子
 */
const handleMouseDown = () => particleSystem?.addParticles();
/**
 * 处理触摸开始事件的函数
 * @param {TouchEvent} e - 触摸事件对象，包含了触摸事件的相关信息
 */
const handleTouchStart = (e: TouchEvent) => {
  e.preventDefault();
  particleSystem?.addParticles();
};

/**
 * 处理窗口大小变更事件的方法
 */
const handleResize = () => {
  // 更新canvas的宽度和高度
  width.value = window.innerWidth;
  height.value = window.innerHeight;
  particleSystem?.handleResize();
};

onMounted(() => {
  if (!canvasRef.value) return;

  particleSystem = new ParticleSystem(canvasRef.value);

  // 添加事件监听
  window.addEventListener("resize", handleResize);
  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("touchmove", handleTouchMove);
  window.addEventListener("mousedown", handleMouseDown);
  window.addEventListener("touchstart", handleTouchStart);

  const animate = () => {
    particleSystem?.update();
    particleSystem?.draw();
    animationFrameId = requestAnimationFrame(animate);
  };

  animationFrameId = requestAnimationFrame(animate);
});

onUnmounted(() => {
  // 解绑所有事件
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("mousemove", handleMouseMove);
  window.removeEventListener("touchmove", handleTouchMove);
  window.removeEventListener("mousedown", handleMouseDown);
  window.removeEventListener("touchstart", handleTouchStart);

  // 停止动画循环
  cancelAnimationFrame(animationFrameId);

  // 清理 ParticleSystem 实例
  particleSystem = null;
});
</script>
