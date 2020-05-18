const AWSXRay = require('aws-xray-sdk');
import {DocumentClient} from 'aws-sdk/clients/dynamodb'
import {TodoItem} from '../../models/TodoItem'
import {createLogger} from "../../utils/logger";
import {TodoUpdate} from "../../models/TodoUpdate";

const logger = createLogger('TodoAccess')
const bucketName = process.env.BUCKET_NAME
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

// Capture all AWS clients we create
const AWS = AWSXRay.captureAWS(require('aws-sdk'));

const s3Client = new AWS.S3({
    signatureVersion: 'v4'
})

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

        logger.info("Delete Todo Attachment.", {"bucketName": bucketName, "todoId": todoId});
        await s3Client.deleteObject({
            Bucket: bucketName,
            Key: todoId
        }).promise()
    }

    async createUploadUrl(todoId: string, userId: string): Promise<string> {
        logger.info('Create signed url', todoId)

        const uploadUrl = await s3Client.getSignedUrl('putObject', {
            Bucket: bucketName,
            Key: todoId,
            Expires: parseInt(urlExpiration)
        })

        // remove signing parameters
        const downloadUrl = uploadUrl.split("?")[0]
        logger.info('Created signed url', {"signedUploadUrl": uploadUrl, "downloadUrl": downloadUrl})

        await this.docClient.update({
            TableName: this.todoItemsTable,
            Key: {
                'userId': userId,
                'todoId': todoId
            },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': downloadUrl
            }
        }).promise();

        return uploadUrl
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