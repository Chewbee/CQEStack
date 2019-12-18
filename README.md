# Command Stack pour la plateforme team 

Projet contient:
- une API GW pour lambda avec 
- une lambda fonction en POST putCommand
- une Dynamo DB pour stocker les commandes
  - stream enabled
  - cyphered

# How to deploy 

1. `cdk bootstrap` : va installer les truc de base
2. `cdk synth` : va composer la stack CFn
3. `cdk deploy` : va déployer la stack 

## From Aws

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
