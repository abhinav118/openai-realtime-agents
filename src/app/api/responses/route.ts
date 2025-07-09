import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Proxy endpoint for the OpenAI Responses API
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { openAIApiKey, ...openaiBody } = body;
    if (!openAIApiKey) {
      return NextResponse.json({ error: "Missing OpenAI API key" }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey: openAIApiKey });

    if (openaiBody.text?.format?.type === 'json_schema') {
      return await structuredResponse(openai, openaiBody);
    } else {
      return await textResponse(openai, openaiBody);
    }
  } catch (err) {
    console.error('responses proxy error', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}

async function structuredResponse(openai: OpenAI, body: any) {
  try {
    const response = await openai.responses.parse({
      ...(body as any),
      stream: false,
    });
    return NextResponse.json(response);
  } catch (err: any) {
    console.error('responses proxy error', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}

async function textResponse(openai: OpenAI, body: any) {
  try {
    const response = await openai.responses.create({
      ...(body as any),
      stream: false,
    });
    return NextResponse.json(response);
  } catch (err: any) {
    console.error('responses proxy error', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
  
