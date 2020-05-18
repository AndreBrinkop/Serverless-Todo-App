import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../../models/TodoItem'
import {createLogger} from "../../utils/logger";

const logger = createLogger('TodoAccess')

export class TodoAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todoItemsTable = process.env.TODO_ITEMS_TABLE) {
    }

    async getAllTodoItemsForUser(userId: string): Promise<TodoItem[]> {
        logger.info("Get all Todo Items for User.", {"userId": userId})
        const result = await this.docClient
            .query({
                TableName: this.todoItemsTable,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            })
            .promise()
        return result.Items as TodoItem[]
    }

    async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
        logger.info("Create new Todo Item.", {"todoItem": todoItem});

        await this.docClient.put({
            TableName: this.todoItemsTable,
            Item: todoItem
        }).promise();

        return todoItem
    }
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance')
        return new AWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }
    return new AWS.DynamoDB.DocumentClient()
}