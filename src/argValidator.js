module.exports = function (argv) {
    const CLI_NAME = 'csv-to-json-cli';
    const HELP_FLAG = '--help';
    const SOURCE_FILE_FLAG = '--sourceFile';
    const RESULT_FILE_FLAG = '--resultFile';
    const SEPARATOR_FLAG = '--separator';
    const usageGuide = `
    Usage: ${CLI_NAME} ${SOURCE_FILE_FLAG} value ${RESULT_FILE_FLAG} value [${SEPARATOR_FLAG}] [value]

        ${SOURCE_FILE_FLAG} - Path to the csv file that need to be converted.
        ${RESULT_FILE_FLAG} - Path to the result json file.
        ${SEPARATOR_FLAG}  - Separator that is used while converting. If not specified it will be automatically detected.
    `;

    const [
        sourceFileArg,
        sourceFilePath,
        resultFileArg,
        resultFilePath,
        separatorArg,
        separator
    ] = argv;

    if (sourceFileArg === undefined || sourceFileArg === HELP_FLAG) {
        throw new Error(usageGuide);
    } else if (sourceFileArg !== SOURCE_FILE_FLAG) {
        throw new Error(`Error: Wrong command line argument ${sourceFileArg} expected ${SOURCE_FILE_FLAG}`);
    }

    if (resultFileArg === undefined) {
        throw new Error(usageGuide);
    } else if (resultFileArg !== RESULT_FILE_FLAG) {
        throw new Error(`Error: Wrong command line argument ${resultFileArg} expected ${RESULT_FILE_FLAG}`);
    }

    if (separatorArg !== undefined && separatorArg !== SEPARATOR_FLAG) {
        throw new Error(`Error: Wrong command line argument ${separatorArg} expected ${SEPARATOR_FLAG}`);
    }

    return {
        sourceFilePath,
        resultFilePath,
        separator
    };
};
