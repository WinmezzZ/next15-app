import {
  createAccessibleByFactory,
  ExtractModelName,
  Model,
} from "@casl/prisma/runtime";

import { createPrismaAbility, Subjects } from '@casl/prisma';

import { AbilityBuilder, hkt, PureAbility } from '@casl/ability';

import type { Post, Prisma, PrismaClient, User } from '@prisma/client'
import prisma from "./prisma";
import { redirect } from "next/navigation";

type ModelName = Prisma.ModelName;
type ModelWhereInput = {
  [K in Prisma.ModelName]: Uncapitalize<K> extends keyof PrismaClient
    ? Extract<Parameters<PrismaClient[Uncapitalize<K>]['findFirst']>[0], { where?: any }>["where"]
    : never
};

type WhereInput<TModelName extends Prisma.ModelName> = Extract<ModelWhereInput[TModelName], Record<any, any>>;

interface PrismaQueryTypeFactory extends hkt.GenericFactory {
  produce: WhereInput<ExtractModelName<this[0], ModelName>>
}

type PrismaModel = Model<Record<string, any>, string>;

export type PrismaQuery<T extends PrismaModel = PrismaModel> =
  WhereInput<ExtractModelName<T, ModelName>> & hkt.Container<PrismaQueryTypeFactory>;

type WhereInputPerModel = {
  [K in ModelName]: WhereInput<K>;
};

export const accessibleBy = createAccessibleByFactory<WhereInputPerModel, PrismaQuery>();

export enum Action {
	Manage = 'manage',
	Create = 'create',
	Read = 'read',
	Update = 'update',
	Delete = 'delete',
}

export type AppSubjects = 'all' | Subjects<{
  User: User,
  Post: Post,
}>;

export type AppAbility = PureAbility<[string, AppSubjects], PrismaQuery>;

export async function defineAbilitiesForUserId(userId: string | undefined): Promise<AppAbility> {
  if (!userId) {
    redirect('/login')
  }
  const { can, build } =new AbilityBuilder<AppAbility>(createPrismaAbility);

  // 从数据库中获取角色和权限
  const permissions = await prisma.permission.findMany({ where: { roles: { some: { users: { some: { id: userId } } } } } });

  // 动态添加权限
  permissions.forEach((permission) => {
    const { action, subject } = JSON.parse(permission.type as string);
    can(action, subject);
  });

  return build();
}

