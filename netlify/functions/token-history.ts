import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { symbol = 'KIRBY', days = '7' } = event.queryStringParameters || {};
    const KIRBY_TOKEN_ADDRESS = 'EoLW32eUjN9XibMLEb53CMzLtg9XxnHFU6fbpSukjups';
    
    // No historical data available for new tokens
    // Return empty array - TokenChart will handle gracefully
    const historicalData: any[] = [];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        symbol: symbol.toUpperCase(),
        days: parseInt(days.toString()),
        prices: historicalData
      }),
    };
  } catch (error) {
    console.error('Historical API Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
    };
  }
};