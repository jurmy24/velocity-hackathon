import { anthropic } from "@ai-sdk/anthropic";
import { z } from 'zod';
import { generateObject } from 'ai';
import { Node } from "@prisma/client";

type NodeCreateInput = Omit<Node, 'id'>;

export async function getSuggestionsNodes(node: Node) {
    const {object} = await generateObject({
        model: anthropic("claude-3-haiku-20240307"),
        schema: z.object({
            suggestions: z.array(z.string()).max(3)
        }),
        system: 'You are an AI assistant specializing in generating related ideas for mindmap nodes. Your task is to provide up to 3 concise, related, or complementary ideas for a given concept. Each suggestion should be under 10 words and offer a unique perspective',
        prompt: 'Generate a list of up to 3 suggestions for the idea ${node.title}. Your should return a list of strings, with each string being a distinct idea.',
    });
    console.log(object);

    const nodeList: NodeCreateInput[] = object.suggestions.map((idea: string) => {
        return {
            boardId: node.boardId,
            authorId: node.authorId,
            author: 'AI',
            title: idea,
            content: null, // or provide a default content if needed
            xPos: node.xPos + 100, // Offset from the parent node
            yPos: node.yPos + 100, // Offset from the parent node
            createdAt: new Date(),
            updatedAt: new Date(),
            parent: node.id,
            children: [],
            connectedTo: [],
            connections: [],
            connectedFrom: {},
            isSuggestion: true,
        };
    });

    return nodeList;    
}

