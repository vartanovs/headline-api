/**
 * @module server/index.ts
 * @description Server Entry Point
 */

// Import active server
import app from './app';

// Specify PORT (if not specified in ENV)
const PORT = process.env.PORT || '3000';

app.listen(PORT, () => console.log(`Server listening on PORT: ${PORT}`));
