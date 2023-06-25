# TruewalletWeb

## UX optimization strategies

* Modified function for private keys generation. Generation based on application type, application id, user id, and wallet number. In this project, we use Facebook as OAuth 2.0 provider. So, the user id is unique for each OAuth 2.0 application and has a length of 16 digits. Brutforce will take a lot of time. Anyway, for security purposes it is good to add a `pin code` to make an entropy stronger. From the user's perspective, it means that his wallet available on all devices and browsers. [Implementation](https://github.com/TrueWallet/ETHGlobal2023/blob/main/src/app/create-wallet/services/create-wallet.service.ts#L52)
* Transaction payer. A user could choose how he wants to pay the transaction fee. There are 3 options: native token, ERC20 token, sponsor. [Sponsor implementation](https://github.com/TrueWallet/ETHGlobal2023/blob/main/src/app/wallet/services/wallet.service.ts#L185)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
