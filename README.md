# NestJS Blog API

基于NestJS框架构建的现代化博客API，支持AWS Aurora数据库和GitHub仓库集成，可无缝部署到AWS Lambda。

## 🌟 项目亮点

- 🚀 **现代化架构**: 基于NestJS + TypeScript，模块化设计
- 🗄️ **企业级数据库**: AWS Aurora PostgreSQL，支持读写分离
- ☁️ **云原生部署**: AWS Lambda + API Gateway，自动扩缩容
- 📊 **完整API文档**: Swagger/OpenAPI 3.0自动生成
- 🔧 **开发友好**: 热重载、代码检查、格式化工具
- 🔒 **生产就绪**: 环境配置、错误处理、日志记录

## 功能特性

- 📝 **博客文章管理**: 完整的CRUD操作，支持草稿和发布状态
- 🏷️ **标签系统**: 灵活的标签管理和文章分类
- 🔍 **高级搜索**: 支持标题、内容、标签的复合搜索
- 🌐 **GitHub集成**: 获取用户仓库信息，支持开源项目展示
- 📊 **API文档**: 交互式Swagger UI，支持在线测试
- 🗄️ **数据库优化**: Prisma ORM，支持连接池和读写分离
- ☁️ **Lambda部署**: 使用Layer优化，支持冷启动优化
- 🔧 **环境管理**: 多环境配置，支持本地开发和云端部署

## 🏗️ 技术架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │───▶│  Lambda Function │───▶│  Aurora Cluster │
│                 │    │   (NestJS App)   │    │   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   GitHub API    │
                       │   Integration   │
                       └─────────────────┘
```

### 核心模块
- **AppModule**: 应用主模块，集成所有功能模块
- **PostsModule**: 文章管理模块，包含CRUD和标签关联
- **GitHubModule**: GitHub API集成模块
- **PrismaModule**: 数据库访问层，支持读写分离

## API端点

### 🔍 系统信息
- `GET /health` - 健康检查，返回服务状态和运行时间

### 📝 博客文章
- `GET /posts` - 获取所有文章（支持分页和搜索）
- `GET /posts/published` - 获取已发布的文章
- `GET /posts/:id` - 根据ID获取单篇文章详情
- `POST /posts` - 创建新文章（支持标签关联）
- `PATCH /posts/:id` - 更新文章内容或状态
- `DELETE /posts/:id` - 删除指定文章

### 🌐 GitHub集成
- `GET /github/repositories` - 获取默认用户的GitHub仓库列表
- `GET /github/repositories/:username` - 获取指定用户的仓库列表
- `GET /github/repositories/:username/:repo` - 获取指定仓库的详细信息

### 📊 API文档
- `GET /api` - Swagger UI交互式文档界面
- `GET /api-json` - OpenAPI 3.0 JSON格式文档

## 🚀 快速开始

### 环境要求
- Node.js 18.x 或更高版本
- npm 或 yarn 包管理器
- PostgreSQL 数据库（本地开发）或 AWS Aurora（生产环境）
- GitHub个人访问令牌（可选，用于GitHub API集成）

### 本地开发

1. **克隆项目**
```bash
git clone https://github.com/Tikous/nestBlogApi.git
cd nestBlogApi
```

2. **安装依赖**
```bash
npm install
```

3. **环境配置**
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，配置数据库连接
DATABASE_URL="postgresql://username:password@localhost:5432/blog_db"
GITHUB_USERNAME="your-github-username"
GITHUB_TOKEN="ghp_your_github_token"
```

4. **数据库设置**
```bash
# 生成Prisma Client
npm run db:generate

# 推送数据库结构（开发环境）
npm run db:push

# 或运行迁移（生产环境）
npm run db:migrate
```

5. **启动开发服务器**
```bash
npm run start:dev
```

6. **访问应用**
- API服务: http://localhost:3000
- API文档: http://localhost:3000/api
- 健康检查: http://localhost:3000/health

## ☁️ AWS部署

### 前置要求
- AWS CLI 已安装并配置凭证
- AWS SAM CLI 已安装
- AWS Aurora PostgreSQL 集群已创建并配置

### Lambda Layer部署（推荐）

使用Lambda Layer可以显著减少部署包大小并提高冷启动性能：

```bash
# 构建Layer和Function
sam build -t template-layer.yaml

# 首次部署（引导模式）
sam deploy --guided --template-file template-layer.yaml

# 后续部署
sam deploy --template-file template-layer.yaml
```

### 传统部署方式

```bash
# 构建项目
sam build

# 部署到AWS
sam deploy --guided
```

### 部署参数配置

部署时需要提供以下参数：
- `DatabaseUrl`: Aurora集群连接URL
- `DatabaseWriteUrl`: 写实例连接URL（可选）
- `DatabaseReadUrl`: 读实例连接URL（可选）
- `GithubUsername`: GitHub用户名
- `GithubToken`: GitHub个人访问令牌

## 🗄️ 数据库架构

### Post（文章表）
```sql
CREATE TABLE "Post" (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    content     TEXT,
    summary     TEXT,
    published   BOOLEAN DEFAULT false,
    createdAt   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    authorId    INTEGER REFERENCES "User"(id)
);
```

### User（用户表）
```sql
CREATE TABLE "User" (
    id        SERIAL PRIMARY KEY,
    email     VARCHAR(255) UNIQUE NOT NULL,
    name      VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tag（标签表）
```sql
CREATE TABLE "Tag" (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);
```

### PostTag（文章标签关联表）
```sql
CREATE TABLE "_PostToTag" (
    A INTEGER REFERENCES "Post"(id),
    B INTEGER REFERENCES "Tag"(id),
    PRIMARY KEY (A, B)
);
```

## 🛠️ 开发工具和脚本

### 常用命令
```bash
# 开发服务器
npm run start:dev          # 热重载开发模式
npm run start:debug        # 调试模式

# 构建和生产
npm run build              # 构建项目
npm run start:prod         # 生产模式启动

# 数据库操作
npm run db:generate        # 生成Prisma Client
npm run db:push            # 推送schema到数据库
npm run db:migrate         # 运行数据库迁移
npm run db:studio          # 打开Prisma Studio GUI

# 代码质量
npm run lint               # ESLint代码检查
npm run lint:fix           # 自动修复代码问题
npm run format             # Prettier格式化
npm run test               # 运行单元测试
npm run test:e2e           # 运行端到端测试
```

### 开发工具配置
- **ESLint**: 代码质量检查，基于推荐规则
- **Prettier**: 代码格式化，统一代码风格
- **TypeScript**: 类型检查，提供更好的开发体验
- **Jest**: 单元测试框架
- **Prisma Studio**: 数据库可视化管理工具

## 🔧 环境配置

### 环境变量说明
```bash
# 数据库配置
DATABASE_URL="postgresql://user:pass@host:5432/db"        # 主数据库连接
DATABASE_WRITE_URL="postgresql://user:pass@writer:5432/db" # 写数据库（可选）
DATABASE_READ_URL="postgresql://user:pass@reader:5432/db"  # 读数据库（可选）

# GitHub API配置
GITHUB_USERNAME="your-username"     # 默认GitHub用户名
GITHUB_TOKEN="ghp_your_token"       # GitHub个人访问令牌（提高API限制）

# 应用配置
PORT=3000                           # 服务端口
NODE_ENV=production                 # 环境模式：development | production
LOG_LEVEL=info                      # 日志级别：debug | info | warn | error

# AWS配置（部署时自动设置）
AWS_REGION=ap-southeast-2           # AWS区域
```

## 📊 性能优化

### Lambda优化
- **Layer分离**: 依赖包与应用代码分离，减少部署包大小
- **连接池**: 使用Prisma连接池，优化数据库连接
- **冷启动优化**: 最小化依赖，优化启动时间
- **内存配置**: 根据实际使用情况调整Lambda内存分配

### 数据库优化
- **读写分离**: 查询操作使用只读副本，提高性能
- **连接池**: 复用数据库连接，减少连接开销
- **索引优化**: 为常用查询字段添加索引
- **查询优化**: 使用Prisma的高效查询方法

## 🔒 安全配置

### API安全
- **CORS配置**: 限制跨域访问
- **输入验证**: 使用DTO和验证装饰器
- **错误处理**: 统一错误响应格式
- **日志记录**: 记录关键操作和错误信息

### AWS安全
- **VPC配置**: Lambda运行在私有子网
- **安全组**: 限制网络访问规则
- **IAM权限**: 最小权限原则
- **环境变量**: 敏感信息通过环境变量管理

## 🐛 故障排除

### 常见问题

**1. 数据库连接失败**
```bash
# 检查连接字符串格式
DATABASE_URL="postgresql://username:password@host:5432/database"

# 特殊字符需要URL编码
# 例如：密码中的 "(" 需要编码为 "%28"
```

**2. GitHub API限制**
```bash
# 配置个人访问令牌提高API限制
GITHUB_TOKEN="ghp_your_personal_access_token"
```

**3. Lambda部署包过大**
```bash
# 使用Layer模板部署
sam build -t template-layer.yaml
sam deploy --template-file template-layer.yaml
```

**4. VPC网络问题**
```bash
# 确保Lambda和数据库在同一VPC
# 配置NAT Gateway用于外网访问
```

### 调试技巧
- 使用 `npm run start:debug` 启动调试模式
- 查看AWS CloudWatch日志排查Lambda问题
- 使用Prisma Studio检查数据库状态
- 通过健康检查端点验证服务状态

## 🤝 贡献指南

1. Fork项目到你的GitHub账户
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -am 'Add new feature'`
4. 推送到分支：`git push origin feature/new-feature`
5. 创建Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- [NestJS官方文档](https://nestjs.com/)
- [Prisma文档](https://www.prisma.io/docs/)
- [AWS SAM文档](https://docs.aws.amazon.com/serverless-application-model/)
- [GitHub API文档](https://docs.github.com/en/rest)

---

如果这个项目对你有帮助，请给个⭐️支持一下！ 