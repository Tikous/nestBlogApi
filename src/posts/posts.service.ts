import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    const { title, content, summary, published, tags } = createPostDto;

    // 创建或获取标签
    const tagRecords = [];
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        const tag = await this.prisma.write.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName },
        });
        tagRecords.push({ id: tag.id });
      }
    }

    // 创建博客文章
    const post = await this.prisma.write.post.create({
      data: {
        title,
        content,
        summary: summary || null,
        published: published || false,
        tags: {
          connect: tagRecords,
        },
      },
      include: {
        author: true,
        tags: true,
      },
    });

    return post;
  }

  async findAll() {
    const posts = await this.prisma.read.post.findMany({
      include: {
        author: true,
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return posts;
  }

  async findOne(id: number) {
    const post = await this.prisma.read.post.findUnique({
      where: { id },
      include: {
        author: true,
        tags: true,
      },
    });

    if (!post) {
      throw new NotFoundException(`ID为 ${id} 的文章不存在`);
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    // 先检查文章是否存在
    await this.findOne(id);

    const { title, content, summary, published, tags } = updatePostDto;

    // 处理标签更新
    let tagConnections = undefined;
    if (tags !== undefined) {
      // 如果提供了标签，先断开所有现有连接，然后连接新标签
      await this.prisma.write.post.update({
        where: { id },
        data: {
          tags: {
            set: [], // 清空现有标签连接
          },
        },
      });

      // 创建或获取新标签
      const tagRecords = [];
      if (tags.length > 0) {
        for (const tagName of tags) {
          const tag = await this.prisma.write.tag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName },
          });
          tagRecords.push({ id: tag.id });
        }
      }
      tagConnections = { connect: tagRecords };
    }

    const updatedPost = await this.prisma.write.post.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(summary !== undefined && { summary }),
        ...(published !== undefined && { published }),
        ...(tagConnections && { tags: tagConnections }),
      },
      include: {
        author: true,
        tags: true,
      },
    });

    return updatedPost;
  }

  async remove(id: number) {
    // 先检查文章是否存在
    await this.findOne(id);

    await this.prisma.write.post.delete({
      where: { id },
    });

    return { message: `ID为 ${id} 的文章已删除` };
  }

  async findPublished() {
    const posts = await this.prisma.read.post.findMany({
      where: { published: true },
      include: {
        author: true,
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return posts;
  }
} 