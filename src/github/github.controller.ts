import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { GithubService } from './github.service';
import { GithubRepoDto } from './dto/github-repo.dto';

@ApiTags('github')
@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('repositories')
  @ApiOperation({ summary: '获取GitHub仓库列表' })
  @ApiQuery({ 
    name: 'username', 
    required: false, 
    description: 'GitHub用户名（可选，默认使用环境变量中的用户名）' 
  })
  @ApiResponse({ 
    status: 200, 
    description: '获取成功', 
    type: [GithubRepoDto] 
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @ApiResponse({ status: 403, description: 'API限制' })
  getRepositories(@Query('username') username?: string) {
    return this.githubService.getRepositories(username);
  }

  @Get('repositories/:username')
  @ApiOperation({ summary: '获取指定用户的GitHub仓库列表' })
  @ApiParam({ name: 'username', description: 'GitHub用户名' })
  @ApiResponse({ 
    status: 200, 
    description: '获取成功', 
    type: [GithubRepoDto] 
  })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @ApiResponse({ status: 403, description: 'API限制' })
  getRepositoriesByUsername(@Param('username') username: string) {
    return this.githubService.getRepositories(username);
  }

  @Get('repositories/:username/:repo')
  @ApiOperation({ summary: '获取指定仓库的详细信息' })
  @ApiParam({ name: 'username', description: 'GitHub用户名' })
  @ApiParam({ name: 'repo', description: '仓库名称' })
  @ApiResponse({ 
    status: 200, 
    description: '获取成功', 
    type: GithubRepoDto 
  })
  @ApiResponse({ status: 404, description: '仓库不存在' })
  getRepository(
    @Param('username') username: string,
    @Param('repo') repo: string,
  ) {
    return this.githubService.getRepository(username, repo);
  }
} 