/* eslint-disable no-unused-vars */
import { DynamoEventSource } from '@aws-cdk/aws-lambda-event-sources'
import { Construct, StackProps, RemovalPolicy } from '@aws-cdk/core'
import { LambdaRestApi, CfnAuthorizer, AuthorizationType, EndpointType, LambdaIntegration } from '@aws-cdk/aws-apigateway'
import { Table as DynamoDBTable, StreamViewType, AttributeType } from '@aws-cdk/aws-dynamodb'
import { Function as LambdaFunction, Code, Runtime, StartingPosition } from '@aws-cdk/aws-lambda'

export interface CommandConstructProps extends StackProps
{
}

export class CommandConstruct extends Construct {
  public readonly apiArn: string;
  public readonly ddbTable: DynamoDBTable;
  public readonly lambdaRestApi: LambdaRestApi;
  public readonly putCommandHandler: LambdaFunction;
  public readonly turnCommandsIntoEvents: LambdaFunction;
  public readonly ttlAttrib: string;
  private authorizer: CfnAuthorizer;

  private addAuthorizer (stack: CommandConstruct) {
    // FIXME: discover the arn of the cognito pool, instead of using magic number - Pool Id eu-west-1_mhbaJ4zc0
    stack.authorizer = new CfnAuthorizer(stack, 'OB-POOL', {
      name: 'UserPoolAuthorizer',
      restApiId: stack.lambdaRestApi.restApiId,
      type: AuthorizationType.COGNITO,
      authType: AuthorizationType.COGNITO,
      providerArns: ['arn:aws:cognito-idp:eu-west-1:384547244036:userpool/eu-west-1_mhbaJ4zc0']
    })
  }

  constructor (scope: Construct, id: string, props: CommandConstructProps = {}) {
    super(scope, id)
    // Dynamo DB
    this.ttlAttrib = 'ddbTtl'
    this.ddbTable = new DynamoDBTable(this, 'CommandsTable', {
      tableName: 'CommandsTable',
      readCapacity: 40,
      serverSideEncryption: true,
      stream: StreamViewType.NEW_IMAGE,
      pointInTimeRecovery: true,
      timeToLiveAttribute: 'ddbTtl',
      partitionKey: {
        name: 'itemId',
        type: AttributeType.STRING
      },
      // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
      // the new table, and it will remain in your account until manually deleted. By setting the policy to
      // DESTROY, cdk destroy will delete the table (even if it has data in it)
      removalPolicy: RemovalPolicy.DESTROY // NOT recommended for production code
    })
    // Lambda
    this.putCommandHandler = new LambdaFunction(this, 'PutCommands', {
      runtime: Runtime.NODEJS_10_X,
      code: Code.fromAsset('lambda'),
      handler: 'putCommands.handler',
      environment: {
        TABLE_NAME: this.ddbTable.tableName,
        PRIMARY_KEY: 'itemId'
        //  TTL: this.ttlAttrib
      }
    })
    // the lambda to process the DDB Stream
    this.turnCommandsIntoEvents = new LambdaFunction(this, 'turnCommandsIntoEvents', {
      runtime: Runtime.NODEJS_10_X,
      code: Code.fromAsset(('lambda')),
      handler: 'turnCommandsIntoEvents.handler'
    })

    // define the table as the Dynamo DB table as the Dynamo Stream source
    this.turnCommandsIntoEvents.addEventSource(new DynamoEventSource(this.ddbTable, {
      startingPosition: StartingPosition.TRIM_HORIZON,
      batchSize: 1
    }))
    // to grant the rights to list the DDB Stream
    DynamoDBTable.grantListStreams(this.turnCommandsIntoEvents)

    this.ddbTable.autoScaleWriteCapacity({
      minCapacity: 2,
      maxCapacity: 80
    })
    // better grant the writing right to the lambda ;) if you want to write
    this.ddbTable.grantReadWriteData(this.putCommandHandler)

    // API Gateway
    this.lambdaRestApi = new LambdaRestApi(this, 'restAPI', {
      restApiName: 'Put Command Service',
      description: 'This service receives the PutCommands calls',
      proxy: false,
      handler: this.putCommandHandler,
      defaultMethodOptions: undefined,
      endpointTypes: [EndpointType.EDGE]
    })

    this.lambdaRestApi.root.addMethod('POST', new LambdaIntegration(this.putCommandHandler, {
      allowTestInvoke: true
    }))

    this.apiArn = this.lambdaRestApi.arnForExecuteApi()
    // this.addAuthorizer(this)
  };
};
