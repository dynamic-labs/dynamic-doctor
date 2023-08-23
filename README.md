# Dynamic-Doctor 🩺

![Dynamic-Doctor 🩺](https://github.com/dynamic-labs/dynamic-doctor/assets/107057105/af7b4146-6c09-42d1-8578-2287645b5f84)

## Use case

You can use this package to verify your Dynamic SDK setup and generate a report that can be reviewed by the Dynamic Team.

## How to use

1. Go to root directory of your project.
2. Run `npx dynamic-doctor run`

That's all!

You will see a list of issues found and a file `dynamic-doctor-report-<timestamp>.html` will be generated in your root directory.

## Building

1. Install dependencies `yarn`
2. Run `yarn build`
3. Next pack local library `yarn pack`
4. Install package `npm i -g dynamic-doctor-v0.0.1.tgz`

That's your setup!

Now you can go to the directory you want to check and simply run `dynamic-doctor run`.
