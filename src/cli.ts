#!/usr/bin/env node
import 'reflect-metadata';
import CliApplication from './app/cli-application.js';
import { GenerateCommand } from './cli-command/generate-command.js';
import HelpCommand from './cli-command/help-command.js';
import ImportCommand from './cli-command/import-command.js';
import VesionCommand from './cli-command/version-command.js';

const myManager = new CliApplication;
myManager.registerCommands([
  new VesionCommand,
  new HelpCommand,
  new ImportCommand,
  new GenerateCommand,
]);
myManager.processCommand(process.argv);
