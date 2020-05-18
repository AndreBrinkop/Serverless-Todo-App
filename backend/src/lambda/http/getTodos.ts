import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {TodoItem} from "../../models/TodoItem";
import {getUserId} from "../utils";
import {createLogger} from "../../utils/logger";

const logger = createLogger('getTodos.ts')

const mockData= {
    "items": [
        {
            "todoId": "123",
            "createdAt": "2019-07-27T20:01:45.424Z",
            "name": "Buy milk",
            "dueDate": "2019-07-29T20:01:45.424Z",
            "done": false,
            "attachmentUrl": "http://example.com/image.png",
            "userId" : "auth0|5ec14bdc453e230c71d9232c"
        },
        {
            "todoId": "456",
            "createdAt": "2019-07-27T20:01:45.424Z",
            "name": "Send a letter",
            "dueDate": "2019-07-29T20:01:45.424Z",
            "done": true,
            "attachmentUrl": "http://example.com/image.png"
        }
    ]
};

async function getAllTodosForUser(userId: string): Promise<TodoItem[]> {
    // Mockdata
    const items = mockData.items as TodoItem[]
    return items.filter(item => { return (userId.localeCompare(item.userId)) == 0})
}

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)
    logger.info("Get all TODOs for user.", {"userId": userId})

    const items = await getAllTodosForUser(userId)
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            items
        })
    }
}
