import type { BranchRepository } from '../branches/repository.js';
import type { CatalogRepository } from './repository.js';

export class BranchNotFoundError extends Error {
  constructor() {
    super('Branch not found.');
  }
}

export function createCatalogService(branches: BranchRepository, catalog: CatalogRepository) {
  return {
    async getMenu(slug: string) {
      const branch = await branches.findBySlug(slug);
      if (!branch) throw new BranchNotFoundError();
      return { branch, items: await catalog.listForBranch(branch.id) };
    },
  };
}
