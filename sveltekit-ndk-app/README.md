# SvelteKit NDK App

This project is a SvelteKit application that utilizes the NDK (Nostr Development Kit) library for building decentralized applications. It incorporates Tailwind CSS for styling, providing a modern and responsive UI.

## Features

- User authentication via browser extension or key pair creation.
- Ability to submit questions and receive comments.
- Voting mechanism after a timer expires.
- Real-time event handling using Nostr protocol.

## Project Structure

```
sveltekit-ndk-app
├── src
│   ├── lib
│   │   └── components
│   │       └── ExampleComponent.svelte
│   ├── routes
│   │   ├── +layout.svelte
│   │   ├── +page.svelte
│   │   └── api
│   │       └── +server.js
│   ├── app.css
│   └── app.html
├── static
│   └── favicon.ico
├── tailwind.config.cjs
├── postcss.config.cjs
├── package.json
├── svelte.config.js
├── tsconfig.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd sveltekit-ndk-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## Usage

- Users can log in using a browser extension or create a new key pair.
- After logging in, users can submit questions and view responses.
- Comments can be made until the timer expires, after which users can vote on the questions.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.