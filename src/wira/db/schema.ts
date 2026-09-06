import { pgTable, uuid, varchar, text, timestamp, decimal, integer, date, jsonb, index } from 'drizzle-orm/pg-core';

// --- USERS & WORKSPACES ---
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const workspaces = pgTable('workspaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// --- ZOHO SOLO: CRM & FINANCE ---
export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  company: varchar('company', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return [
    index('idx_clients_workspace').on(table.workspaceId)
  ];
});

export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
  clientId: uuid('client_id').references(() => clients.id, { onDelete: 'restrict' }).notNull(),
  invoiceNumber: varchar('invoice_number', { length: 50 }).notNull(),
  status: varchar('status', { enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'] }).default('draft').notNull(),
  issueDate: date('issue_date').notNull(),
  dueDate: date('due_date').notNull(),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return [
    index('idx_invoices_workspace').on(table.workspaceId),
    index('idx_invoices_client').on(table.clientId),
    index('idx_invoices_status').on(table.status)
  ];
});

export const expenses = pgTable('expenses', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  expenseDate: date('expense_date').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return [
    index('idx_expenses_workspace').on(table.workspaceId),
    index('idx_expenses_date').on(table.expenseDate)
  ];
});

// --- TICKTICK: PROJECTS & TASKS ---
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  color: varchar('color', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return [
    index('idx_projects_workspace').on(table.workspaceId)
  ];
});

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  status: varchar('status', { enum: ['todo', 'in_progress', 'done'] }).default('todo').notNull(),
  priority: varchar('priority', { enum: ['low', 'medium', 'high', 'urgent'] }).default('medium').notNull(),
  dueDate: timestamp('due_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return [
    index('idx_tasks_workspace').on(table.workspaceId),
    index('idx_tasks_project').on(table.projectId),
    index('idx_tasks_due_date').on(table.dueDate)
  ];
});

export const pomodoroLogs = pgTable('pomodoro_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskId: uuid('task_id').references(() => tasks.id, { onDelete: 'cascade' }).notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  completedAt: timestamp('completed_at').defaultNow().notNull(),
}, (table) => {
  return [
    index('idx_pomodoro_task').on(table.taskId)
  ];
});

// --- NOTION: PAGES & BLOCKS ---
export const pages = pgTable('pages', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  // Self referencing parent for page hierarchy
  parentId: uuid('parent_id'), 
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return [
    index('idx_pages_workspace').on(table.workspaceId)
  ];
});

export const blocks = pgTable('blocks', {
  id: uuid('id').primaryKey().defaultRandom(),
  pageId: uuid('page_id').references(() => pages.id, { onDelete: 'cascade' }).notNull(),
  blockType: varchar('block_type', { length: 50 }).notNull(), // h1, paragraph, task, invoice_link
  content: jsonb('content').notNull(),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return [
    index('idx_blocks_page').on(table.pageId)
  ];
});
