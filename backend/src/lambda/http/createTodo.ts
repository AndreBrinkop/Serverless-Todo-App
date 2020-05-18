import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import {getUserId} from "../utils";
import {createLogger} from "../../utils/logger";
import {createTodoItem} from "../businessLogic/todos";

const logger = createLogger('createTodo')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event)
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  logger.info('Create new Todo Item.', {"userId": userId, "newTodo": newTodo})

  const newItem = await createTodoItem(newTodo, userId);
  logger.info('Created new Todo Item.', {"userId": userId, "newItem": newItem})

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      newItem
    })
  }
}
