import { NodeType } from "./ast";

const enum TagType {
    START,
    END,
}


export function baseParse (content: string) {
    const context = createParserContext(content);
    return createRoot(parseChildren(context, []));
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

function parseChildren (context: {source: string}, ancestors) {
    const nodes: any = [];
    while (!isEnd(context, ancestors)) {
        let node;
        const str = context.source;
        if (str.startsWith("{{")) node = parseInterpolation(context);
        if (str[0] === "<") /[a-z]/i.test(str[1]) && (node = parseElement(context, ancestors));
        if (!node) node = parseText(context);
        // node = parseInterpolation(context);
        nodes.push(node);        
    }
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
    const rawContent = parseTextData(context, rawContentLength);
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

function parseElement (context: {source: string}, ancestors) {
    let element: any = parseTag(context, TagType.START);
    ancestors.push(element);
    element.children = parseChildren(context, ancestors);
    ancestors.pop();
    if (startsWithEndTagOpen(context.source, element.tag)) {
        parseTag(context, TagType.END);        
    } else {
        throw new Error(`${element.tag}缺少结束标签!`)
    }
    return element;
}

function parseText (context) {
    let endIndex = context.source.length;
    let endTokens = ["<", "{{"];
    for (let i = 0; i < endTokens.length; i++) {
        const index = context.source.indexOf(endTokens[i]);
        if (index != -1 && endIndex > index) endIndex = index;        
    }
    const content = parseTextData(context, endIndex);
    advanceBy(context, content.length);
    return {
        type: NodeType.TEXT,
        content
    }
}

function parseTag (context, type: TagType) {
    const match: any = /^<\/?([a-z]*)/i.exec(context.source);
    const tag = match[1];

    advanceBy(context, match[0].length);
    advanceBy(context, 1);

    if (type === TagType.END) return;
    return {
        type: NodeType.ELEMENT,
        tag
    }
}

function parseTextData (context: any, length: number) {
    return context.source.slice(0, length);
}


function advanceBy (context, length: number) {
    context.source = context.source.slice(length);
}


function isEnd (context, ancestors) {
    const str = context.source;
    if (str.startsWith("</")) {
        // if (ancestors && str.startsWith(`</${ancestors}>`)) return true;
        for (let index = ancestors.length - 1; index >= 0; index--) {
            const tag = ancestors[index].tag;
            if (startsWithEndTagOpen(str, tag)) return true;
        }
    }
    return !str;
}

function startsWithEndTagOpen (source, tag) {
    const endTokenLength = "</".length;
    return source.slice(endTokenLength, tag.length + endTokenLength) == tag;
}

