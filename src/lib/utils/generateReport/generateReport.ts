import path from 'path';

import pug from 'pug';

import { BasicData } from '../getBasicData';
import { ConfigFile } from '../getAllConfigs';

import { formatBasicData } from './helpers/formatBasicData';
import { createHtmlFile } from './helpers/createHtmlFile';
import { Issue } from '../issueCollector/IssueCollector';

export const generateReport = async (
  basicData: BasicData,
  configFiles: ConfigFile[],
  issues: Issue[],
) => {
  const templatePath = path.resolve(__dirname, 'src/templates/report.pug');
  const compiledFile = pug.compileFile(templatePath);

  const html = compiledFile({
    basicData: formatBasicData(basicData),
    configFiles,
    issues,
  });

  await createHtmlFile(html);
};
