import Link from 'next/link';

export default function AuthLayout({ children }: React.PropsWithChildren) {
  return (
    <div
      className="relative grid min-h-screen grid-cols-1 overflow-hidden lg:grid-cols-2"
      style={{
        background:
          'linear-gradient(143.6deg, rgba(192, 132, 252, 0) 20.79%, rgba(232, 121, 249, 0.26) 40.92%, rgba(204, 171, 238, 0) 70.35%)',
      }}
    >
      <main className="absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 items-center lg:static lg:left-0 lg:top-0 lg:flex lg:translate-x-0 lg:translate-y-0">
        {children}
      </main>
    </div>
  );
}
