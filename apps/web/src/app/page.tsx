import { Button } from '@braves-journal/ui';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Braves Journal</h1>
      <Button variant="primary">Get Started</Button>
    </main>
  );
}
