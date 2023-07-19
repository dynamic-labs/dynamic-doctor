import path from 'path';

import pug from 'pug';

import { BasicData } from '../getBasicData';
import { ConfigFile } from '../getAllConfigs';

import { formatBasicData } from './helpers/formatBasicData';
import { createHtmlFile } from './helpers/createHtmlFile';

export const generateReport = (
  basicData: BasicData,
  configFiles: ConfigFile[],
) => {
  const templatePath = path.resolve(__dirname, '../../../templates/report.pug');
  const compiledFile = pug.compileFile(templatePath);

  const html = compiledFile({
    basicData: formatBasicData(basicData),
    configFiles,
  });

  createHtmlFile(html);
};
