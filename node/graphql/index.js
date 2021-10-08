import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { schema, roots } from './schema';
const port = 4000;
const path = '/graphql';
const server = new WebSocketServer({ port, path });
useServer({
    onSubscribe: (ctx, { id, payload }) => {
        const ids = Object.keys(ctx.subscriptions);
        console.log('Subscribe', Object.assign({ id, ids }, payload));
    },
    onConnect: (ctx) => {
        const ids = Object.keys(ctx.subscriptions);
        console.log('Connect', { ids });
    },
    onNext: (ctx, { id }, args, result) => {
        const ids = Object.keys(ctx.subscriptions);
        const { data } = result;
        const { kind } = args.document;
        const definitions = args.document.definitions.map((def) => [
            def.operation,
            def.selectionSet.kind,
            def.selectionSet.selections
        ]);
        const document = JSON.stringify([kind, definitions]);
        console.debug('Next', { id, ids, data, document });
    },
    onError: (ctx, { id }, errors) => {
        const ids = Object.keys(ctx.subscriptions);
        console.error('Error', { id, ids, errors });
    },
    onComplete: (ctx, { id, type }) => {
        const ids = Object.keys(ctx.subscriptions);
        console.log('Complete', { id, ids });
    },
    schema,
    roots
}, server);
console.log(`🚀 Server ready at ws://localhost:${port}${path}`);
//# sourceMappingURL=index.js.map