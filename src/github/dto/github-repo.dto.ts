import { ApiProperty } from '@nestjs/swagger';

export class GithubRepoDto {
  @ApiProperty({ description: '仓库ID' })
  id: number;

  @ApiProperty({ description: '仓库名称' })
  name: string;

  @ApiProperty({ description: '仓库全名' })
  full_name: string;

  @ApiProperty({ description: '仓库描述', required: false })
  description?: string;

  @ApiProperty({ description: '仓库URL' })
  html_url: string;

  @ApiProperty({ description: '是否为私有仓库' })
  private: boolean;

  @ApiProperty({ description: '是否为Fork仓库' })
  fork: boolean;

  @ApiProperty({ description: '主要编程语言', required: false })
  language?: string;

  @ApiProperty({ description: '星标数量' })
  stargazers_count: number;

  @ApiProperty({ description: 'Fork数量' })
  forks_count: number;

  @ApiProperty({ description: '创建时间' })
  created_at: string;

  @ApiProperty({ description: '最后更新时间' })
  updated_at: string;

  @ApiProperty({ description: '最后推送时间', required: false })
  pushed_at?: string;
} 