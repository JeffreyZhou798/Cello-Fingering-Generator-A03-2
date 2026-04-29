# 🎻 Cello Fingering Generator - Complete Edition with Thumb Position

An AI-powered cello fingering generation system using **complete Dyna-Q reinforcement learning algorithm** with **full thumb position support**. Upload MusicXML files and get optimal fingering suggestions - **runs entirely in your browser!**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[English](#english) | [中文](#中文) | [日本語](#日本語)

---

## English

### 🌟 Features

#### 🎯 Complete Dyna-Q Algorithm Implementation

**Core Components:**

✅ **Prioritized Replay** - Priority queue with TD-error based priorities (θ=3.0)  
✅ **Predecessor Tracking** - Efficient backward propagation of value updates  
✅ **Model Learning Loop** - 10× update amplification (10 planning steps per real interaction)  
✅ **Initial States Tracking** - Prevents unnecessary updates  
✅ **Convergence Detection** - Early stopping when reward stabilizes  
✅ **Parallel Multi-threading** - Web Workers for 3-4x faster training

#### 👍 Full Thumb Position Support (NEW!)

**Cello-Specific Features:**

✅ **Thumb Position** - Full support for thumb (finger 5) in high positions (≥6th position)  
✅ **Octave Span** - Thumb to 3rd finger forms an octave (7 semitones stretch)  
✅ **Smart Guidance** - Algorithm learns to prefer thumb in high positions  
✅ **Physical Constraints** - Thumb prohibited in low positions (<6th position)  
✅ **Flexible Transitions** - Smooth finger-to-thumb and thumb-to-finger changes

#### 🚀 Advanced Capabilities

- **🎼 MusicXML Support**: Upload `.musicxml` and `.mxl` (compressed) format files
- **🤖 AI-Powered**: Complete Dyna-Q reinforcement learning algorithm
- **⚡ Parallel Training**: Multi-core CPU utilization with Web Workers (4/2/1 workers auto-detected)
- **🌍 Multi-language**: Interface available in English, Chinese, and Japanese
- **📊 Real-time Progress**: Track training status with live progress updates for each worker
- **💻 Browser-Based**: Runs entirely in your browser - no server needed!
- **💾 Smart Caching**: IndexedDB caching for instant results on repeated files
- **🎨 Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS
- **🆓 Free**: Zero cost deployment on Vercel

### 🎵 Live Demo

**Try It Now**: https://cello-fingering-generator-a03-2.vercel.app/

### 🧠 Algorithm Details

#### Dyna-Q Reinforcement Learning for Cello

This implementation uses the **complete Dyna-Q algorithm** with **cello-specific constraints**:

**Cello Parameters:**

```typescript
{
  openStringPitches: [57, 50, 43, 36],  // A3, D3, G2, C2
  positionCount: 40,                     // 40 positions (vs 32 for violin)
  fingerCount: 6,                        // 0-5 (0=open, 1-4=fingers, 5=thumb)
  thumbPositionThreshold: 6,             // Thumb usable at position ≥6
  upperBoutCutoff: 4,                    // Position 4
  discountFactor: 0.99                   // Higher for cello
}
~~~

**Thumb Position Rules (v4 Optimization):**

| Scenario                           | Penalty        | Effect                           |
| ---------------------------------- | -------------- | -------------------------------- |
| Thumb in low positions (<6)        | NEVER (100000) | Physically impossible            |
| Thumb in high positions (≥6)       | LOW (1)        | Encouraged                       |
| Fingers 1-4 in high positions (≥6) | LOW×5 (5)      | **v4: Strongly encourage thumb** |
| Fingers 1-4 in low positions (<6)  | 0              | Normal usage                     |

**Training Process:**

- **Episodes**: 10,000 training episodes (with early stopping)
- **Planning Steps**: 10 simulated updates per real interaction
- **Total Updates**: ~550,000 Q-value updates
- **Convergence**: Early stopping when reward stabilizes (checked every 300 episodes)

### 📊 Performance Metrics

#### Processing Time (with Parallel Training)

| File Complexity | Notes        | 4-Core PC     | 2-Core PC      | Single-Core | Quality   |
| --------------- | ------------ | ------------- | -------------- | ----------- | --------- |
| Simple          | 10-30 notes  | 4-8 seconds   | 8-15 seconds   | 15-30 sec   | Excellent |
| Medium          | 50-100 notes | 14-27 seconds | 26-53 seconds  | 50-100 sec  | Excellent |
| Complex         | 200+ notes   | 32-65 seconds | 63-126 seconds | 120-240 sec | Very Good |
| Cached Files    | Any          | <1 second     | <1 second      | <1 second   | Instant   |

**Performance Improvement:**

- 4-Core PC: **3.5-3.8x faster** than single-threaded
- 2-Core PC: **1.8-1.9x faster** than single-threaded
- Mobile devices: Automatically uses single-threaded mode for stability

### 🚀 Quick Start

#### 💻 Local Development

1. **Clone the repository**
```bash
git clone [repository-url]
cd StringFingering-main
```

2. **Install dependencies**
```bash
cd frontend
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open your browser**
```
http://localhost:3000
```

**🔗 Local Debug URL**: **http://localhost:3000**

### 📖 Usage

1. Visit **http://localhost:3000**
2. Select your preferred language (English/中文/日本語)
3. Upload a MusicXML file (.musicxml or .mxl format)
4. Wait for processing (typically 4-65 seconds on 4-core PC)
5. Download the result as MusicXML file with fingering annotations
6. Open the downloaded file in MuseScore or other music notation software

**Note:** The downloaded file is in MusicXML format (.musicxml or .mxl) which can be directly opened in MuseScore, Finale, Sibelius, and other music notation software.

### 🏗️ Architecture

```
┌─────────────────────────────────────┐
│         Browser                     │
│  ┌───────────────────────────────┐  │
│  │  Next.js Frontend             │  │
│  │  - File Upload UI             │  │
│  │  - Progress Display           │  │
│  │  - Multi-language Support     │  │
│  └───────────┬───────────────────┘  │
│              │                       │
│              ▼                       │
│  ┌───────────────────────────────┐  │
│  │  Parallel Training Manager    │  │
│  │  - Device Detection (4/2/1)   │  │
│  │  - Worker Coordination        │  │
│  │  - Q-table Merging            │  │
│  └───────────┬───────────────────┘  │
│              │                       │
│              ▼                       │
│  ┌─────────────┬─────────────┬───┐  │
│  │  Worker 1   │  Worker 2   │...│  │
│  │  Dyna-Q     │  Dyna-Q     │   │  │
│  │  Training   │  Training   │   │  │
│  └─────────────┴─────────────┴───┘  │
│              │                       │
│              ▼                       │
│  ┌───────────────────────────────┐  │
│  │  IndexedDB Cache              │  │
│  │  - File Hash Storage          │  │
│  │  - Result Caching             │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### 📁 Project Structure

```
StringFingering-main/
├── frontend/                    # Next.js web application
│   ├── src/
│   │   ├── app/                # Next.js 14 App Router
│   │   │   ├── page.tsx        # Main page
│   │   │   ├── layout.tsx      # Root layout
│   │   │   └── globals.css     # Global styles
│   │   ├── components/         # React components
│   │   │   ├── FileUploader.tsx
│   │   │   ├── LanguageSwitcher.tsx
│   │   │   ├── ProcessingStatus.tsx
│   │   │   └── ResultDisplay.tsx
│   │   └── lib/
│   │       ├── algorithm/      # Core algorithm
│   │       │   ├── types.ts
│   │       │   ├── const.ts    # Cello-specific parameters
│   │       │   ├── dynaQ.ts
│   │       │   ├── parallelTrainer.ts
│   │       │   └── priorityQueue.ts
│   │       ├── music/          # Music file processing
│   │       │   ├── parser.ts
│   │       │   └── writer.ts
│   │       ├── cache/          # Caching layer
│   │       │   └── indexedDB.ts
│   │       └── i18n.ts         # Internationalization
│   ├── workers/                # Web Workers
│   │   └── dynaQ.worker.ts     # Worker script for parallel training
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   └── tailwind.config.js
├── CompositionExamples/        # Test MusicXML files
├── README.md                   # This file
├── vercel.json                 # Vercel deployment config
└── LICENSE                     # MIT License
```

### 🧪 Testing

**Local Debug URL:** [http://localhost:3000](http://localhost:3000/)

**Test Files:** See `CompositionExamples/` directory for sample MusicXML files

**Testing Steps:**

1. Open browser console (F12)
2. Visit [http://localhost:3000](http://localhost:3000/)
3. Upload test file
4. Observe console logs for parallel training progress
5. Check worker count (should show 1, 2, or 4 workers based on your CPU)
6. Verify thumb usage in high positions (≥6)
7. Download result file
8. Open in MuseScore to verify fingering annotations

**Expected Console Output (4-core PC):**

```
🎻 Starting processing for: [filename]
📄 Parsing MusicXML...
✅ Parsed X notes
💻 High-end PC detected (8 cores), using 4 workers
🚀 Starting parallel training with 4 workers
🔧 Worker started with seed XXXX, 2500 episodes
✅ Worker completed training
🔄 Merging Q-tables from all workers...
✅ Merged XXX states from 4 workers
🎯 Extracting optimal policy from merged Q-table...
✅ Training completed! Duration: XXs
```

### ⚙️ Technical Details

#### Cello Constraints

The system implements complete cello-specific constraints:

- **Open String Pitches**: A3(57), D3(50), G2(43), C2(36)
- **Finger Range**: 0-5 (0=open string, 1-4=fingers, 5=thumb)
- **String Count**: 4 strings
- **Position Range**: 0-39 positions (40 total)
- **Thumb Position Threshold**: Position 6
- **Upper Bout Cutoff**: Position 4

**Thumb Position Features:**

- Thumb can only be used at position ≥6
- Thumb to 3rd finger forms an octave (7 semitones)
- Flexible thumb transitions (40 semitones range)
- Smart penalty system guides algorithm to prefer thumb in high positions

**Penalty System:**

- LOW: 1 (minor discomfort)
- MEDIUM: 50 (moderate difficulty)
- HIGH: 1000 (very difficult)
- NEVER: 100000 (physically impossible)

#### Browser Compatibility

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

Requires:

- IndexedDB support
- Web Workers support
- ES2020+ features

### 🌐 Deployment

#### Vercel (Recommended)

1. Fork this repository
2. Connect your GitHub repository to Vercel
3. Configure:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: (use default)
   - Output Directory: (use default)
4. Deploy

The app will be automatically deployed and available at your Vercel URL.

### ⚠️ Known Limitations

- **Large Files**: Files with >1000 notes may take longer to process
- **Memory**: Complex scores may use significant browser memory (especially with multiple workers)
- **Processing Time**: First-time processing takes 4-65 seconds on 4-core PC (cached files are instant)
- **Mobile Devices**: Automatically uses single-threaded mode for stability
- **Algorithm**: Some complex scores may produce suboptimal results

### 🙏 Credits

This project uses the complete Dyna-Q reinforcement learning algorithm for optimal cello fingering generation with full thumb position support.

**Open Source Libraries:**

- Next.js - React framework
- TypeScript - Type-safe JavaScript
- Tailwind CSS - Utility-first CSS framework
- xml2js - XML parsing
- jszip - ZIP file handling
- idb - IndexedDB wrapper

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](vscode-webview://10etv24vekjj2s6e6ssenkluu0emvi8lumf7b305q6l3pfklqdtp/LICENSE) file for details.

------

## 中文

### 🌟 功能特性

#### 🎯 完整 Dyna-Q 算法实现

**核心组件：**

✅ **优先级回放** - 基于TD误差的优先级队列（θ=3.0）
✅ **前驱状态追踪** - 高效的价值更新反向传播
✅ **模型学习循环** - 10倍更新放大（每次真实交互10次规划步骤）
✅ **初始状态追踪** - 防止不必要的更新
✅ **收敛检测** - 奖励稳定时提前停止
✅ **并行多线程** - Web Workers实现3-4倍加速

#### 👍 完整拇指把位支持（新功能！）

**大提琴专属特性：**

✅ **拇指把位** - 完整支持拇指（手指5）在高把位（≥6把位）
✅ **八度跨度** - 拇指到第3指构成八度（7个半音伸展）
✅ **智能引导** - 算法学习在高把位优先使用拇指
✅ **物理约束** - 拇指在低把位（<6把位）禁止使用
✅ **灵活转换** - 手指到拇指、拇指到手指的平滑过渡

#### 🚀 高级功能

- **🎼 MusicXML 支持**: 上传 `.musicxml` 和 `.mxl`（压缩）格式文件
- **🤖 AI 驱动**: 完整的 Dyna-Q 强化学习算法
- **⚡ 并行训练**: 多核CPU利用，Web Workers实现3-4倍加速
- **🌍 多语言**: 支持英文、中文和日文界面
- **📊 实时进度**: 实时追踪训练状态，显示每个Worker的进度
- **💻 浏览器运行**: 完全在浏览器中运行 - 无需服务器！
- **💾 智能缓存**: IndexedDB 缓存，重复文件秒开
- **🎨 现代界面**: 基于 Next.js 和 Tailwind CSS 的清爽界面
- **🆓 完全免费**: 零成本部署在 Vercel

### 🚀 快速开始

#### 💻 本地开发

1. **克隆仓库**

```bash
git clone [repository-url]
cd StringFingering-main
```

1. **安装依赖**

```bash
cd frontend
npm install
```

1. **启动开发服务器**

```bash
npm run dev
```

1. **打开浏览器**

```
http://localhost:3000
```

### 📖 使用方法

1. 访问 [http://localhost:3000](http://localhost:3000/)
2. 选择您偏好的语言（English/中文/日本語）
3. 上传 MusicXML 文件（.musicxml 或 .mxl 格式）
4. 等待处理（4核PC通常需要 4-65 秒）
5. 下载带有指法标注的 MusicXML 文件
6. 在 MuseScore 或其他乐谱软件中打开下载的文件

------

## 日本語

### 🌟 機能

#### 🎯 完全な Dyna-Q アルゴリズム実装

**コアコンポーネント：**

✅ **優先度付きリプレイ** - TD誤差ベースの優先度キュー（θ=3.0）
✅ **前任状態追跡** - 効率的な価値更新の逆伝播
✅ **モデル学習ループ** - 10倍の更新増幅（実際の相互作用ごとに10回のプランニングステップ）
✅ **初期状態追跡** - 不要な更新を防止
✅ **収束検出** - 報酬が安定したら早期停止
✅ **並列マルチスレッド** - Web Workersで3-4倍高速化

#### 👍 完全な親指ポジション対応（新機能！）

**チェロ専用機能：**

✅ **親指ポジション** - 高ポジション（≥6ポジション）での親指（指5）完全対応
✅ **オクターブスパン** - 親指から3番指でオクターブ（7半音の伸張）
✅ **スマートガイダンス** - 高ポジションで親指を優先的に使用するようアルゴリズムが学習
✅ **物理的制約** - 低ポジション（<6ポジション）では親指使用禁止
✅ **柔軟な移行** - 指から親指、親指から指へのスムーズな移行

### 🚀 クイックスタート

#### 💻 ローカル開発

1. **リポジトリをクローン**

```bash
git clone [repository-url]
cd StringFingering-main
```

1. **依存関係をインストール**

```bash
cd frontend
npm install
```

1. **開発サーバーを起動**

```bash
npm run dev
```

1. **ブラウザを開く**

```
http://localhost:3000
```

------

## 🔗 Links

- **🚀 Main Application**: [http://localhost:3000](http://localhost:3000/)
- **GitHub Repository**: [https://github.com/JeffreyZhou798/Cello-Fingering-Generator-A03-2]

## 🧪 Testing Instructions

### Quick Test

1. **Start server**: `cd frontend && npm run dev`
2. **Open**: **http://localhost:3000**
3. **Upload a test file** from `CompositionExamples/`
4. **Watch console** (F12) for parallel training progress
5. **Verify worker count** matches your CPU cores
6. **Verify thumb usage** in high positions (≥6)
7. **Download result** and verify in MuseScore

### Test Files Available

#### Simple Tests (Recommended for first test)
- ✅ `simple_test/simple_test_Cello.musicxml` - 11 notes (G2-E3 scale)
- ✅ `simple_test/simple_test_Cello.mxl` - Same as above (compressed)
- ✅ `simple_test/simple_test2_Cello.musicxml` - 11 notes (D2-D2 scale)
- ✅ `simple_test/simple_test2_Cello.mxl` - Same as above (compressed)

#### Complex Pieces
- ✅ `Cello Concerto No.1 in C major, 1st Mvt. Solo/cello-concerto-no1-in-c-major-1st-mvt-solo.mxl`
- ✅ `Cello solo Canon In D, P.37/cello-solo-canon-in-d-p37.mxl`
- ✅ `Cello Suite No. 1/cello-suite-no-1.mxl`

### Expected Results

- ✅ All notes get fingering annotations
- ✅ Thumb (finger 5) used in high positions (≥6)
- ✅ No thumb in low positions (<6)
- ✅ Finger 2 rarely used (prefer 1-3-4 pattern)
- ✅ Open strings prioritized (strong reward -50)
- ✅ Multiple workers training in parallel (on multi-core PCs)
- ✅ Processing time: 4-65 seconds on 4-core PC (first run)
- ✅ Cached files: <1 second
- ✅ No console errors

### Test Results (v5 Parameters)

**simple_test_Cello.mxl** (G2-A2-B2-C3-D3-E3-D3-C3-B2-A2-G2):
- Expected: 0,1,3,0,0,1,0,0,3,1,0
- Uses open strings (C3=D string open, D3=D string open, G2=G string open)
- Uses 1-3-4 fingering pattern (no finger 2)

**simple_test2_Cello.mxl** (D2-E2-F#2-G2-A2-B2-A2-G2-F#2-E2-D2):
- Expected: 0,1,3,4,0,1,3,1,0,4,3,1,0
- Uses open strings (G2=G string open)
- Uses 1-3-4 fingering pattern

### Console Output Example (4-core PC)

```
🎻 Starting processing for: simple_test_Cello.mxl
📄 Parsing MusicXML...
✅ Parsed 11 notes
💻 High-end PC detected (12 cores), using 4 workers
🚀 Starting parallel training with 4 workers
🔧 Worker started with seed XXXX, 2500 episodes
✅ Worker completed training
🔄 Merging Q-tables from all workers...
✅ Merged XXX states from 4 workers
🎯 Extracting optimal policy from merged Q-table...
✅ Generated fingering for 11 notes
✅ Training completed! Duration: 8s
```

------

**Last Updated**: February 28, 2026  
**Version**: 1.0.0 (Cello with Thumb Position Support - v5 Optimization)  
**Status**: ✅ **READY FOR TESTING** - Development server running at **http://localhost:3000**

**v5 Improvements**:
- ✅ Corrected finger stretch distances (2 semitones for adjacent fingers)
- ✅ Strong open string reward (-50) instead of penalty
- ✅ Heavy thumb penalty (MEDIUM/HIGH) to ensure thumb is last choice
- ✅ Finger 2 penalty (HIGH) to encourage 1-3-4 fingering pattern
- ✅ Low position reward (-10) for comfortable 1-3-4 fingering

------

## License

MIT License - See [LICENSE](../LICENSE) for details.

---

## ⚠️ Copyright Notice

© 2026 Jeffrey Zhou. All rights reserved.

This repository and its contents are protected by copyright law. No part of this project may be copied, reproduced, modified, or distributed without prior written permission from the author.

**Commercial use is strictly prohibited.**


*Built with ❤️ for music education* ```

