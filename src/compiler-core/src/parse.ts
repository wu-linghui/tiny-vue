import { NodeType } from "./ast";

export function baseParse (content: string) {
    const context = createParserContext(content);
    return createRoot(parseChildren(context));
}

function createParserContext (content: string) {
    return {
        source: content,
    }
}

function createRoot (children) {
    return {
        children,
    }
}

function parseChildren (context) {
    const nodes: any = [];
    let node;
    if (context.source.startsWith("{{")) node = parseInterpolation(context);
    // node = parseInterpolation(context);
    nodes.push(node);
    return nodes;
}

function parseInterpolation (context: { source: string}) {
    const openDelimiter = "{{";
    const closeDelimiter = "}}";
    const closeIndex = context.source.indexOf(
        closeDelimiter,
        openDelimiter.length
    );

    advanceBy(context, openDelimiter.length);

    const rawContentLength = closeIndex - openDelimiter.length;
    const rawContent = context.source.slice(0, rawContentLength);
    const content = rawContent.trim();
    advanceBy(context, rawContentLength + closeDelimiter.length);
    return {
        type: NodeType.INTERPOLATION,
        content: {
            type: NodeType.SIMPLE_EXPRESSION,
            content: content
        },
    }
}


function advanceBy (context, length: number) {
    context.source = context.source.slice(length);
}

