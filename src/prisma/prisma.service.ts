import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService implements OnModuleInit {
  private writeClient: PrismaClient;
  private readClient: PrismaClient;

  constructor(private configService: ConfigService) {
    // 写入数据库连接（主实例）
    this.writeClient = new PrismaClient({
      datasources: {
        db: {
          url: this.configService.get('DATABASE_WRITE_URL') || 
               this.configService.get('DATABASE_URL'),
        },
      },
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

    // 读取数据库连接（读取副本）
    this.readClient = new PrismaClient({
      datasources: {
        db: {
          url: this.configService.get('DATABASE_READ_URL') || 
               this.configService.get('DATABASE_URL'),
        },
      },
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }

  async onModuleInit() {
    await this.writeClient.$connect();
    await this.readClient.$connect();
  }

  async onModuleDestroy() {
    await this.writeClient.$disconnect();
    await this.readClient.$disconnect();
  }

  // 获取写入客户端
  get write() {
    return this.writeClient;
  }

  // 获取读取客户端
  get read() {
    return this.readClient;
  }

  // 便捷方法：根据操作类型自动选择连接
  getClient(operation: 'read' | 'write' = 'read') {
    return operation === 'write' ? this.writeClient : this.readClient;
  }
} 