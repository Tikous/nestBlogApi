# 🚀 快速启动指南

本指南将帮助你在5分钟内启动NestJS博客API项目，包括本地开发和AWS部署。

## 📋 前置要求

### 必需工具
- **Node.js** 18.x 或更高版本
- **npm** 或 **yarn** 包管理器
- **Git** 版本控制工具

### 可选工具
- **PostgreSQL** （本地开发数据库）
- **AWS CLI** （AWS部署）
- **AWS SAM CLI** （AWS部署）
- **Docker** （容器化开发）

## 🏃‍♂️ 1. 快速启动（5分钟）

### 步骤1：获取项目代码
```bash
# 克隆项目
git clone https://github.com/Tikous/nestBlogApi.git
cd nestBlogApi

# 安装依赖
npm install
```

### 步骤2：环境配置
```bash
# 创建环境变量文件
touch .env

# 编辑.env文件，添加以下内容：
cat << EOF > .env
# 数据库配置（SQLite用于快速测试）
DATABASE_URL="file:./dev.db"

# GitHub配置（可选）
GITHUB_USERNAME="Tikous"
GITHUB_TOKEN=""

# 应用配置
PORT=3000
NODE_ENV=development
EOF
```

### 步骤3：数据库初始化
```bash
# 生成Prisma Client
npm run db:generate

# 创建数据库表
npm run db:push
```

### 步骤4：启动开发服务器
```bash
npm run start:dev
```

### 步骤5：验证服务
打开浏览器访问：
- **API服务**: http://localhost:3000/health
- **API文档**: http://localhost:3000/api
- **示例接口**: http://localhost:3000/posts

🎉 **恭喜！** 你的NestJS博客API已经启动成功！

## 🔧 2. 详细配置指南

### 环境变量配置

#### 本地开发环境
```bash
# .env 文件内容
DATABASE_URL="file:./dev.db"                    # SQLite本地数据库
# 或使用PostgreSQL
# DATABASE_URL="postgresql://user:pass@localhost:5432/blog_db"

GITHUB_USERNAME="your-github-username"          # 你的GitHub用户名
GITHUB_TOKEN="ghp_your_personal_access_token"   # GitHub令牌（可选）

PORT=3000                                       # 服务端口
NODE_ENV=development                            # 开发环境
LOG_LEVEL=debug                                 # 日志级别
```

#### 生产环境（AWS Aurora）
```bash
# 生产环境配置
DATABASE_URL="postgresql://username:password@aurora-cluster.amazonaws.com:5432/blogdb"
DATABASE_WRITE_URL="postgresql://username:password@aurora-writer.amazonaws.com:5432/blogdb"
DATABASE_READ_URL="postgresql://username:password@aurora-reader.amazonaws.com:5432/blogdb"

GITHUB_USERNAME="your-github-username"
GITHUB_TOKEN="ghp_your_production_token"

NODE_ENV=production
LOG_LEVEL=info
```

### GitHub令牌获取
1. 访问 [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. 点击 "Generate new token (classic)"
3. 选择权限：`public_repo` 或 `repo`（如果需要访问私有仓库）
4. 复制生成的令牌到 `GITHUB_TOKEN` 环境变量

## 🧪 3. API测试示例

### 健康检查
```bash
curl http://localhost:3000/health
```
**响应示例：**
```json
{
  "status": "healthy",
  "uptime": 123.456,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 创建文章
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "我的第一篇技术博客",
    "content": "这是一篇关于NestJS开发的文章内容...",
    "summary": "NestJS开发入门指南",
    "published": true,
    "tags": ["NestJS", "TypeScript", "后端开发"]
  }'
```

**响应示例：**
```json
{
  "id": 1,
  "title": "我的第一篇技术博客",
  "content": "这是一篇关于NestJS开发的文章内容...",
  "summary": "NestJS开发入门指南",
  "published": true,
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z",
  "tags": [
    {"id": 1, "name": "NestJS"},
    {"id": 2, "name": "TypeScript"},
    {"id": 3, "name": "后端开发"}
  ]
}
```

### 获取所有文章
```bash
curl http://localhost:3000/posts
```

### 获取已发布文章
```bash
curl http://localhost:3000/posts/published
```

### 获取GitHub仓库
```bash
# 获取默认用户的仓库
curl http://localhost:3000/github/repositories

# 获取指定用户的仓库
curl http://localhost:3000/github/repositories/Tikous

# 获取指定仓库详情
curl http://localhost:3000/github/repositories/Tikous/nestBlogApi
```

## ☁️ 4. AWS部署指南

### 前置准备

#### 安装AWS工具
```bash
# macOS
brew install awscli aws-sam-cli

# Windows (使用Chocolatey)
choco install awscli aws-sam-cli

# Linux
pip install awscli aws-sam-cli
```

#### 配置AWS凭证
```bash
aws configure
# 输入你的AWS Access Key ID
# 输入你的AWS Secret Access Key
# 选择区域（如：ap-southeast-2）
# 输出格式选择json
```

### Lambda Layer部署（推荐）

#### 第一次部署
```bash
# 构建项目
sam build -t template-layer.yaml

# 引导式部署
sam deploy --guided --template-file template-layer.yaml
```

**部署参数配置：**
```
Stack Name [nestBlogApi-layer]: nestBlogApi-production
AWS Region [ap-southeast-2]: ap-southeast-2
Parameter DatabaseUrl []: postgresql://user:pass@aurora-cluster:5432/blogdb
Parameter GithubUsername []: your-github-username
Parameter GithubToken []: ghp_your_token
Confirm changes before deploy [Y/n]: Y
Allow SAM CLI IAM role creation [Y/n]: Y
Save parameters to samconfig.toml [Y/n]: Y
```

#### 后续部署
```bash
# 构建和部署
sam build -t template-layer.yaml
sam deploy --template-file template-layer.yaml
```

### 传统部署方式
```bash
# 构建项目
sam build

# 引导式部署
sam deploy --guided
```

### 部署验证
```bash
# 获取API端点URL
aws cloudformation describe-stacks \
  --stack-name nestBlogApi-layer \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
  --output text

# 测试API端点
curl https://your-api-id.execute-api.ap-southeast-2.amazonaws.com/Prod/health
```

## 🛠️ 5. 开发工具和命令

### 常用开发命令
```bash
# 开发服务器（热重载）
npm run start:dev

# 调试模式
npm run start:debug

# 生产模式
npm run build
npm run start:prod

# 代码质量检查
npm run lint
npm run lint:fix
npm run format

# 测试
npm run test
npm run test:watch
npm run test:e2e
```

### 数据库管理命令
```bash
# 生成Prisma Client
npm run db:generate

# 推送schema到数据库（开发环境）
npm run db:push

# 创建和运行迁移（生产环境）
npm run db:migrate

# 重置数据库
npm run db:reset

# 数据库可视化工具
npm run db:studio
```

### AWS相关命令
```bash
# 本地测试Lambda
sam local start-api

# 调用特定函数
sam local invoke BlogApiFunction --event events/test-event.json

# 查看日志
sam logs -n BlogApiFunction --stack-name nestBlogApi-layer --tail

# 删除堆栈
aws cloudformation delete-stack --stack-name nestBlogApi-layer
```

## 🐛 6. 故障排除

### 常见问题及解决方案

#### 问题1：端口被占用
**错误信息：** `Error: listen EADDRINUSE: address already in use :::3000`

**解决方案：**
```bash
# 查找占用端口的进程
lsof -ti:3000

# 终止进程
kill -9 $(lsof -ti:3000)

# 或使用不同端口
PORT=3001 npm run start:dev
```

#### 问题2：数据库连接失败
**错误信息：** `PrismaClientInitializationError: Can't reach database server`

**解决方案：**
```bash
# 检查数据库连接字符串
echo $DATABASE_URL

# 测试数据库连接
npm run db:generate
npx prisma db push

# 如果使用PostgreSQL，确保服务运行
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
```

#### 问题3：Prisma Client未生成
**错误信息：** `Cannot find module '@prisma/client'`

**解决方案：**
```bash
# 重新生成Prisma Client
npm run db:generate

# 如果仍有问题，重新安装
rm -rf node_modules package-lock.json
npm install
npm run db:generate
```

#### 问题4：GitHub API限制
**错误信息：** `API rate limit exceeded`

**解决方案：**
```bash
# 配置GitHub令牌
echo "GITHUB_TOKEN=ghp_your_token" >> .env

# 重启开发服务器
npm run start:dev
```

#### 问题5：AWS部署失败
**错误信息：** `Unable to upload artifact`

**解决方案：**
```bash
# 检查AWS凭证
aws sts get-caller-identity

# 重新配置AWS
aws configure

# 清理并重新构建
sam build --use-container -t template-layer.yaml
sam deploy --template-file template-layer.yaml
```

#### 问题6：Lambda冷启动超时
**错误信息：** `Task timed out after 30.00 seconds`

**解决方案：**
```bash
# 使用Layer部署减少包大小
sam build -t template-layer.yaml
sam deploy --template-file template-layer.yaml

# 或在template.yaml中增加超时时间
# Timeout: 60
```

### 调试技巧

#### 本地调试
```bash
# 启用详细日志
LOG_LEVEL=debug npm run start:dev

# 使用Node.js调试器
npm run start:debug
# 然后在浏览器中打开 chrome://inspect
```

#### AWS调试
```bash
# 查看Lambda日志
aws logs describe-log-groups
aws logs tail /aws/lambda/your-function-name --follow

# 本地测试Lambda
sam local start-api --debug
```

#### 数据库调试
```bash
# 打开Prisma Studio
npm run db:studio

# 查看数据库连接
npx prisma db pull
npx prisma db push --preview-feature
```

## 📚 7. 下一步

### 功能扩展建议
1. **用户认证**: 集成JWT或OAuth2.0
2. **文件上传**: 支持图片和附件上传
3. **评论系统**: 添加文章评论功能
4. **搜索优化**: 集成Elasticsearch全文搜索
5. **缓存层**: 添加Redis缓存提高性能
6. **监控告警**: 集成CloudWatch或其他监控工具

### 学习资源
- [NestJS官方文档](https://nestjs.com/)
- [Prisma文档](https://www.prisma.io/docs/)
- [AWS Lambda最佳实践](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [TypeScript官方文档](https://www.typescriptlang.org/)

### 社区支持
- 如有问题，请在GitHub上提交Issue
- 欢迎提交Pull Request贡献代码
- 加入相关技术社区讨论

---

🎉 **恭喜完成快速启动！** 现在你已经掌握了NestJS博客API的基本使用方法。 