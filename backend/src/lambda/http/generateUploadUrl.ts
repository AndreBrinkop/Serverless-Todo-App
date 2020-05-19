import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {createLogger} from "../../utils/logger";
import {createUploadUrl} from "../../businessLogic/todos";
import {getUserId} from "../utils";

const logger = createLogger('generateUploadUrl')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Generate Upload Url for user event.', {"event": event})
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

  const uploadUrl = await createUploadUrl(todoId, userId)

  logger.info('Generated Upload URL: ', {"uploadUrl": uploadUrl})

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl
    })
  }
}
