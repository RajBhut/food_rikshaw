import NodeCache from 'node-cache';

export const orderCache = new NodeCache({ stdTTL: 300 });
export const purchaseCache = new NodeCache({ stdTTL: 9000 });
export const productCache = new NodeCache({ stdTTL: 300 });
