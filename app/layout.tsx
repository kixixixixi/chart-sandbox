import "./global.css"

export const metadata = {
  title: "Chart sandbox",
  description: "For sandobox page",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <header>Chart sandbox</header>
        <main>{children}</main>
      </body>
    </html>
  )
}
