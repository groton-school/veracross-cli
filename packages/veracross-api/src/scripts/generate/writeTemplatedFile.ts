import fs from 'node:fs';
import path from 'node:path';
import { Colors } from '@qui-cli/colors';
import Handlebars from 'handlebars';

const templates: Record<string, HandlebarsTemplateDelegate> = {};

export function renderTemplate(
  template: string,
  filePath: string,
  args: Record<string, unknown>
) {
  if (!(template in templates)) {
    templates[template] = Handlebars.compile(
      fs.readFileSync(
        path.join(
          import.meta.dirname,
          '../../templates',
          `${template}.handlebars`
        ),
        'utf-8'
      )
    );
  }
  if (!(template in templates)) {
    throw new Error(
      Colors.error(`Missing template ${Colors.varName(template)}`)
    );
  }
  fs.writeFileSync(filePath, templates[template](args));
}
