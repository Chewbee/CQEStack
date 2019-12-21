import { CfnAuthorizer } from '@aws-cdk/aws-apigateway'
import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import apigw = require('@aws-cdk/aws-apigateway');
import ddb = require('@aws-cdk/aws-dynamodb');

export interface CommandStackProps {
}

export class CommandStack extends cdk.Construct {
  /** @returns the ARN of the API Gateway */
  public readonly apiArn: string;
  public readonly ddbTable: ddb.Table;
  public readonly lambdaRestApi: apigw.LambdaRestApi;
  public readonly ttlAttrib: string;
  private authorizer: CfnAuthorizer ;

  private addAuthorizer (stack: CommandStack) {
    // TOFIX: discover the arn of the cognito pool, instead of using magic number - Pool Id eu-west-1_mhbaJ4zc0
    stack.authorizer = new CfnAuthorizer(stack, 'UserPool', {
      name: 'UserPoolAuthorizer',
      restApiId: stack.lambdaRestApi.restApiId,
      type: apigw.AuthorizationType.COGNITO,
      providerArns: ['arn:aws:cognito-idp:eu-west-1:384547244036:userpool/eu-west-1_mhbaJ4zc0']
    })
  }

  constructor (scope: cdk.Construct, id: string, props: CommandStackProps = {}) {
    super(scope, id)

    // Dynamo DB
    this.ttlAttrib = 'ddbTtl'
    this.ddbTable = new ddb.Table(this, 'CommandsTable', {
      tableName: 'CommandsTable',
      readCapacity: 40,
      serverSideEncryption: true,
      stream: ddb.StreamViewType.NEW_AND_OLD_IMAGES,
      pointInTimeRecovery: true,
      timeToLiveAttribute: this.ttlAttrib,
      partitionKey: {
        name: 'itemId',
        type: ddb.AttributeType.STRING
      },
      // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
      // the new table, and it will remain in your account until manually deleted. By setting the policy to
      // DESTROY, cdk destroy will delete the table (even if it has data in it)
      removalPolicy: cdk.RemovalPolicy.DESTROY // NOT recommended for production code
    })
    // Lambda
    const putCommandHandler: lambda.Function = new lambda.Function(this, 'put_command', {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'put_command.putCommand',
      environment: {
        TABLE_NAME: this.ddbTable.tableName,
        PRIMARY_KEY: 'itemId'
        //  TTL: this.ttlAttrib
      }
    })

    this.ddbTable.autoScaleWriteCapacity({
      minCapacity: 2,
      maxCapacity: 10
    })
    // better grant the writing right to the lambda ;) if you want to write
    this.ddbTable.grantReadWriteData(putCommandHandler)

    // API Gateway
    this.lambdaRestApi = new apigw.LambdaRestApi(this, 'restAPI', {
      restApiName: 'Put Command Service',
      description: 'This service receives the command',
      proxy: false,
      handler: putCommandHandler
    })
    this.lambdaRestApi.root.addMethod('POST', new apigw.LambdaIntegration(putCommandHandler, {
      allowTestInvoke: true
    }))
    this.apiArn = this.lambdaRestApi.arnForExecuteApi()
    // this.addAuthorizer(this)
  };
};
