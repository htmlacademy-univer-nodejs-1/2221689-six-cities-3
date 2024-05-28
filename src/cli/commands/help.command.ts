import { Command } from './command.interface.js';
import chalk from 'chalk';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(chalk.green(`
            Программа для подготовки данных для REST API сервера.
            Пример:
                cli.js --<command> [--arguments]
            Команды:
                --version:                   # выводит номер версии
                --help:                      # печатает этот текст
                --import <path> <db_user> <db_password> <db_host> <db_name> <salt>:             # импортирует данные из TSV
                --generate <n> <path> <url>  # генерирует произвольное количество тестовых данных    
        `));
  }
}

