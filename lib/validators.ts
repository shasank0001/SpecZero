import { z } from "zod";

// ==========================================
// ENUMS
// ==========================================

// Add your enums here
// export const StatusEnum = z.enum(["ACTIVE", "INACTIVE"]);

// ==========================================
// USER SCHEMA (Example)
// ==========================================

export const UserSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateUserSchema = CreateUserSchema.partial();

// ==========================================
// TYPE EXPORTS
// ==========================================

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;

// Add more schemas as you design your data model
// Run `/architect-database` in your AI agent to generate validators

