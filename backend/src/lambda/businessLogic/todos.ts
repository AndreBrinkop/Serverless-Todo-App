// import * as uuid from 'uuid'

import { TodoItem } from '../../models/TodoItem'
import { TodoAccess } from '../dataLayer/todoAccess'
import {createLogger} from "../../utils/logger";
// import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
const logger = createLogger('todos')

const todoAccess = new TodoAccess()

export async function getAllTodoItemsForUser(userId: string): Promise<TodoItem[]> {
    logger.info('Get all Todo Items for user', {"userId": userId})
    return todoAccess.getAllTodoItemsForUser(userId)
}
/*
export async function createGroup(
    createGroupRequest: CreateGroupRequest,
    jwtToken: string
): Promise<Group> {

    const itemId = uuid.v4()
    const userId = getUserId(jwtToken)

    return await groupAccess.createGroup({
        id: itemId,
        userId: userId,
        name: createGroupRequest.name,
        description: createGroupRequest.description,
        timestamp: new Date().toISOString()
    })
}*/
