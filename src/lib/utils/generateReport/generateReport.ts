import path from 'path';

import pug from 'pug';

import { BasicData } from '../getBasicData';
import { PackageJson } from '../getAllPackageJson';

import { formatBasicData } from './helpers/formatBasicData';
import { createHtmlFile } from './helpers/createHtmlFile';

export const generateReport = (
  basicData: BasicData,
  packageJsons: PackageJson[],
) => {
  const templatePath = path.resolve(__dirname, '../../../templates/report.pug');
  const compiledFile = pug.compileFile(templatePath);

  const html = compiledFile({
    basicData: formatBasicData(basicData),
    packageJsons,
  });

  createHtmlFile(html);
};
