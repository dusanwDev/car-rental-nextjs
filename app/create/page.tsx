"use client";

import PostHouseForm from '../components/PostHouseForm';

export default function CreatePage() {
  return (
    <main
      style={{
        maxWidth: 1000,
        minHeight: '100vh',
        margin: '0 auto',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <PostHouseForm />
    </main>
  );
}
