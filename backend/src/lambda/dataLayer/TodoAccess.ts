import * as AWS from 'aws-sdk'
import {DocumentClient} from 'aws-sdk/clients/dynamodb'
import {TodoItem} from '../../models/TodoItem'
import {createLogger} from "../../utils/logger";
import {TodoUpdate} from "../../models/TodoUpdate";

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

    async updateTodoItem(todoItem: TodoUpdate, todoId: string, userId: string): Promise<void> {
        logger.info("Update Todo Item.", {"todoItem": todoItem});

        await this.docClient.update({
            TableName: this.todoItemsTable,
            Key: {
                'userId': userId,
                'todoId': todoId
            },
            UpdateExpression: 'set #name_field= :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeNames: {
                "#name_field": "name"
            },
            ExpressionAttributeValues: {
                ':name': todoItem.name,
                ':dueDate': todoItem.dueDate,
                ':done': todoItem.done
            }
        }).promise();
    }

    async deleteTodoItem(todoId: string, userId: string): Promise<void> {
        logger.info("Delete Todo Item.", {"todoId": todoId, "userId": userId});

        await this.docClient
            .delete({
                TableName: this.todoItemsTable,
                Key: {
                    'userId': userId,
                    'todoId': todoId
                }
            }).promise();
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