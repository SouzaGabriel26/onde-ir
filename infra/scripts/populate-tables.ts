import { orchestrator } from '../../tests/orchestrator';

populateTables();

async function populateTables() {
  return orchestrator.populateTables();
}
