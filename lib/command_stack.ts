
import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import apigw = require('@aws-cdk/aws-apigateway');
import ddb = require('@aws-cdk/aws-dynamodb');

export interface CommandStackProps {
}

export class CommandStack extends cdk.Construct {
  /** @returns the ARN of the API Gateway */
  public readonly apiArn: string;
  private readonly ddbTable: ddb.Table;
  private readonly lambdaRestApi: apigw.LambdaRestApi;

  constructor (scope: cdk.Construct, id: string, props: CommandStackProps = {}) {
    super(scope, id)
    // S3

    // Dynamo DB
    this.ddbTable = new ddb.Table(this, 'CommandsTable', {
      tableName: 'CommandsTable',
      readCapacity: 50,
      serverSideEncryption: true,
      stream: ddb.StreamViewType.NEW_AND_OLD_IMAGES,
      pointInTimeRecovery: true,

      partitionKey: {
        name: 'itemId',
        type: ddb.AttributeType.STRING
      },
      // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
      // the new table, and it will remain in your account until manually deleted. By setting the policy to
      // DESTROY, cdk destroy will delete the table (even if it has data in it)
      removalPolicy: cdk.RemovalPolicy.DESTROY // NOT recommended for production code
    })
    this.ddbTable.autoScaleWriteCapacity({
      minCapacity: 2,
      maxCapacity: 10
    })
    // Lambda
    const putCommandHandler: lambda.Function = new lambda.Function(this, 'put_command', {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'put_command.putCommand',
      environment: {
        TABLE_NAME: this.ddbTable.tableName,
        PRIMARY_KEY: 'itemId'
      }
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
    this.lambdaRestApi.root.addMethod('POST')

    this.apiArn = this.lambdaRestApi.arnForExecuteApi()
  };
};
