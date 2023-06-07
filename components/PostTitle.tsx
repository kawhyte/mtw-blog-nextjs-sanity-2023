export default function PostTitle({ children }) {
  return (
    <h1 className="py-2 md:py-2 z-10 font-fancy text-2xl md:text-3xl lg:text-5xl  font-semibold tracking-tighter leading-tight md:leading-none  text-center md:text-left">
      {children}
    </h1>
  )
}
