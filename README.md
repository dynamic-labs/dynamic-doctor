# Dynamic-Doctor 🩺

![Dynamic-Doctor 🩺](https://github.com/dynamic-labs/dynamic-doctor/assets/107057105/af7b4146-6c09-42d1-8578-2287645b5f84)

## Use case

You can use this package to verify your Dynamic SDK setup and generate a report that can be reviewed by the Dynamic Team.

## How to use

1. Go to root directory of your project.
2. Run `npx dynamic-doctor run`

That's all!

You will see a list of issues found and a file `dynamic-doctor-report-<timestamp>.html` will be generated in your root directory.

## Running locally

1. Install dependencies `yarn`
2. Run `yarn build`
3. Next pack local library `yarn pack`
4. Install package `npm i -g dynamic-doctor-v0.0.1.tgz`

That's your setup!

Now you can go to the directory you want to check and simply run `dynamic-doctor run`.

## Contributing

Want to contribute? We are more than happy to hear that!

### Setup

1. Clone the repo
2. Install dependencies `yarn`

Boom! You are ready to go.

### Commit messages

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for commit messages.

### PR Guidelines

1. Create a PR with a descriptive title and description.
2. Add a screenshot if you are making any UI (terminal integration) changes.
3. Add a link to the report if you are making any changes to the report.
4. Add a link to the issue you are fixing.

### Issues

Create an issue if you find any bug or want to suggest an improvement.
[Create an issue](https://github.com/dynamic-labs/dynamic-doctor/issues/new)

## License

This project is licensed under the MIT License - see the
[License](https://github.com/dynamic-labs/dynamic-doctor/blob/main/LICENSE)
