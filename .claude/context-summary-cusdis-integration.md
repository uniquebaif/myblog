## 项目上下文摘要（Cusdis评论系统集成）
生成时间：2025-12-21

### 1. 相似实现分析

- **实现1**: src/components/post-author/post-author.tsx:8-34
  - 模式：使用`useSiteMetadata`钩子获取配置数据
  - 可复用：`useSiteMetadata`钩子（src/hooks/use-site-metadata.ts）
  - 需注意：组件无参数，直接从站点元数据获取信息

- **实现2**: src/components/sidebar/sidebar.tsx:16-29
  - 模式：使用`useSiteMetadata`获取author、copyright、menu配置
  - 可复用：相同的配置获取模式
  - 需注意：将数据传递给子组件

- **实现3**: src/components/button/button.tsx:8-20
  - 模式：简单的函数组件，定义明确的props接口
  - 可复用：基本的组件结构模式
  - 需注意：使用`classnames`库处理CSS类名

### 2. 项目约定

- **命名约定**:
  - 组件文件：小写字母，短横线分隔（如`post-author.tsx`）
  - 组件名称：帕斯卡命名法（如`PostAuthor`）
  - 变量/函数：驼峰命名法
  - 测试文件：与组件同名加`.test.tsx`

- **文件组织**:
  - 每个组件有自己的目录（`src/components/component-name/`）
  - 包含：主组件文件、样式文件、测试文件
  - 使用路径别名：`@/components/*`、`@/hooks/*`等

- **导入顺序**:
  1. React导入
  2. 第三方库导入
  3. 项目内部导入（使用路径别名）
  4. 样式导入

- **代码风格**:
  - 使用TypeScript严格模式
  - 2空格缩进
  - 使用interface定义props
  - 函数组件使用`FC<Props>`类型
  - 使用命名导出而非默认导出

### 3. 可复用组件清单

- `src/hooks/use-site-metadata.ts`: 获取站点配置的钩子
- `src/utils/get-contact-href.ts`: 生成联系链接的工具函数
- 现有的组件结构模式可复用

### 4. 测试策略

- **测试框架**: Bun test + @testing-library/react
- **测试模式**: 快照测试 + 功能断言
- **参考文件**: src/components/button/button.test.tsx
- **覆盖要求**: 组件渲染、props传递、配置读取

### 5. 依赖和集成点

- **外部依赖**: Cusdis JavaScript SDK（通过CDN加载）
- **内部依赖**: useSiteMetadata钩子获取配置
- **集成方式**: 在post-template.tsx中集成评论组件
- **配置来源**: content/config.json的cusdis字段

### 6. 技术选型理由

- **为什么用Cusdis**: 用户提供，轻量级，开源
- **优势**: 简单易集成，隐私友好
- **劣势和风险**: 第三方服务依赖，需要网络加载

### 7. 关键风险点

- **并发问题**: 脚本异步加载，需要处理加载状态
- **边界条件**: 配置缺失时的降级处理
- **性能瓶颈**: 外部脚本加载可能影响页面性能
- **安全考虑**: 确保Cusdis脚本来源可信