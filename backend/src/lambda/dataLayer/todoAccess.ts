/*
import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
*/
import { TodoItem } from '../../models/TodoItem'

export class TodoAccess {

    /*constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todoTable = process.env.TODO_TABLE) {
    }*/

    async getAllTodoItemsForUser(userId: string): Promise<TodoItem[]> {
        console.log('Getting all groups')

        /*const result = await this.docClient.scan({
            TableName: this.groupsTable
        }).promise()

        const items = result.Items
        return items as Group[]*/

        // Mockdata
        const items = mockData.items as TodoItem[]
        return items.filter(item => { return (userId.localeCompare(item.userId)) == 0})
    }
}
/*
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
*/

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