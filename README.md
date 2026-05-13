# Cell Architecture Studio

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=111)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=fff)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite&logoColor=fff)
![Three.js](https://img.shields.io/badge/Three.js-0.181-000000?logo=threedotjs&logoColor=fff)
![3D Assets](https://img.shields.io/badge/GLB-native%20materials-4f8a3f)
![Verification](https://img.shields.io/badge/verification-playwright%20screenshots-2ea44f)
![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-local%20prototype-f59e0b)
[![Live Demo](https://img.shields.io/badge/live-demo-16a34a)](https://cell-architecture-studio-inky.vercel.app)

基于 React + Three.js 的交互式 3D 细胞结构画廊，用于生物学教学与科普展示。项目使用 GLB 模型与程序化几何体构建高保真细胞视图，支持细胞类型选择、细胞器详情、对比模式、响应式布局及可视化验证。

## 在线演示

[打开 Vercel 在线部署](https://cell-architecture-studio-inky.vercel.app)

[![Cell Architecture Studio demo](docs/media/cell-architecture-studio-demo.gif)](https://cell-architecture-studio-inky.vercel.app)

[查看 MP4 演示视频](docs/media/cell-architecture-studio-demo.mp4)

## 功能亮点

- 七种标本视图：植物细胞、白细胞、神经元、上皮细胞、细菌、动物细胞、肌肉细胞
- 植物细胞与白细胞的高保真 GLB 渲染，保留原生纹理材质
- 以 3D 画布渲染为默认视图的 Mesh 优先体验
- AI 导师面板：学习提示、课程聚焦、掌握度追踪
- 针对弱网环境下大型 GLB 资产的模型加载进度覆盖层
- 尚无生产级 GLB 模型的标本提供程序化回退几何体
- 细胞器详情面板、显微镜模式、标本元数据及对比工作流
- 响应式桌面端、紧凑端与移动端布局，支持浏览器截图验证

## 预览模式

| 模式 | 用途 |
| --- | --- |
| Mesh | 加载可用的 GLB 模型或程序化 Three.js 几何体 |
| Focus | 聚焦选中细胞器，高亮显示并附带生物学细节 |

## 技术栈

| 层级 | 技术 |
| --- | --- |
| 应用框架 | React 19、TypeScript、Vite |
| 3D 渲染 | Three.js、React Three Fiber、Drei |
| 界面样式 | CSS 模块（`src/styles.css`）、Lucide 图标 |
| 素材资源 | GLB 模型、透明 PNG 缩略图、NIH 预览图 |
| 验证工具 | Playwright Core、PNG 像素指标 |

## 项目结构

```text
.
|-- docs/
|   |-- media/
|   `-- ASSETS.md
|-- public/
|   |-- cell-renders/
|   |-- cell-renders-transparent/
|   |-- models/
|   `-- nih-previews/
|-- scripts/
|   `-- verify.mjs
`-- src/
    |-- App.tsx
    |-- components/
    |-- data/
    `-- styles.css
```

## 快速开始

安装依赖：

```bash
npm install
```

启动本地开发服务器：

```bash
npm run dev
```

访问应用：

```text
http://127.0.0.1:5173/
```

生产构建：

```bash
npm run build
```

运行可视化验证：

```bash
npm run verify
```

## 素材说明

最高保真度的标本从 `public/models/` 加载，在 `src/data/cells.ts` 中配置。

| 标本 | 当前资产 |
| --- | --- |
| 植物细胞 | `public/models/plant-cell-first001.glb` |
| 白细胞 | `public/models/white-blood-cell-user.glb` |
| 动物细胞 | `public/models/animal-cell-nih.glb` |
| 神经元 | `public/models/neuron-nih.glb` |
| 细菌壁 | `public/models/bacteria-wall-nih.glb` |

`public/cell-renders-transparent/` 中的透明 PNG 用于缩略图和模型预览。详细的素材来源记录在 `docs/ASSETS.md`。

## 可视化验证

`npm run verify` 启动本地应用，截取桌面端、紧凑端、移动端及交互截图，然后检查画布像素指标以捕获空白渲染或重大布局回归。

当前覆盖范围：

- 桌面端、紧凑端与移动端冒烟测试
- 植物细胞 GLB 渲染检查
- 白细胞 GLB 渲染检查
- 细菌 Mesh 交互检查
- 对比弹窗检查

## 路线图

- 为其余标本添加生产级 GLB 模型
- 添加懒加载与路由级代码拆分以优化 3D 资产加载
- 扩展各细胞器的教育注释
- 添加截图导出与 3D 导出工作流
- 在界面中直接展示资产许可证元数据

## 许可证

应用代码基于 MIT 许可证发布。包含的 GLB 模型和图像资产保留其在 `docs/ASSETS.md` 中记录的原始来源许可。

## 致谢

特别感谢原作者 [@DilumSanjaya](https://x.com/DilumSanjaya) 提供的灵感与视觉方向。

其余 3D 模型来源详见 `docs/ASSETS.md`。
