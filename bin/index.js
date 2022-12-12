#! /usr/bin/env node

const chalk = require("chalk");
const boxen = require("boxen");
const ora = require("ora");
const utils = require("./utils.js");
const translate = require("@vitalets/google-translate-api");
const usage = chalk.keyword("violet")(
  "\nUsage: tran <lang_name> sentence to be translated"
);

const yargs = require("yargs");

const options = yargs
  .usage(usage)
  .option("l", {
    alias: "languages",
    describe: "List all supported languages.",
    type: "boolean",
    demandOption: false,
  })
  .help(true).argv;

if (yargs.argv.l == true || yargs.argv.languages == true) {
  const spinner = ora("Loading languages").start();

  setTimeout(() => {
    spinner.color = "yellow";
    spinner.text = "Languages Loaded!";
    spinner.succeed();
    utils.showAll();
  }, 500);

  return;
}

if (yargs.argv._[0] == null) {
  utils.showHelp();
  return;
}

if (yargs.argv._[0]) {
  let language = yargs.argv._[0].toLowerCase(); // stores the language.

  let sentence = "";

  //parsing the sentence to be translated.
  sentence = utils.parseSentence(yargs.argv._);

  if (sentence == "") {
    console.error(
      chalk.red.bold(
        "\nThe entered sentence is like John Cena, I can't see it!\n"
      )
    );
    console.log(chalk.green("Enter tran --help to get started.\n"));
    return;
  }

  //parsing the language specified to the ISO-639-1 code.
  language = utils.parseLanguage(language);

  const spinner = ora(`Translating language to ${language}`).start();

  //terminating the program if the language is unsupported.
  if (language == null) {
    spinner.color = "red";
    spinner.text = "Languages is not supported!";
    spinner.fail();
    return;
  }

  translate(sentence, { to: language })
    .then((res) => {
      spinner.color = "green";
      spinner.text = "Language translated!";
      spinner.succeed();
      console.log(
        "\n" +
          boxen(chalk.green("\n" + res.text + "\n"), {
            padding: 1,
            borderColor: "green",
            dimBorder: true,
          }) +
          "\n"
      );
    })
    .catch((err) => {
      spinner.color = "yellow";
      spinner.text = `Some Error Occured!: Error - '${err.code}'`;
      spinner.fail();
    });
}
