import { ApiProperty } from '@nestjs/swagger';

export class Post {
  @ApiProperty({ description: 'ID' })
  id: number;

  @ApiProperty({ description: '标题' })
  title: string;

  @ApiProperty({ description: '内容' })
  content: string;

  @ApiProperty({ description: '摘要', required: false })
  summary?: string;

  @ApiProperty({ description: '是否发布' })
  published: boolean;

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;

  @ApiProperty({ description: '作者ID', required: false })
  authorId?: number;

  @ApiProperty({ description: '作者信息', required: false })
  author?: {
    id: number;
    name: string;
    email: string;
  };

  @ApiProperty({ description: '标签列表', type: [Object] })
  tags: {
    id: number;
    name: string;
  }[];
} 