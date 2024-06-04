import { orchestrator } from '../../tests/orchestrator';

resetTables();

async function resetTables() {
  return orchestrator.resetDatabase();
}
