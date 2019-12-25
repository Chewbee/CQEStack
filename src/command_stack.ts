/* eslint-disable no-unused-vars */
import { AuthorizationType, CfnAuthorizer, EndpointType } from '@aws-cdk/aws-apigateway'
import { DynamoEventSource } from '@aws-cdk/aws-lambda-event-sources'
import { StackProps, Stack } from '@aws-cdk/core'
import APIGateway = require('@aws-cdk/aws-apigateway');
import dynamoDB = require('@aws-cdk/aws-dynamodb');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/core');

export interface CommandStackProps extends StackProps
{
}

export class CommandStack extends cdk.Construct {
  /** @returns the ARN of the API Gateway */
  public readonly apiArn: string;
  public readonly ddbTable: dynamoDB.Table;
  public readonly lambdaRestApi: APIGateway.LambdaRestApi;
  public readonly putCommandHandler: lambda.Function;
  public readonly turnCommandsIntoEvents: lambda.Function;
  public readonly ttlAttrib: string;
  private authorizer: CfnAuthorizer;

  private addAuthorizer (stack: CommandStack) {
    // FIXME: discover the arn of the cognito pool, instead of using magic number - Pool Id eu-west-1_mhbaJ4zc0
    stack.authorizer = new CfnAuthorizer(stack, 'OB-POOL', {
      name: 'UserPoolAuthorizer',
      restApiId: stack.lambdaRestApi.restApiId,
      type: AuthorizationType.COGNITO,
      authType: AuthorizationType.COGNITO,
      providerArns: ['arn:aws:cognito-idp:eu-west-1:384547244036:userpool/eu-west-1_mhbaJ4zc0']
    })
  }

  constructor (scope: cdk.Construct, id: string, props: CommandStackProps = {}) {
    super(scope, id)

    // Dynamo DB
    this.ttlAttrib = 'ddbTtl'
    this.ddbTable = new dynamoDB.Table(this, 'CommandsTable', {
      tableName: 'CommandsTable',
      readCapacity: 40,
      serverSideEncryption: true,
      stream: dynamoDB.StreamViewType.NEW_AND_OLD_IMAGES,
      pointInTimeRecovery: true,
      timeToLiveAttribute: 'ddbTtl',
      partitionKey: {
        name: 'itemId',
        type: dynamoDB.AttributeType.STRING
      },
      // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
      // the new table, and it will remain in your account until manually deleted. By setting the policy to
      // DESTROY, cdk destroy will delete the table (even if it has data in it)
      removalPolicy: cdk.RemovalPolicy.DESTROY // NOT recommended for production code
    })
    // Lambda
    this.putCommandHandler = new lambda.Function(this, 'put_command', {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'putCommands.handler',
      environment: {
        TABLE_NAME: this.ddbTable.tableName,
        PRIMARY_KEY: 'itemId'
        //  TTL: this.ttlAttrib
      }
    })
    // the lambda to process the DDB Stream
    this.turnCommandsIntoEvents = new lambda.Function(this, 'turnCommandsIntoEvents', {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromAsset(('lambda')),
      handler: 'turnCommandsIntoEvents.handler'
    })

    // define the table as the Dynamo DB table as the Dynamo source
    this.turnCommandsIntoEvents.addEventSource(new DynamoEventSource(this.ddbTable, {
      startingPosition: lambda.StartingPosition.TRIM_HORIZON,
      batchSize: 1
    }))
    // to grant the rights to list the DDB Stream
    dynamoDB.Table.grantListStreams(this.turnCommandsIntoEvents)

    this.ddbTable.autoScaleWriteCapacity({
      minCapacity: 2,
      maxCapacity: 80
    })
    // better grant the writing right to the lambda ;) if you want to write
    this.ddbTable.grantReadWriteData(this.putCommandHandler)

    // API Gateway
    this.lambdaRestApi = new APIGateway.LambdaRestApi(this, 'restAPI', {
      restApiName: 'Put Command Service',
      description: 'This service receives the command',
      proxy: false,
      handler: this.putCommandHandler,
      defaultMethodOptions: undefined,
      endpointTypes: [EndpointType.EDGE]
    })

    this.lambdaRestApi.root.addMethod('POST', new APIGateway.LambdaIntegration(this.putCommandHandler, {
      allowTestInvoke: true
    }))

    this.apiArn = this.lambdaRestApi.arnForExecuteApi()
    // this.addAuthorizer(this)
  };
};
