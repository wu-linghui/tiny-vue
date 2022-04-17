import { NodeType } from "./ast";

const enum TagType {
    Start,
    End,
}


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
    const str = context.source;
    if (str.startsWith("{{")) node = parseInterpolation(context);
    if (str[0] === "<") /[a-z]/i.test(str[1]) && (node = parseElement(context));
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

function parseElement (context) {
    const element = parseTag(context, TagType.Start);
    parseTag(context, TagType.End);
    return element;
}

function parseTag (context, type: TagType) {
    const match: any = /^<\/?([a-z]*)/i.exec(context.source);
    const tag = match[1];

    advanceBy(context, match[0].length);
    advanceBy(context, 1);

    if (type === TagType.End) return;
    return {
        type: NodeType.ELEMENT,
        tag
    }
}


function advanceBy (context, length: number) {
    context.source = context.source.slice(length);
}

