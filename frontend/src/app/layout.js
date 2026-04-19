import "./globals.css";

export const metadata = {
  title: "FIFA World Cup 2026 Simulator",
  description:
    "A probabilistic, full-stack FIFA World Cup 2026 tournament simulator with interactive brackets, Monte Carlo analysis, and match prediction.",
  keywords: "FIFA, World Cup, 2026, Simulator, Football, Soccer, Tournament",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/trophy.png" />
      </head>
      <body className="font-body antialiased min-h-screen bg-fifa-dark text-white">
        {children}
      </body>
    </html>
  );
}
