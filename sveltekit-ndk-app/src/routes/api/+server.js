import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    const data = await request.json();

    // Here you would handle the data, e.g., save it to a database or process it
    // For demonstration, we'll just return the received data

    return json({
        status: 'success',
        data: data
    });
}

export async function GET({ url }) {
    // Here you could fetch data from a database or another API
    // For demonstration, we'll return a static response

    const exampleData = {
        message: 'Hello from the API!',
        timestamp: new Date().toISOString()
    };

    return json(exampleData);
}