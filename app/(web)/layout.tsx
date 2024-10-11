export default function ChatbotLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div
        className="bg-ramanujam bg-no-repeat bg-cover  bg-fixed
      h-screen  gap-16  font-[family-name:var(--font-geist-sans)] relative overflow-y-auto"
      >
        <div className="bg-black w-full h-full opacity-90 p-8 pb-20 sm:px-20">
          <div className="h-[100px] w-full text-white flex justify-center items-center flex-col gap-4">
            <div className="text-center">
              <p className="intro-text text-3xl">Sri Ramanujam, Here!</p>
              <p className="bold text-xl">How can I help!</p>
            </div>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
