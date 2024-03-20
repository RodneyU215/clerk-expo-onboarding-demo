## Getting Started

### Prerequisites

- React v16+
- Node.js v14+

### Setup

To run the example locally you need to:

1. Sign up at [Clerk.dev](https://www.clerk.dev/).
2. Go to your [Clerk dashboard](https://dashboard.clerk.dev/) and create an application.
3. Set your publishableKey in `App.tsx` or if you are using a legacy key frontendApi
4. `npm i` to install the required dependencies.
5. `npm run start` to launch the Expo development server.

### Sign up & Sign in configuration

For the sign up flow to work, you need to log into your [Clerk Dashboard](https://dashboard.clerk.dev/) and make sure the following settings have been configured in **User & Authentication** and **Social login** sections:

#### For development instances

1. In Contact information section enable **Email Address**. Ensure **Verify at sign-up** is on and pick **Email verification code** method in the modal.
2. In Authentication factors section enable **Password** and **Email verification code**.
3. In Personal information, enable **Name** to use first and last names during sign up
4. In Social Login, enable **Google** Oauth provider.
