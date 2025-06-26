import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { GithubRepoDto } from './dto/github-repo.dto';

@Injectable()
export class GithubService {
  private readonly githubApiUrl = 'https://api.github.com';

  constructor(private configService: ConfigService) {}

  async getRepositories(username?: string): Promise<GithubRepoDto[]> {
    try {
      // 从环境变量获取GitHub用户名，如果没有传入的话
      const githubUsername = username || this.configService.get('GITHUB_USERNAME');
      
      if (!githubUsername) {
        throw new HttpException(
          '请提供GitHub用户名或在环境变量中设置GITHUB_USERNAME',
          HttpStatus.BAD_REQUEST,
        );
      }

      const url = `${this.githubApiUrl}/users/${githubUsername}/repos`;
      
      // 获取GitHub token（可选，用于提高API限制）
      const githubToken = this.configService.get('GITHUB_TOKEN');
      const headers = githubToken 
        ? { Authorization: `token ${githubToken}` }
        : {};

      const response = await axios.get(url, {
        headers,
        params: {
          sort: 'updated', // 按更新时间排序
          direction: 'desc', // 降序
          per_page: 100, // 每页100个仓库
        },
      });

      return response.data.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        html_url: repo.html_url,
        private: repo.private,
        fork: repo.fork,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        pushed_at: repo.pushed_at,
      }));
    } catch (error) {
      if (error.response?.status === 404) {
        throw new HttpException(
          '用户不存在或仓库不可访问',
          HttpStatus.NOT_FOUND,
        );
      }
      
      if (error.response?.status === 403) {
        throw new HttpException(
          'GitHub API限制，请稍后重试或配置GitHub Token',
          HttpStatus.FORBIDDEN,
        );
      }

      throw new HttpException(
        '获取GitHub仓库信息失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getRepository(username: string, repoName: string): Promise<GithubRepoDto> {
    try {
      const url = `${this.githubApiUrl}/repos/${username}/${repoName}`;
      
      const githubToken = this.configService.get('GITHUB_TOKEN');
      const headers = githubToken 
        ? { Authorization: `token ${githubToken}` }
        : {};

      const response = await axios.get(url, { headers });
      const repo = response.data;

      return {
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        html_url: repo.html_url,
        private: repo.private,
        fork: repo.fork,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        pushed_at: repo.pushed_at,
      };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new HttpException(
          '仓库不存在或不可访问',
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        '获取GitHub仓库信息失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 