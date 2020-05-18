 import * as uuid from 'uuid'

import { TodoItem } from '../../models/TodoItem'
import { TodoAccess } from '../dataLayer/TodoAccess'
import { createLogger } from "../../utils/logger";
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
const logger = createLogger('todos')

const todoAccess = new TodoAccess()

export async function getAllTodoItemsForUser(userId: string): Promise<TodoItem[]> {
    logger.info('Get all Todo Items for user', {"userId": userId})
    return todoAccess.getAllTodoItemsForUser(userId)
}

export async function createTodoItem(todoItem: CreateTodoRequest, userId: string): Promise<TodoItem> {
    const todoId = uuid.v4()

    return await todoAccess.createTodoItem({
        todoId: todoId,
        userId: userId,
        done: false,
        createdAt: new Date().toISOString(),
        ...todoItem
    })
}
