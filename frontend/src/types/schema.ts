/**
 * Schema Types
 * 
 * Types for representing Prisma schema models, fields, and relationships
 * parsed from the prisma/schema.prisma file.
 */

// ==========================================
// PRISMA SCHEMA TYPES
// ==========================================

export interface PrismaSchema {
  models: PrismaModel[];
  enums: PrismaEnum[];
  datasource: PrismaDatasource | null;
  generator: PrismaGenerator | null;
}

export interface PrismaModel {
  name: string;
  fields: PrismaField[];
  relations: PrismaRelation[];
  indexes: PrismaIndex[];
}

export interface PrismaField {
  name: string;
  type: string;
  isOptional: boolean;
  isArray: boolean;
  isUnique: boolean;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  isRelation: boolean;
  default?: string;
  attributes: PrismaAttribute[];
}

export interface PrismaAttribute {
  name: string;
  args: string[];
}

export interface PrismaRelation {
  name: string;
  fromModel: string;
  toModel: string;
  fromField: string;
  toField: string;
  type: RelationType;
  onDelete?: string;
  onUpdate?: string;
}

export type RelationType = "one-to-one" | "one-to-many" | "many-to-many";

export interface PrismaEnum {
  name: string;
  values: string[];
}

export interface PrismaDatasource {
  name: string;
  provider: string;
  url: string;
}

export interface PrismaGenerator {
  name: string;
  provider: string;
}

export interface PrismaIndex {
  fields: string[];
  isUnique: boolean;
}

// ==========================================
// VALIDATOR TYPES
// ==========================================

export interface ValidatorFile {
  schemas: ValidatorSchema[];
  types: ValidatorType[];
  rawContent: string;
}

export interface ValidatorSchema {
  name: string;
  code: string;
  isExported: boolean;
}

export interface ValidatorType {
  name: string;
  code: string;
  isExported: boolean;
}
