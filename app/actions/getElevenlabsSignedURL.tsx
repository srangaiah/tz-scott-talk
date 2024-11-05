'use server';

interface ElevenLabsResponse {
  signed_url: string;
}

export async function getElevenLabsSignedUrl(agentId: string): Promise<{ signed_url: string } | { error: string }> {
  try {
    if (!process.env.ELEVENLABS_API_KEY) {
      throw new Error('ElevenLabs API key is not configured');
    }

    const requestHeaders = new Headers();
    requestHeaders.set('xi-api-key', process.env.ELEVENLABS_API_KEY);

    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
      {
        method: 'GET',
        headers: requestHeaders,
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const body = await response.json() as ElevenLabsResponse;
    return { signed_url: body.signed_url };

  } catch (error) {
    console.error('Error getting ElevenLabs signed URL:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}