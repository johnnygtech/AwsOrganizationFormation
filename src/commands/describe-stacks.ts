import { Command } from 'commander';
import { ICfnTarget } from '../state/persisted-state';
import { BaseCliCommand, ICommandArgs } from './base-command';

const commandName = 'describe-stacks';
const commandDescription = 'list all stacks deployed to accounts using org-formation';

export class DescribeStacksCommand extends BaseCliCommand<IDescribetackCommandArgs> {

    constructor(command: Command) {
        super(command, commandName, commandDescription);
    }

    public addOptions(command: Command) {
        super.addOptions(command);
        command.option('--stack-name [stack-name]', 'output will be limited to stacks of this name');
    }

    public async performCommand(command: IDescribetackCommandArgs) {
        const stackName = command.stackName;

        const state = await this.getState(command);
        const record: Record<string, ICfnTarget[]> = {};
        for (const stack of state.listStacks()) {
            if (stackName && stack !== command.stackName) {
                continue;
            }
            record[stack] = [];
            for (const target of state.enumTargets(stack)) {
                record[stack].push(target);
            }

        }
        console.log(JSON.stringify(record, null, 2));
    }
}

interface IDescribetackCommandArgs extends ICommandArgs {
    stackName?: string;
}
