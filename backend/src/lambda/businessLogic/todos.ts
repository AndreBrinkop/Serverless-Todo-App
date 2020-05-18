 import * as uuid from 'uuid'

import { TodoItem } from '../../models/TodoItem'
import { TodoAccess } from '../dataLayer/TodoAccess'
import { createLogger } from "../../utils/logger";
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
 import {UpdateTodoRequest} from "../../requests/UpdateTodoRequest";
 import {TodoUpdate} from "../../models/TodoUpdate";
const logger = createLogger('todos')

const todoAccess = new TodoAccess()

export async function getAllTodoItemsForUser(userId: string): Promise<TodoItem[]> {
    logger.info('Get all Todo Items for user-', {"userId": userId})
    return todoAccess.getAllTodoItemsForUser(userId)
}

export async function createTodoItem(todoItem: CreateTodoRequest, userId: string): Promise<TodoItem> {
    logger.info('Create new Todo Item.', {"userId": userId, "todoItem": todoItem})

    const todoId = uuid.v4()

    return await todoAccess.createTodoItem({
        todoId: todoId,
        userId: userId,
        done: false,
        createdAt: new Date().toISOString(),
        ...todoItem
    })
}

 export async function updateTodoItem(updateTodoRequest: UpdateTodoRequest, todoId: string, userId: string): Promise<void> {
     logger.info('Update Todo Item.', {"updateTodoRequest": updateTodoRequest, "todoId": todoId, "userId": userId})
     const todoUpdate: TodoUpdate = updateTodoRequest as TodoUpdate
     await todoAccess.updateTodoItem(todoUpdate, todoId, userId)
 }
